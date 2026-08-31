import { Platform } from 'react-native';

// For physical device testing, use the PC's local IP address
export const API_URL = 'http://192.168.29.145:5000/api';

export const fetchProducts = async (search?: string, categoryId?: string) => {
  let url = `${API_URL}/products`;
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (categoryId) params.append('categoryId', categoryId);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

export const fetchProductById = async (id: string) => {
  const response = await fetch(`${API_URL}/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  return response.json();
};
