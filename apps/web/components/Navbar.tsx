'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, User, Heart, Search, PhoneCall, ChevronDown, Menu, X, Truck } from 'lucide-react';
import { useStore, useAuthStore, useWishlistStore } from '../lib/store';
import { CartDrawer } from './ui/CartDrawer';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const items = useStore((state) => state.cart);
  const wishlistItems = useWishlistStore((state) => state.items);
  const openCart = useStore((state) => state.openCart);
  const user = useAuthStore((state) => state.user);
  const pathname = usePathname();

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
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-50 w-full flex flex-col bg-white shadow-sm">
        {/* Top Utility Bar */}
        <div className="bg-gray-100 text-xs text-gray-600 border-b border-gray-200 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[2rem] flex justify-between items-center whitespace-nowrap py-1 gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link href="/franchise" className="hover:text-brand-dark transition-colors">Franchise Enquiry</Link>
              <span className="text-gray-300 hidden sm:inline">|</span>
              <Link href="/warranty" className="hover:text-brand-dark transition-colors">Warranty Registration</Link>
              <span className="text-gray-300 hidden sm:inline">|</span>
              <Link href="/track-order" className="hover:text-brand-dark transition-colors text-brand-dark font-medium">Track your order</Link>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <a href="tel:7372916233" className="flex items-center hover:text-brand-dark transition-colors font-medium">
                <PhoneCall className="w-3 h-3 mr-1" />
                7372916233
              </a>
              <span className="text-gray-300">|</span>
              {mounted && user ? (
                <Link href="/profile" className="hover:text-brand-dark transition-colors">Hi, {user.name?.split(' ')[0] || 'User'}</Link>
              ) : (
                <Link href="/login" className="hover:text-brand-dark transition-colors">Login</Link>
              )}
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-brand-dark text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex justify-between items-center h-20">
              
              {/* Logo & Mobile Menu Toggle */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <button 
                  className="lg:hidden text-gray-200 hover:text-brand-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(true)}
                  aria-label="Open Menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <Link href="/" className="flex flex-col items-center leading-none select-none">
                  <span className="text-2xl sm:text-3xl font-serif font-extrabold tracking-[0.25em] text-brand-accent">
                    ALWAR
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-sans font-semibold tracking-[0.35em] uppercase text-brand-light/80">
                    Furniture
                  </span>
                </Link>
              </div>

              {/* Mega Menu Navigation */}
              <nav className="hidden lg:flex flex-1 justify-center space-x-4" onMouseLeave={() => setActiveCategory(null)}>
                {categories.slice(0, 4).map((category) => (
                  <div 
                    key={category.name}
                    className="px-2 py-8 group"
                    onMouseEnter={() => setActiveCategory(category.name)}
                  >
                    <Link 
                      href={category.href} 
                      className={cn(
                        "flex items-center text-sm font-medium hover:text-brand-accent transition-colors",
                        activeCategory === category.name ? "text-brand-accent" : "text-gray-100"
                      )}
                    >
                      {category.name}
                      <ChevronDown className="w-4 h-4 ml-1 opacity-50" />
                    </Link>

                    {/* Mega Dropdown Panel */}
                    {activeCategory === category.name && (
                      <div className="absolute top-[80px] left-0 w-full bg-white shadow-xl rounded-b-lg overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                        <div className="flex bg-white">
                          
                          {/* Subcategories Column */}
                          <div className="flex-1 p-8 text-gray-800">
                            <h3 className="font-serif font-bold text-lg mb-4 text-brand-dark border-b pb-2">
                              {category.name}
                            </h3>
                            
                            {/* Explore Popular Categories - cross-sell */}
                            <div className="mt-4">
                              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-3">Explore Popular</span>
                              <div className="flex flex-wrap gap-2">
                                {categories.slice(0, 4).filter(c => c.name !== category.name).map(c => (
                                  <Link key={c.name} href={c.href} className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full transition-colors">
                                    {c.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Featured Image Column */}
                          <div className="w-1/3 bg-gray-50 p-6 flex flex-col">
                            <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-4 shadow-sm group/image">
                              <Image 
                                src={category.image} 
                                alt={category.name} 
                                fill 
                                className="object-cover group-hover/image:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <Link 
                              href={category.href}
                              className="text-sm font-medium text-center text-brand-dark hover:text-brand-accent transition-colors"
                            >
                              Shop all {category.name} &rarr;
                            </Link>
                          </div>
                          
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {categories.length > 4 && (
                  <div 
                    className="px-2 py-8 group relative"
                    onMouseEnter={() => setActiveCategory('More')}
                  >
                    <button 
                      className={cn(
                        "flex items-center text-sm font-medium hover:text-brand-accent transition-colors",
                        activeCategory === 'More' ? "text-brand-accent" : "text-gray-100"
                      )}
                    >
                      More Categories
                      <ChevronDown className="w-4 h-4 ml-1 opacity-50" />
                    </button>

                    {/* Simple Dropdown for More Categories */}
                    {activeCategory === 'More' && (
                      <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-64 bg-white shadow-2xl rounded-b-lg overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200 z-50 py-2">
                        {categories.slice(4).map(c => (
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

              {/* Utility Icons */}
              <div className="flex items-center space-x-5 lg:space-x-6 flex-shrink-0">
                <button aria-label="Search" className="text-gray-200 hover:text-brand-accent transition-colors">
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
                  onClick={openCart} 
                  aria-label="Cart"
                  className="text-gray-200 hover:text-brand-accent transition-colors relative flex items-center"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {mounted && totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-brand-accent text-brand-dark text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Drawer */}
          <div className="relative w-4/5 max-w-sm h-full bg-white shadow-xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-brand-dark text-white">
              <span className="flex flex-col items-start leading-none">
                <span className="text-lg font-serif font-extrabold tracking-[0.25em] text-brand-accent">ALWAR</span>
                <span className="text-[8px] font-sans font-semibold tracking-[0.35em] uppercase text-brand-light/80">Furniture</span>
              </span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Categories</h3>
                <div className="flex flex-col gap-2">
                  {categories.map((c) => (
                    <Link 
                      key={c.name} 
                      href={c.href}
                      className="text-brand-dark font-medium py-2 border-b border-gray-50 flex items-center justify-between"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Links</h3>
                <div className="flex flex-col gap-3">
                  {user ? (
                    <Link href="/profile" className="flex items-center text-gray-600 hover:text-brand-dark">
                      <User className="w-4 h-4 mr-3 text-gray-400" />
                      My Account
                    </Link>
                  ) : (
                    <Link href="/login" className="flex items-center text-gray-600 hover:text-brand-dark">
                      <User className="w-4 h-4 mr-3 text-gray-400" />
                      Login / Register
                    </Link>
                  )}
                  <Link href="/wishlist" className="flex items-center text-gray-600 hover:text-brand-dark">
                    <Heart className="w-4 h-4 mr-3 text-gray-400" />
                    Wishlist
                  </Link>
                  <Link href="/track-order" className="flex items-center text-gray-600 hover:text-brand-dark">
                    <Truck className="w-4 h-4 mr-3 text-gray-400" />
                    Track Order
                  </Link>
                </div>
              </div>
              
              <div className="mt-auto pt-4 border-t border-gray-100">
                <a href="tel:7372916233" className="flex items-center justify-center bg-brand-accent text-brand-dark py-3 rounded-lg font-bold">
                  <PhoneCall className="w-4 h-4 mr-2" />
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <CartDrawer />
    </>
  );
};
