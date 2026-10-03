'use client';

import React from 'react';
import Link from 'next/link';
import { createProductSlug } from '@/lib/slug';
import Image from 'next/image';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Button } from './Button';
import { useStore, useWishlistStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export interface Product {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  stock?: number;
  images: string[];
  category?: { name: string };
  isBestSeller?: boolean;
  isNewLaunch?: boolean;
  reviewsCount?: number;
  rating?: number;
  variants?: any;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl = product.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80';
  const hoverImageUrl = product.images?.[1] || imageUrl; // use second image if available
  const addToCart = useStore((state) => state.addToCart);
  
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to PDP
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: 1,
      image: imageUrl
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to PDP
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      image: imageUrl
    });
  };

  const isLowStock = product.stock !== undefined && product.stock > 0 && product.stock <= 3;
  const isOutOfStock = product.stock !== undefined && product.stock === 0;

  // Render stars
  const renderStars = () => {
    const rating = product.rating || 0;
    if (rating === 0) return null;
    return (
      <div className="flex items-center space-x-1">
        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
        <span className="text-xs font-semibold text-gray-700">{rating.toFixed(1)}</span>
        <span className="text-xs text-gray-400">({product.reviewsCount || 0})</span>
      </div>
    );
  };

  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-brand-light/50 flex flex-col h-full relative">
      
      {/* Badges container */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 pointer-events-none">
        {product.isBestSeller && (
          <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider shadow-sm">
            Best Seller
          </span>
        )}
        {product.isNewLaunch && (
          <span className="bg-brand-accent text-brand-dark text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider shadow-sm">
            New Launch
          </span>
        )}
      </div>

      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 pointer-events-none text-right">
        {isOutOfStock && (
          <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider shadow-sm">
            Out of Stock
          </span>
        )}
        {isLowStock && (
          <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider shadow-sm">
            Low Stock
          </span>
        )}
      </div>

      <Link href={`/product/${createProductSlug(product.id, product.name)}`} className="relative block h-64 overflow-hidden bg-gray-50 group/img">
        <Image
          src={imageUrl}
          alt={`${product.name} ${product.category?.name || 'Furniture'}`}
          fill
          unoptimized
          className={`object-cover transition-opacity duration-500 ${isOutOfStock ? 'opacity-60 grayscale' : 'opacity-100 group-hover/img:opacity-0'}`}
        />
        {product.images?.length > 1 && (
          <Image
            src={hoverImageUrl}
            alt={`${product.name} alternate view`}
            fill
            unoptimized
            className={`object-cover transition-all duration-500 opacity-0 group-hover/img:opacity-100 group-hover/img:scale-105 absolute inset-0 ${isOutOfStock ? 'grayscale' : ''}`}
          />
        )}
        <button 
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-rose-500 transition-all duration-200 shadow-sm backdrop-blur-sm"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("w-5 h-5 transition-colors", isWishlisted && "fill-rose-500 text-rose-500")} />
        </button>
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        {product.category && (
          <span className="text-xs uppercase tracking-wider text-brand-accent font-semibold mb-2 block">
            {product.category.name}
          </span>
        )}
        <Link href={`/product/${createProductSlug(product.id, product.name)}`}>
          <h3 className="text-lg font-bold text-brand-dark mb-1 line-clamp-2 hover:text-brand-accent transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="mb-3 min-h-[20px]">
          {renderStars()}
        </div>

        {/* Color swatches placeholder if variants exist */}
        {product.variants && (
          <div className="flex gap-1 mb-3">
             <div className="w-4 h-4 rounded-full bg-slate-800 border border-slate-300"></div>
             <div className="w-4 h-4 rounded-full bg-amber-700 border border-slate-300"></div>
             <div className="w-4 h-4 rounded-full bg-slate-200 border border-slate-300"></div>
          </div>
        )}
        
        <div className="mt-auto pt-4 flex flex-col gap-3">
          <div className="flex flex-col">
            {product.compareAtPrice && product.compareAtPrice > product.price ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-brand-dark">
                  â‚¹{Number(product.price).toLocaleString()}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  â‚¹{Number(product.compareAtPrice).toLocaleString()}
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-brand-dark">
                â‚¹{Number(product.price).toLocaleString()}
              </span>
            )}
            <span className="text-[10px] text-gray-500 mt-1">Inclusive of all taxes</span>
          </div>
          
          <Button 
            variant="default" 
            className="w-full bg-brand-dark hover:bg-brand-accent hover:text-brand-dark transition-colors font-medium rounded text-sm py-2" 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
};
