'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createProductSlug } from '@/lib/slug';
import Image from 'next/image';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import { useWishlistStore, useStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeFromWishlist, clearWishlist } = useWishlistStore();
  const addToCart = useStore((state) => state.addToCart);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-16 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-48 mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 h-80 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-dark flex items-center">
            <Heart className="mr-3 text-rose-500 fill-rose-500" />
            My Wishlist
          </h1>
          <p className="text-gray-500 mt-2">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        {items.length > 0 && (
          <button 
            onClick={clearWishlist}
            className="text-sm text-gray-500 hover:text-brand-accent transition-colors underline underline-offset-4"
          >
            Clear Wishlist
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 rounded-xl border border-gray-100">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-100 text-rose-500 mb-6">
            <Heart className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Save items you love to your wishlist. Review them anytime and easily move them to your cart when you're ready to buy.
          </p>
          <Link href="/products">
            <Button size="lg" className="px-8">
              Explore Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {items.map((item) => (
            <div key={item.id} className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden">
              <Link href={`/product/${createProductSlug(item.id, item.name)}`} className="relative aspect-square overflow-hidden bg-gray-50">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>
              
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <Link href={`/product/${createProductSlug(item.id, item.name)}`}>
                    <h3 className="font-medium text-gray-900 group-hover:text-brand-accent transition-colors line-clamp-2">
                      {item.name}
                    </h3>
                  </Link>
                </div>
                
                <div className="flex items-center gap-2 mb-4 mt-auto">
                  <span className="font-bold text-brand-dark">Rs {item.price.toLocaleString('en-IN')}</span>
                  {item.compareAtPrice && (
                    <span className="text-sm text-gray-400 line-through">Rs {item.compareAtPrice.toLocaleString('en-IN')}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                  <Button 
                    variant="default" 
                    className="flex-1 rounded-full text-xs py-2"
                    onClick={() => {
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: 1,
                        image: item.image
                      });
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                  </Button>
                  <button 
                    onClick={() => removeFromWishlist(item.id)}
                    className="p-2.5 rounded-full border border-gray-200 text-gray-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
