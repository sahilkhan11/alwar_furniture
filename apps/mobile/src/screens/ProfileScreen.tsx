import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User, LogOut, Package, Heart, Settings } from 'lucide-react-native';

export default function ProfileScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <User color="#8b5a2b" size={40} />
        </View>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>john.doe@example.com</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Package color="#666" size={24} style={styles.menuIcon} />
          <Text style={styles.menuText}>My Orders</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Heart color="#666" size={24} style={styles.menuIcon} />
          <Text style={styles.menuText}>Wishlist</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Settings color="#666" size={24} style={styles.menuIcon} />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <LogOut color="#d32f2f" size={24} style={styles.menuIcon} />
          <Text style={[styles.menuText, { color: '#d32f2f' }]}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f0ea' },
  header: { alignItems: 'center', padding: 40, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#f0e6d2', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#3e2723', marginBottom: 5 },
  email: { fontSize: 16, color: '#666' },
  menu: { marginTop: 20, backgroundColor: '#fff' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  menuIcon: { marginRight: 15 },
  menuText: { fontSize: 16, color: '#333' }
});
