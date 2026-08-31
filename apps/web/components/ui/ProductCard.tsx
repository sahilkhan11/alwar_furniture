import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { Button } from './Button';

export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category?: { name: string };
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl = product.images?.[0] || 'https://via.placeholder.com/400x400?text=No+Image';

  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-brand-light/50 flex flex-col h-full">
      <Link href={`/products/${product.id}`} className="relative block h-64 overflow-hidden bg-gray-100">
        {/* Next.js unoptimized image for static export compatibility */}
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        {product.category && (
          <span className="text-xs uppercase tracking-wider text-brand-primary font-semibold mb-2">
            {product.category.name}
          </span>
        )}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-xl font-bold text-brand-dark mb-2 line-clamp-2 hover:text-brand-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-brand-dark">
            ₹{product.price.toString()}
          </span>
          <Button variant="primary" size="sm" className="rounded-full w-10 h-10 p-0" aria-label="Add to cart">
            <ShoppingCart className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
