
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, User, Heart, Search, ChevronDown } from 'lucide-react';
import { useStore, useAuthStore, useWishlistStore } from '../lib/store';
import { CartDrawer } from './ui/CartDrawer';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { isCategoryHidden, slugifyCategory } from '@/lib/hidden-categories';

type DbCategory = {
  id: string;
  name: string;
  image?: string | null;
  description?: string | null;
};

export const Navbar = ({ dbCategories = [] }: { dbCategories?: DbCategory[] }) => {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const items = useStore((state) => state.cart);
  const wishlistItems = useWishlistStore((state) => state.items);
  const openCart = useStore((state) => state.openCart);
  const user = useAuthStore((state) => state.user);
  const pathname = usePathname();
  const router = useRouter();

  const categories = (Array.isArray(dbCategories) ? dbCategories : [])
    .filter((c) => !isCategoryHidden(c.name))
    .map((c) => ({
      name: c.name,
      href: `/category/${slugifyCategory(c.name)}`,
      image: c.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400',
    }));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsSearchOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleMobileCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      router.push(e.target.value);
    }
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-50 w-full flex flex-col bg-white shadow-sm">
        {/* Main Header */}
        <div className="bg-brand-dark text-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center relative">
            
            {/* Logo - Left aligned */}
            <Link href="/" className="flex items-center">
              <Image 
                src="/icon.jpg" 
                alt="Alwar Furniture Logo" 
                width={120} 
                height={120} 
                className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-brand-accent shadow-md object-cover"
                priority
              />
              <div className="hidden sm:flex flex-col ml-3">
                <span className="font-serif font-bold text-xl md:text-2xl tracking-wide text-brand-accent leading-none">
                  Alwar Furniture
                </span>
                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-gray-300 mt-1">
                  Premium Wooden Craft
                </span>
              </div>
            </Link>

            {/* Mobile Categories Dropdown */}
            <div className="lg:hidden ml-2 flex-1 max-w-[150px]">
              <select 
                className="w-full bg-brand-dark text-white border border-gray-600 rounded px-2 py-1 text-xs focus:outline-none"
                onChange={handleMobileCategorySelect}
                value=""
              >
                <option value="" disabled>Categories</option>
                <option value="/products">Shop All</option>
                {categories.map(c => (
                  <option key={c.name} value={c.href}>{c.name}</option>
                ))}
                <option value="/about">About Us</option>
                <option value="/resources">Resources</option>
              </select>
            </div>

            {/* Desktop Navigation - Categories directly on navbar */}
            <nav className="hidden lg:flex items-center h-full gap-1 ml-6 flex-1">
              <Link href="/" className="px-3 text-sm font-bold uppercase tracking-wider text-white hover:text-brand-accent transition-colors h-full flex items-center border-b-2 border-transparent hover:border-brand-accent">
                Home
              </Link>
              <Link href="/products" className="px-3 text-sm font-bold uppercase tracking-wider text-white hover:text-brand-accent transition-colors h-full flex items-center border-b-2 border-transparent hover:border-brand-accent">
                Shop
              </Link>
              <Link href="/about" className="px-3 text-sm font-bold uppercase tracking-wider text-white hover:text-brand-accent transition-colors h-full flex items-center border-b-2 border-transparent hover:border-brand-accent">
                About Us
              </Link>
              <Link href="/resources" className="px-3 text-sm font-bold uppercase tracking-wider text-white hover:text-brand-accent transition-colors h-full flex items-center border-b-2 border-transparent hover:border-brand-accent">
                Resources
              </Link>
              <Link href="/testimonials" className="px-3 text-sm font-bold uppercase tracking-wider text-white hover:text-brand-accent transition-colors h-full flex items-center border-b-2 border-transparent hover:border-brand-accent">
                Testimonials
              </Link>

              {/* Categories */}
              {categories.slice(0, 3).map(c => (
                <Link key={c.name} href={c.href} className="px-3 text-sm font-bold uppercase tracking-wider text-white hover:text-brand-accent transition-colors h-full flex items-center border-b-2 border-transparent hover:border-brand-accent whitespace-nowrap">
                  {c.name}
                </Link>
              ))}
              
              {categories.length > 3 && (
                <div 
                  className="h-full group relative"
                  onMouseEnter={() => setActiveCategory('More')}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <button className="px-3 text-sm font-bold uppercase tracking-wider text-white group-hover:text-brand-accent transition-colors h-full flex items-center border-b-2 border-transparent group-hover:border-brand-accent gap-1 whitespace-nowrap">
                    More Categories
                    <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", activeCategory === 'More' && "rotate-180")} />
                  </button>

                  {/* Dropdown Content */}
                  {activeCategory === 'More' && (
                    <div className="absolute top-[80px] left-0 w-64 bg-white shadow-xl rounded-b-lg overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200 z-50 py-2">
                      {categories.slice(3).map((c) => (
                        <Link 
                          key={c.name}
                          href={c.href}
                          className="block px-6 py-3 text-sm text-gray-700 hover:bg-brand-light hover:text-brand-dark transition-colors font-medium border-b border-gray-50 last:border-0"
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-4 lg:space-x-5 flex-shrink-0 ml-auto lg:ml-0">
              <button 
                aria-label="Search" 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gray-200 hover:text-brand-accent transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
              <Link href="/profile" aria-label="Account" className="text-gray-200 hover:text-brand-accent transition-colors hidden sm:block">
                <User className="h-5 w-5" />
              </Link>
              <Link href="/wishlist" aria-label="Wishlist" className="text-gray-200 hover:text-brand-accent transition-colors hidden sm:flex items-center relative">
                <Heart className="h-5 w-5" />
                {mounted && wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-accent text-brand-dark text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              <button 
                className="text-white hover:text-brand-accent transition-colors relative" 
                onClick={openCart}
                aria-label="Cart"
              >
                <ShoppingCart className="h-6 w-6" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-accent text-brand-dark text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          {/* Search Dropdown */}
          {isSearchOpen && (
            <div className="absolute top-20 left-0 w-full bg-white shadow-md p-4 z-40 border-t border-gray-100">
              <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex gap-2">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..." 
                  className="flex-1 border border-gray-300 rounded px-4 py-2 text-gray-800 focus:outline-none focus:border-brand-dark"
                  autoFocus
                />
                <button type="submit" className="bg-brand-dark text-white px-6 py-2 rounded hover:bg-brand-accent hover:text-brand-dark transition-colors font-medium">
                  Search
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      <CartDrawer />
    </>
  );
};
