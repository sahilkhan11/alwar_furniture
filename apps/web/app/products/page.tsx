'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { ProductCard } from '@/components/ui/ProductCard';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { FadeInReveal } from '@/components/ui/FadeInReveal';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  const { data: rawProducts, isLoading } = useQuery({
    queryKey: ['products', search],
    queryFn: async () => {
      const res = await apiClient.get('/products', {
        params: { search: search || undefined }
      });
      return res.data;
    },
  });

  const products = useMemo(() => {
    if (!rawProducts) return [];
    let filtered = [...rawProducts];
    
    // Client-side filtering as fallback until API supports it
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((p: any) => p.category?.name.toLowerCase() === categoryFilter.toLowerCase());
    }

    // Sorting
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      // newest
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filtered;
  }, [rawProducts, categoryFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0 space-y-8">
        <div>
          <h2 className="text-xl font-bold font-serif text-brand-dark mb-4">Filters</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Search</label>
              <Input 
                placeholder="Search products..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select 
                className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-brand-accent focus:border-brand-accent"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="living room">Living Room</option>
                <option value="bedroom">Bedroom</option>
                <option value="dining">Dining</option>
                <option value="office">Office</option>
              </select>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark">Shop Collection</h1>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Sort by:</label>
            <select 
              className="border border-slate-300 rounded-md p-2 text-sm focus:ring-brand-accent focus:border-brand-accent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1,2,3,4,5,6].map(n => <div key={n} className="h-80 bg-slate-200 rounded-lg"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products?.map((product: any, idx: number) => (
              <FadeInReveal key={product.id} delay={idx * 0.1}>
                <ProductCard product={product} />
              </FadeInReveal>
            ))}
            {products?.length === 0 && (
              <div className="col-span-full text-center py-20 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-lg text-slate-500">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
