import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { fetchProducts } from '../lib/api';

export default function HomeScreen({ navigation }: any) {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then(data => {
      setFeaturedProducts(data.slice(0, 4));
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' }} 
          style={styles.heroImage} 
        />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>Handcrafted Perfection</Text>
          <Text style={styles.heroSubtitle}>Discover premium, sustainably sourced wooden furniture.</Text>
          <TouchableOpacity 
            style={styles.heroButton}
            onPress={() => navigation.navigate('CatalogTab')}
          >
            <Text style={styles.heroButtonText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Collections</Text>
        <View style={styles.productList}>
          {loading ? (
            <ActivityIndicator size="large" color="#8b5a2b" style={{ margin: 20 }} />
          ) : (
            featuredProducts.map((product) => (
              <TouchableOpacity 
                key={product.id} 
                style={styles.productCard}
                onPress={() => navigation.navigate('ProductDetail', { product })}
              >
                <Image source={{ uri: product.images[0] }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productCategory}>{product.category?.name}</Text>
                  <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                  <Text style={styles.productPrice}>₹{product.price.toLocaleString('en-IN')}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f0ea' },
  hero: { height: 400, position: 'relative' },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  heroOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20
  },
  heroTitle: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 10 },
  heroSubtitle: { fontSize: 16, color: '#eee', textAlign: 'center', marginBottom: 20 },
  heroButton: { backgroundColor: '#8b5a2b', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  heroButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  section: { padding: 20 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#3e2723', marginBottom: 20 },
  productList: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  productCard: { width: '48%', backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', marginBottom: 15, elevation: 2 },
  productImage: { width: '100%', height: 150, resizeMode: 'cover' },
  productInfo: { padding: 10 },
  productCategory: { fontSize: 10, color: '#8b5a2b', textTransform: 'uppercase', marginBottom: 4 },
  productName: { fontSize: 14, fontWeight: 'bold', color: '#3e2723', marginBottom: 4 },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#3e2723' }
});
