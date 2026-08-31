import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/cart_provider.dart';
import '../providers/auth_provider.dart';
import 'login_screen.dart';

class CartScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final cart = Provider.of<CartProvider>(context);
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('Your Cart'),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: cart.items.length,
              itemBuilder: (ctx, i) {
                final cartItem = cart.items.values.toList()[i];
                final productId = cart.items.keys.toList()[i];
                return ListTile(
                  leading: cartItem.product.images.isNotEmpty
                      ? Image.network(cartItem.product.images[0], width: 50, height: 50, fit: BoxFit.cover)
                      : Container(width: 50, height: 50, color: Colors.grey[200]),
                  title: Text(cartItem.product.name),
                  subtitle: Text('₹${cartItem.product.price} x ${cartItem.quantity}'),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                        icon: Icon(Icons.remove),
                        onPressed: () {
                          cart.decreaseQuantity(productId);
                        },
                      ),
                      Text('${cartItem.quantity}'),
                      IconButton(
                        icon: Icon(Icons.add),
                        onPressed: () {
                          cart.addItem(cartItem.product);
                        },
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
          Card(
            margin: EdgeInsets.all(16),
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Total', style: TextStyle(fontSize: 20)),
                  Text(
                    '₹${cart.totalAmount.toStringAsFixed(2)}',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: ElevatedButton(
              onPressed: cart.itemCount == 0
                  ? null
                  : () {
                      if (!auth.isAuthenticated) {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => LoginScreen()),
                        );
                      } else {
                        // TODO: Implement Checkout logic
                        showDialog(
                          context: context,
                          builder: (ctx) => AlertDialog(
                            title: Text('Checkout'),
                            content: Text('Checkout functionality coming soon!'),
                            actions: [
                              TextButton(
                                child: Text('Okay'),
                                onPressed: () {
                                  Navigator.of(ctx).pop();
                                },
                              )
                            ],
                          ),
                        );
                      }
                    },
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 16.0),
                child: Text('Proceed to Checkout', style: TextStyle(fontSize: 18)),
              ),
              style: ElevatedButton.styleFrom(
                minimumSize: Size(double.infinity, 50),
              ),
            ),
          ),
          SizedBox(height: 16),
        ],
      ),
    );
  }
}
