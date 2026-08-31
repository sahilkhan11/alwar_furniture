import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ShoppingCart } from 'lucide-react-native';

export default function CartScreen({ navigation }: any) {
  // Mock cart items for scaffolding
  const items = [];

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ShoppingCart color="#ccc" size={64} style={{ marginBottom: 20 }} />
        <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
        <Text style={styles.emptySubtitle}>Looks like you haven't added any premium furniture yet.</Text>
        <TouchableOpacity 
          style={styles.shopButton}
          onPress={() => navigation.navigate('CatalogTab')}
        >
          <Text style={styles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Shopping Cart</Text>
      {/* Cart items will go here */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f0ea', padding: 20 },
  emptyContainer: { flex: 1, backgroundColor: '#f5f0ea', justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyTitle: { fontSize: 24, fontWeight: 'bold', color: '#3e2723', marginBottom: 10 },
  emptySubtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
  shopButton: { backgroundColor: '#8b5a2b', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 8 },
  shopButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#3e2723', marginBottom: 20, marginTop: 40 }
});
