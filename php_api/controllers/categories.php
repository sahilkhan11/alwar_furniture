<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../utils/jwt.php';

$id = $segments[1] ?? null;
$action = $segments[2] ?? '';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

if ($method === 'GET' && !$id) {
    $stmt = $pdo->query("SELECT c.*, (SELECT COUNT(*) FROM product WHERE categoryId = c.id) as productCount FROM category c ORDER BY c.name ASC");
    $categories = $stmt->fetchAll();
    echo json_encode($categories);
    exit;
}

if ($method === 'GET' && $id) {
    $stmt = $pdo->prepare("SELECT * FROM category WHERE id = ?");
    $stmt->execute([$id]);
    $category = $stmt->fetch();

    if (!$category) {
        http_response_code(404);
        echo json_encode(['error' => 'category not found']);
        exit;
    }

    echo json_encode($category);
    exit;
}

// Protected Routes
$decoded = JWT::verifyAuth();
if (strtoupper($decoded->role) !== 'ADMIN') {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden']);
    exit;
}

if ($method === 'POST' && !$id) {
    $name = $input['name'] ?? null;
    $description = $input['description'] ?? null;
    
    if (!$name) {
        http_response_code(400);
        echo json_encode(['error' => 'category name is required']);
        exit;
    }

    $image = null;
    if (isset($input['image'])) {
        $image = $input['image'];
    }

    if (!empty($_FILES['image']['name'])) {
        $baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
        $uploadDir = __DIR__ . '/../../public/uploads/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

        $filename = uniqid() . '_' . basename($_FILES['image']['name']);
        if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $filename)) {
            $image = "$baseUrl/uploads/$filename";
        }
    }

    $id = uniqid();
    $stmt = $pdo->prepare('INSERT INTO category (id, name, description, image) VALUES (?, ?, ?, ?)');
    try {
        $stmt->execute([$id, $name, $description, $image]);
    } catch (\PDOException $e) {
        http_response_code(400);
        echo json_encode(['error' => 'category with this name already exists']);
        exit;
    }

    $stmt = $pdo->prepare('SELECT * FROM category WHERE id = ?');
    $stmt->execute([$id]);
    
    http_response_code(201);
    echo json_encode($stmt->fetch());
    exit;
}

if ($method === 'PUT' && $id) {
    $name = $input['name'] ?? null;
    $description = $input['description'] ?? null;
    $image = $input['image'] ?? null;

    if (!empty($_FILES['image']['name'])) {
        $baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
        $uploadDir = __DIR__ . '/../../public/uploads/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

        $filename = uniqid() . '_' . basename($_FILES['image']['name']);
        if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $filename)) {
            $image = "$baseUrl/uploads/$filename";
        }
    }

    $updates = [];
    $params = [];
    if ($name !== null) { $updates[] = "name = ?"; $params[] = $name; }
    if ($description !== null) { $updates[] = "description = ?"; $params[] = $description; }
    if ($image !== null) { $updates[] = "image = ?"; $params[] = $image; }

    if (empty($updates)) {
        $stmt = $pdo->prepare('SELECT * FROM category WHERE id = ?');
        $stmt->execute([$id]);
        echo json_encode($stmt->fetch());
        exit;
    }

    $params[] = $id;
    $query = "UPDATE category SET " . implode(', ', $updates) . " WHERE id = ?";
    $stmt = $pdo->prepare($query);
    try {
        $stmt->execute($params);
    } catch (\PDOException $e) {
        http_response_code(400);
        echo json_encode(['error' => 'Failed to update category. Name may already exist.']);
        exit;
    }

    $stmt = $pdo->prepare('SELECT * FROM category WHERE id = ?');
    $stmt->execute([$id]);
    echo json_encode($stmt->fetch());
    exit;
}

if ($method === 'DELETE' && $id) {
    $stmt = $pdo->prepare('DELETE FROM category WHERE id = ?');
    try {
        $stmt->execute([$id]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(['message' => 'category deleted successfully']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'category not found']);
        }
    } catch (\PDOException $e) {
        http_response_code(400);
        echo json_encode(['error' => 'Cannot delete category because it has associated products']);
    }
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Endpoint not found']);


