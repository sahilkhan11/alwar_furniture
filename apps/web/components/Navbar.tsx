'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, User } from 'lucide-react';
import { useStore } from '../lib/store';

export const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const items = useStore((state) => state.cart);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-brand-dark text-brand-light shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-serif font-bold text-brand-accent tracking-wider">
              ALWAR FURNITURE
            </Link>
          </div>
          <nav className="hidden md:flex space-x-6 lg:space-x-8 text-sm lg:text-base">
            <Link href="/" className="hover:text-brand-accent transition-colors">Home</Link>
            <Link href="/products" className="hover:text-brand-accent transition-colors">Shop</Link>
            <Link href="/about" className="hover:text-brand-accent transition-colors">About Us</Link>
            <Link href="/resources" className="hover:text-brand-accent transition-colors">Resources</Link>
            <Link href="/testimonials" className="hover:text-brand-accent transition-colors">Testimonials</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/profile" className="hover:text-brand-accent transition-colors">
              <User className="h-6 w-6" />
            </Link>
            <Link href="/cart" className="hover:text-brand-accent transition-colors relative">
              <ShoppingCart className="h-6 w-6" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-accent text-brand-dark text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
