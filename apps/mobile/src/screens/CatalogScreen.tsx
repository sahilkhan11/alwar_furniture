import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { fetchProducts } from '../lib/api';

export default function CatalogScreen({ navigation }: any) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchProducts(search).then(data => {
      setProducts(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [search]);
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <Image source={{ uri: item.images[0] || 'https://via.placeholder.com/800' }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productCategory}>{item.category?.name}</Text>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Our Collection</Text>
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search furniture..." 
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#8b5a2b" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.row}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 50, color: '#999' }}>No products found</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f0ea' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#3e2723', marginBottom: 10 },
  searchInput: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  listContainer: { padding: 15 },
  row: { justifyContent: 'space-between' },
  productCard: { width: '48%', backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', marginBottom: 15, elevation: 2 },
  productImage: { width: '100%', height: 150, resizeMode: 'cover' },
  productInfo: { padding: 10 },
  productCategory: { fontSize: 10, color: '#8b5a2b', textTransform: 'uppercase', marginBottom: 4 },
  productName: { fontSize: 14, fontWeight: 'bold', color: '#3e2723', marginBottom: 4 },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#3e2723' }
});
