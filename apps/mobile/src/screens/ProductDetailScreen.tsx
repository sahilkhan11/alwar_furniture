import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';

export default function ProductDetailScreen({ route, navigation }: any) {
  const { product } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image source={{ uri: product.images[0] || 'https://via.placeholder.com/800' }} style={styles.mainImage} />
        
        <View style={styles.content}>
          <Text style={styles.category}>{product.category.name}</Text>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>₹{product.price.toLocaleString('en-IN')}</Text>
          
          <Text style={styles.description}>
            Experience unparalleled comfort and timeless elegance with our {product.name}. 
            Handcrafted from sustainably sourced, premium wood, designed to last for generations.
          </Text>
          
          <View style={styles.specsContainer}>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Dimensions</Text>
              <Text style={styles.specValue}>L 208 cm x W 160 cm x H 110 cm</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Material</Text>
              <Text style={styles.specValue}>Solid Wood</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Availability</Text>
              <Text style={[styles.specValue, { color: 'green' }]}>In Stock (5)</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.addToCartBtn} onPress={() => {}}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  mainImage: { width: '100%', height: 350, resizeMode: 'cover' },
  content: { padding: 20 },
  category: { fontSize: 12, color: '#8b5a2b', textTransform: 'uppercase', marginBottom: 5, fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#3e2723', marginBottom: 10 },
  price: { fontSize: 22, fontWeight: 'bold', color: '#3e2723', marginBottom: 20 },
  description: { fontSize: 15, color: '#666', lineHeight: 24, marginBottom: 25 },
  specsContainer: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 20 },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  specLabel: { color: '#888', fontSize: 14 },
  specValue: { color: '#3e2723', fontSize: 14, fontWeight: '600' },
  bottomBar: { padding: 15, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
  addToCartBtn: { backgroundColor: '#8b5a2b', padding: 15, borderRadius: 8, alignItems: 'center' },
  addToCartText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
