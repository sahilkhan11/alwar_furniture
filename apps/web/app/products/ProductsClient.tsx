'use client';

import React, { useState } from 'react';
import { ProductCard, Product } from '../../components/ui/ProductCard';
import { Input } from '../../components/ui/Input';
import { Search } from 'lucide-react';

export default function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [search, setSearch] = useState('');

  const filteredProducts = initialProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-dark mb-2">Our Collection</h1>
          <p className="text-gray-600">Explore our handcrafted wooden furniture.</p>
        </div>
        
        <div className="w-full md:w-72 relative">
          <Input 
            placeholder="Search furniture..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-500">
            No products found matching "{search}"
          </div>
        )}
      </div>
    </div>
  );
}
