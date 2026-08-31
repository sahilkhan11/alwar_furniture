'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../../../components/ui/Button';
import { Input } from '../../../../../components/ui/Input';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: '',
    stock: '10',
    dimensions: '',
    material: '',
  });

  useEffect(() => {
    async function loadProduct() {
      try {
        const { getProductById } = await import('../../../../../lib/api');
        const data = await getProductById(params.id);
        
        setFormData({
          name: data.name,
          description: data.description,
          price: data.price.toString(),
          category: data.category.name,
          images: Array.isArray(data.images) ? data.images.join(', ') : '',
          stock: (data.stock || 0).toString(),
          dimensions: data.dimensions || '',
          material: data.material || '',
        });
      } catch (err: any) {
        console.error(err);
        setError('Failed to load product details');
      } finally {
        setFetching(false);
      }
    }
    
    loadProduct();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { updateProduct } = await import('../../../../../lib/api');
      
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        images: formData.images ? formData.images.split(',').map(i => i.trim()) : [],
        stock: parseInt(formData.stock),
        dimensions: formData.dimensions,
        material: formData.material,
      };

      await updateProduct(
        params.id,
        payload,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImR1bW15LWFkbWluIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzg4MDM1NDg3fQ.KH3vVaBZJDcILLCgrdQ7k9FCUESW1PBtX0jKyhyWIeI'
      );
      
      router.push('/admin/products');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-8 text-center">Loading product details...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-neutral-600" />
        </Link>
        <h1 className="text-3xl font-serif font-bold text-neutral-900">Edit Product</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <Input
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all resize-none"
            />
          </div>

          <Input
            label="Price (₹)"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all h-12"
            >
              <option value="">Select a category</option>
              <option value="Sofa">Sofa</option>
              <option value="Bed">Bed</option>
              <option value="Dining">Dining</option>
              <option value="Storage">Storage</option>
              <option value="Decor">Decor</option>
            </select>
          </div>

          <div className="col-span-2">
            <Input
              label="Image URLs (comma separated)"
              name="images"
              value={formData.images}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            label="Stock"
            name="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            required
          />

          <Input
            label="Dimensions"
            name="dimensions"
            value={formData.dimensions}
            onChange={handleChange}
          />

          <Input
            label="Material"
            name="material"
            value={formData.material}
            onChange={handleChange}
          />
        </div>

        <div className="pt-6 border-t border-neutral-100 flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Update Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
