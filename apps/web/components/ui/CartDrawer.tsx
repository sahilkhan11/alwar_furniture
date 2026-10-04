'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createProductSlug } from '@/lib/slug';
import { Button } from './Button';

export const CartDrawer = () => {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity, cartTotal } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!mounted) return null;

  const total = cartTotal();
  const FREE_SHIPPING_THRESHOLD = 50000;
  const progress = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - total, 0);

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[110] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-serif font-bold text-brand-dark flex items-center gap-2">
            <ShoppingBag size={24} />
            Your Cart
          </h2>
          <button 
            onClick={closeCart}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {cart.length > 0 && (
          <div className="p-6 bg-slate-50 border-b border-slate-100">
            <p className="text-sm text-slate-600 font-medium mb-2">
              {remainingForFreeShipping > 0 
                ? `Add Rs ${remainingForFreeShipping.toLocaleString()} more for FREE shipping` 
                : "You've unlocked FREE shipping!"}
            </p>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <ShoppingBag size={64} className="mb-4 text-slate-300" />
              <p className="text-lg font-medium mb-2">Your cart is empty</p>
              <p className="text-sm text-slate-400 mb-8 text-center">Looks like you haven't added anything yet. Explore our top categories:</p>
              
              <div className="grid grid-cols-2 gap-3 w-full mb-8">
                <Link href="/category/living-room" onClick={closeCart} className="bg-slate-50 hover:bg-brand-accent/10 border border-slate-100 p-3 rounded-lg flex items-center gap-2 transition-colors group">
                  <div className="w-10 h-10 relative rounded overflow-hidden">
                    <Image src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=100" alt="Living Room" fill className="object-cover" unoptimized />
                  </div>
                  <span className="text-sm font-medium text-brand-dark group-hover:text-brand-accent">Living Room</span>
                </Link>
                <Link href="/category/bed-room" onClick={closeCart} className="bg-slate-50 hover:bg-brand-accent/10 border border-slate-100 p-3 rounded-lg flex items-center gap-2 transition-colors group">
                  <div className="w-10 h-10 relative rounded overflow-hidden">
                    <Image src="https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=100" alt="Bed Room" fill className="object-cover" unoptimized />
                  </div>
                  <span className="text-sm font-medium text-brand-dark group-hover:text-brand-accent">Bed Room</span>
                </Link>
                <Link href="/category/dining-room" onClick={closeCart} className="bg-slate-50 hover:bg-brand-accent/10 border border-slate-100 p-3 rounded-lg flex items-center gap-2 transition-colors group">
                  <div className="w-10 h-10 relative rounded overflow-hidden">
                    <Image src="https://images.unsplash.com/photo-1617806118233-18e1c0945594?auto=format&fit=crop&q=80&w=100" alt="Dining" fill className="object-cover" unoptimized />
                  </div>
                  <span className="text-sm font-medium text-brand-dark group-hover:text-brand-accent">Dining</span>
                </Link>
                <Link href="/category/home-office" onClick={closeCart} className="bg-slate-50 hover:bg-brand-accent/10 border border-slate-100 p-3 rounded-lg flex items-center gap-2 transition-colors group">
                  <div className="w-10 h-10 relative rounded overflow-hidden">
                    <Image src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=100" alt="Office" fill className="object-cover" unoptimized />
                  </div>
                  <span className="text-sm font-medium text-brand-dark group-hover:text-brand-accent">Office</span>
                </Link>
              </div>

              <Button onClick={closeCart} className="w-full bg-brand-dark text-white hover:bg-brand-dark/90 h-12">Start Shopping</Button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="relative w-24 h-24 rounded-md overflow-hidden bg-slate-100 shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                  </div>
                  
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-start">
                      <Link href={`/product/${createProductSlug(item.id, item.name)}`} onClick={closeCart} className="font-medium text-brand-dark hover:text-brand-accent line-clamp-2 pr-4">
                        {item.name}
                      </Link>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    <p className="text-sm font-medium text-slate-600 mt-1">Rs {item.price.toLocaleString()}</p>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-slate-200 rounded-md">
                        <button 
                          className="p-1.5 hover:bg-slate-100 text-slate-600 transition-colors"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button 
                          className="p-1.5 hover:bg-slate-100 text-slate-600 transition-colors"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="font-bold text-brand-dark">Rs {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-white">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Subtotal</span>
                <span>Rs {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Shipping</span>
                <span>{remainingForFreeShipping > 0 ? 'Calculated at checkout' : 'Free'}</span>
              </div>
              <div className="flex justify-between font-bold text-brand-dark text-lg pt-3 border-t border-slate-100">
                <span>Total</span>
                <span>Rs {total.toLocaleString()}</span>
              </div>
            </div>
            
            <Link href="/checkout" onClick={closeCart} className="block">
              <Button className="w-full h-14 text-lg flex items-center justify-center gap-2">
                Checkout Now <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};
