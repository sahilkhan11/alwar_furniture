<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../utils/jwt.php';

$id = $segments[1] ?? null;
$action = $segments[2] ?? ''; // For getById, update, delete

$method = $_SERVER['REQUEST_METHOD'];

function formatProduct($product) {
    if (isset($product['images']) && is_string($product['images'])) {
        $product['images'] = json_decode($product['images'], true) ?: [];
    }
    if (isset($product['price'])) {
        $product['price'] = (float) $product['price'];
    }
    if (isset($product['compareAtPrice'])) {
        $product['compareAtPrice'] = (float) $product['compareAtPrice'];
    }
    return $product;
}

if ($method === 'GET' && !$id) {
    $categoryId = $_GET['categoryId'] ?? null;
    $search = $_GET['search'] ?? $_GET['q'] ?? null;
    $isBestSeller = isset($_GET['isBestSeller']) && $_GET['isBestSeller'] === 'true';
    $isNewLaunch = isset($_GET['isNewLaunch']) && $_GET['isNewLaunch'] === 'true';
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : null;

    $query = "SELECT p.*, c.name as categoryName FROM product p LEFT JOIN category c ON p.categoryId = c.id";
    $params = [];
    $conditions = [];

    if ($categoryId) {
        $conditions[] = "p.categoryId = ?";
        $params[] = $categoryId;
    }
    
    if ($isBestSeller) {
        $conditions[] = "p.isBestSeller = 1";
    }
    if ($isNewLaunch) {
        $conditions[] = "p.isNewLaunch = 1";
    }

    if ($search) {
        $conditions[] = "(p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }

    if (!empty($conditions)) {
        $query .= " WHERE " . implode(' AND ', $conditions);
    }
    
    $query .= " order BY p.createdAt DESC";
    
    if ($limit && $limit > 0) {
        $query .= " LIMIT " . $limit;
    }

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $products = $stmt->fetchAll();

    $formatted = array_map(function($p) {
        $p['category'] = ['name' => $p['categoryName']];
        unset($p['categoryName']);
        return formatProduct($p);
    }, $products);

    echo json_encode($formatted);
    exit;
}

if ($method === 'GET' && $id) {
    $stmt = $pdo->prepare("SELECT p.*, c.name as categoryName, c.description as categoryDesc FROM product p LEFT JOIN category c ON p.categoryId = c.id WHERE p.id = ?");
    $stmt->execute([$id]);
    $product = $stmt->fetch();

    if (!$product) {
        http_response_code(404);
        echo json_encode(['error' => 'product not found']);
        exit;
    }

    $product['category'] = ['id' => $product['categoryId'], 'name' => $product['categoryName'], 'description' => $product['categoryDesc']];
    unset($product['categoryName']);
    unset($product['categoryDesc']);
    
    echo json_encode(formatProduct($product));
    exit;
}

// Protected Routes below
$decoded = JWT::verifyAuth();
if ($decoded->role !== 'ADMIN') {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

if ($method === 'POST' && !$id) {
    $name = $input['name'] ?? null;
    $description = $input['description'] ?? '';
    $price = $input['price'] ?? null;
    $compareAtPrice = $input['compareAtPrice'] ?? null;
    $isBestSeller = isset($input['isBestSeller']) && ($input['isBestSeller'] === 'true' || $input['isBestSeller'] === true) ? 1 : 0;
    $isNewLaunch = isset($input['isNewLaunch']) && ($input['isNewLaunch'] === 'true' || $input['isNewLaunch'] === true) ? 1 : 0;
    $variants = $input['variants'] ?? null;
    $stock = isset($input['stock']) ? (int)$input['stock'] : 0;
    $categoryId = $input['categoryId'] ?? null;

    if (!$name || !$price || !$categoryId) {
        http_response_code(400);
        echo json_encode(['error' => 'Name, price, and categoryId are required']);
        exit;
    }

    $imageUrls = [];
    if (isset($input['images'])) {
        $imageUrls = is_array($input['images']) ? $input['images'] : json_decode($input['images'], true);
    }

    $id = uniqid();
    $imagesJson = json_encode($imageUrls ?: []);
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name))) . '-' . substr($id, -6);

    $stmt = $pdo->prepare('INSERT INTO product (id, name, description, price, compareAtPrice, isBestSeller, isNewLaunch, variants, stock, categoryId, images, slug, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())');
    $stmt->execute([$id, $name, $description, $price, $compareAtPrice, $isBestSeller, $isNewLaunch, $variants, $stock, $categoryId, $imagesJson, $slug]);

    $stmt = $pdo->prepare('SELECT * FROM product WHERE id = ?');
    $stmt->execute([$id]);
    $product = $stmt->fetch();

    http_response_code(201);
    echo json_encode(formatProduct($product));
    exit;
}

if ($method === 'PUT' && $id) {
    $name = $input['name'] ?? null;
    $description = $input['description'] ?? null;
    $price = $input['price'] ?? null;
    $compareAtPrice = $input['compareAtPrice'] ?? null;
    $isBestSeller = isset($input['isBestSeller']) ? ($input['isBestSeller'] === 'true' || $input['isBestSeller'] === true ? 1 : 0) : null;
    $isNewLaunch = isset($input['isNewLaunch']) ? ($input['isNewLaunch'] === 'true' || $input['isNewLaunch'] === true ? 1 : 0) : null;
    $variants = $input['variants'] ?? null;
    $stock = isset($input['stock']) ? (int)$input['stock'] : null;
    $categoryId = $input['categoryId'] ?? null;

    $imageUrls = null;
    if (isset($input['images'])) {
        $imageUrls = is_array($input['images']) ? $input['images'] : json_decode($input['images'], true);
    }

    $updates = [];
    $params = [];
    if ($name !== null) { $updates[] = "name = ?"; $params[] = $name; }
    if ($description !== null) { $updates[] = "description = ?"; $params[] = $description; }
    if ($price !== null) { $updates[] = "price = ?"; $params[] = $price; }
    if ($compareAtPrice !== null) { $updates[] = "compareAtPrice = ?"; $params[] = $compareAtPrice; }
    if ($isBestSeller !== null) { $updates[] = "isBestSeller = ?"; $params[] = $isBestSeller; }
    if ($isNewLaunch !== null) { $updates[] = "isNewLaunch = ?"; $params[] = $isNewLaunch; }
    if ($variants !== null) { $updates[] = "variants = ?"; $params[] = $variants; }
    if ($stock !== null) { $updates[] = "stock = ?"; $params[] = $stock; }
    if ($categoryId !== null) { $updates[] = "categoryId = ?"; $params[] = $categoryId; }
    if ($imageUrls !== null) { $updates[] = "images = ?"; $params[] = json_encode($imageUrls); }

    $updates[] = "updatedAt = NOW()";
    
    if (empty($updates)) {
        $stmt = $pdo->prepare('SELECT * FROM product WHERE id = ?');
        $stmt->execute([$id]);
        echo json_encode(formatProduct($stmt->fetch()));
        exit;
    }

    $params[] = $id;
    $query = "UPDATE product SET " . implode(', ', $updates) . " WHERE id = ?";
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);

    $stmt = $pdo->prepare('SELECT * FROM product WHERE id = ?');
    $stmt->execute([$id]);
    $product = $stmt->fetch();

    echo json_encode(formatProduct($product));
    exit;
}

if ($method === 'DELETE' && $id) {
    $stmt = $pdo->prepare('DELETE FROM product WHERE id = ?');
    $stmt->execute([$id]);
    echo json_encode(['message' => 'product deleted successfully']);
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Endpoint not found']);
