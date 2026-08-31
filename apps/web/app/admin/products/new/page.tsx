'use client';

import { useForm } from 'react-form-hook'; // Wait, let's just use regular react-hook-form
import { useForm as useRHForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/lib/store';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(10, 'Description too short'),
  price: z.coerce.number().min(1, 'Price must be greater than 0'),
  stock: z.coerce.number().min(0, 'Stock cannot be negative'),
  categoryId: z.string().min(1, 'Category is required'),
  images: z.any().optional(), // FileList is handled specially
});

type FormData = z.infer<typeof schema>;

export default function NewProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('http://localhost:5000/api/categories');
      return res.json();
    },
  });

  const { register, handleSubmit, formState: { errors } } = useRHForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new window.FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('stock', data.stock.toString());
      formData.append('categoryId', data.categoryId);
      
      if (data.images && data.images.length > 0) {
        for (let i = 0; i < data.images.length; i++) {
          formData.append('images', data.images[i]);
        }
      }

      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to create product');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      router.push('/admin/products');
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded shadow border">
        
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" {...register('name')} placeholder="e.g. Wooden Dining Table" />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <textarea 
            id="description" 
            {...register('description')} 
            className="w-full min-h-[100px] flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Detailed product description..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price (₹)</Label>
            <Input id="price" type="number" {...register('price')} placeholder="0.00" />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
          </div>
          <div>
            <Label htmlFor="stock">Initial Stock</Label>
            <Input id="stock" type="number" {...register('stock')} placeholder="10" />
            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="categoryId">Category</Label>
          <select 
            id="categoryId" 
            {...register('categoryId')}
            className="w-full flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
          >
            <option value="">Select a category...</option>
            {categories?.map((cat: any) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
        </div>

        <div>
          <Label htmlFor="images">Product Images</Label>
          <Input id="images" type="file" multiple accept="image/*" {...register('images')} />
        </div>

        <button 
          type="submit" 
          disabled={mutation.isPending}
          className="w-full bg-slate-900 text-white h-10 rounded-md font-medium hover:bg-slate-800 disabled:opacity-50"
        >
          {mutation.isPending ? 'Creating...' : 'Create Product'}
        </button>

      </form>
    </div>
  );
}
