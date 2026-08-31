'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProductsTable } from './ProductsTable';
import { useAuthStore } from '@/lib/store';
import { Plus } from 'lucide-react';

export default function AdminProductsPage() {
  const router = useRouter();
  const { token, user } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!token || user?.role !== 'ADMIN') return;
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        fetch('http://localhost:5000/api/products', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/categories', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if (prodRes.ok) setProducts(await prodRes.json());
      if (catRes.ok) setCategories(await catRes.json());
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, user]);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Products</h1>
          <p className="text-neutral-500 mt-1">Manage your product catalog and inventory.</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="inline-flex items-center gap-2 bg-neutral-900 text-white px-4 py-2.5 rounded-lg hover:bg-neutral-800 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 border border-neutral-200 rounded-xl bg-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
        </div>
      ) : (
        <ProductsTable 
          products={products.map((p: any) => ({ ...p, category: p.category?.name || 'N/A' }))} 
          categories={categories} 
          onRefresh={fetchData} 
        />
      )}
    </div>
  );
}
