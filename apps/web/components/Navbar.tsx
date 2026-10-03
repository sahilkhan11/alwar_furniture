'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, User, Heart, Search, PhoneCall, ChevronDown, Menu, X, Truck } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    setIsMobileMenuOpen(false);
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
        <div className="bg-brand-dark text-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center relative">
            
            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden text-white hover:text-brand-accent transition-colors -ml-2 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
              <Image 
                src="/icon.jpg" 
                alt="Alwar Furniture Logo" 
                width={120} 
                height={120} 
                className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-brand-accent shadow-md object-cover"
                priority
              />
              <div className="hidden lg:flex flex-col ml-3">
                <span className="font-serif font-bold text-2xl tracking-wide text-brand-accent leading-none">
                  Alwar Furniture
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-300 mt-1">
                  Premium Wooden Craft
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center h-full">
              <Link href="/" className="px-5 text-sm font-bold uppercase tracking-wider text-white hover:text-brand-accent transition-colors h-full flex items-center border-b-2 border-transparent hover:border-brand-accent">
                Home
              </Link>
              <Link href="/products" className="px-5 text-sm font-bold uppercase tracking-wider text-white hover:text-brand-accent transition-colors h-full flex items-center border-b-2 border-transparent hover:border-brand-accent">
                Shop
              </Link>
              
              {/* Categories Mega Menu */}
              <div 
                className="h-full group"
                onMouseEnter={() => setActiveCategory('menu')}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <div className="px-5 text-sm font-bold uppercase tracking-wider text-white group-hover:text-brand-accent transition-colors h-full flex items-center cursor-pointer border-b-2 border-transparent group-hover:border-brand-accent gap-1">
                  Categories
                  <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", activeCategory === 'menu' && "rotate-180")} />
                </div>

                {/* Dropdown Content */}
                {activeCategory === 'menu' && (
                  <div className="absolute top-20 left-0 w-full bg-white shadow-xl rounded-b-lg overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <div className="max-w-7xl mx-auto flex bg-white">
                      {/* Categories List Column */}
                      <div className="w-1/4 bg-gray-50 p-6 border-r border-gray-100 flex flex-col gap-2">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Categories</h3>
                        {categories.map((c) => (
                          <Link 
                            key={c.name}
                            href={c.href}
                            className="text-gray-700 hover:text-brand-dark hover:bg-white hover:shadow-sm px-4 py-2.5 rounded-md transition-all text-sm font-medium flex justify-between items-center group/item"
                          >
                            {c.name}
                            <span className="opacity-0 group-hover/item:opacity-100 transition-opacity text-brand-accent">→</span>
                          </Link>
                        ))}
                        <Link href="/products" className="mt-2 text-brand-accent hover:text-brand-dark text-sm font-bold underline px-4 py-2 transition-colors">
                          View All Products
                        </Link>
                      </div>
                      
                      {/* Featured Image Column */}
                      <div className="flex-1 p-8 bg-white flex flex-col justify-center items-center">
                        <div className="relative aspect-video w-full max-w-2xl rounded-xl overflow-hidden mb-6 shadow-sm group/image">
                          <Image 
                            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200" 
                            alt="Featured Category" 
                            fill 
                            className="object-cover group-hover/image:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                            <div>
                              <span className="bg-brand-accent text-brand-dark text-xs font-bold uppercase tracking-wider px-3 py-1 rounded mb-3 inline-block">Featured</span>
                              <h3 className="text-white text-3xl font-serif font-bold mb-2">Premium Sofa Collection</h3>
                              <p className="text-gray-200 text-sm max-w-md">Discover our handcrafted wooden sofas designed for elegance and ultimate comfort.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-5 lg:space-x-6 flex-shrink-0">
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

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-4/5 max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <span className="font-serif font-bold text-xl text-brand-dark">Menu</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:text-brand-dark bg-white rounded-full shadow-sm">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-4 space-y-1">
            <Link href="/" className="block px-4 py-3 rounded-lg text-brand-dark font-bold hover:bg-gray-50 transition-colors">
              Home
            </Link>
            <Link href="/products" className="block px-4 py-3 rounded-lg text-gray-700 font-bold hover:bg-gray-50 hover:text-brand-dark transition-colors">
              Shop All
            </Link>
            
            <div className="mt-6 mb-2 px-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categories</span>
            </div>
            {categories.map(c => (
              <Link 
                key={c.name}
                href={c.href} 
                className="block px-4 py-2.5 text-gray-600 hover:text-brand-dark hover:bg-gray-50 rounded-lg transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </nav>

          <div className="mt-8 px-4 border-t border-gray-100 pt-6">
            <nav className="space-y-1">
              <Link href="/profile" className="flex items-center px-4 py-3 text-gray-700 hover:text-brand-dark hover:bg-gray-50 rounded-lg transition-colors font-medium">
                <User className="h-5 w-5 mr-3 text-gray-400" />
                My Account
              </Link>
              <Link href="/wishlist" className="flex items-center px-4 py-3 text-gray-700 hover:text-brand-dark hover:bg-gray-50 rounded-lg transition-colors font-medium">
                <Heart className="h-5 w-5 mr-3 text-gray-400" />
                Wishlist
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <CartDrawer />
    </>
  );
};
