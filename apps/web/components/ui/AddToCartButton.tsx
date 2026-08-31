'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from './Button';
import { useStore } from '../../lib/store';
import { Product } from './ProductCard';

interface AddToCartButtonProps {
  product: Product;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product }) => {
  const addToCart = useStore((state) => state.addToCart);

  return (
    <Button 
      size="lg" 
      className="flex-1 text-lg"
      onClick={() => addToCart({ ...product, quantity: 1 })}
    >
      <ShoppingCart className="w-5 h-5 mr-2" />
      Add to Cart
    </Button>
  );
};
