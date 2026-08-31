'use client';

import { useStore } from '@/lib/store';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const { cart, removeFromCart, cartTotal } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold font-serif mb-8 text-brand-dark">Your Cart</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow border">
          <p className="text-slate-500 mb-6">Your shopping cart is empty.</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow border">
                <div className="relative w-24 h-24 bg-slate-100 rounded overflow-hidden">
                  <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-brand-dark">{item.name}</h3>
                  <p className="text-slate-500">Qty: {item.quantity}</p>
                  <p className="font-medium">₹{item.price * item.quantity}</p>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border h-fit">
            <h2 className="text-xl font-bold mb-4 border-b pb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-medium">₹{cartTotal()}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-slate-600">Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-4 mb-6">
              <span>Total</span>
              <span>₹{cartTotal()}</span>
            </div>
            <Link href="/checkout">
              <Button className="w-full" size="lg">Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
