class Product {
  final String id;
  final String name;
  final String description;
  final double price;
  final int stock;
  final List<String> images;
  final String categoryName;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.stock,
    required this.images,
    required this.categoryName,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'],
      name: json['name'],
      description: json['description'] ?? '',
      price: double.parse(json['price'].toString()),
      stock: json['stock'] ?? 0,
      images: json['images'] != null ? List<String>.from(json['images']) : [],
      categoryName: json['category'] != null ? json['category']['name'] : 'Furniture',
    );
  }
}
