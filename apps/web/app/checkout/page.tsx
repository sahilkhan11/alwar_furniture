'use client';

import { useStore } from '@/lib/store';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';
import { FadeInReveal } from '@/components/ui/FadeInReveal';
import { CheckCircle2, ChevronRight } from 'lucide-react';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  pincode: z.string().min(6, 'Valid pincode is required'),
  paymentMethod: z.enum(['cod', 'card']),
});

type CheckoutData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useStore();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const { register, handleSubmit, formState: { errors }, watch, trigger } = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'cod'
    }
  });

  const watchPaymentMethod = watch('paymentMethod');
  const watchAllFields = watch();

  const mutation = useMutation({
    mutationFn: async (data: CheckoutData) => {
      return apiClient.post('/orders', {
        items: cart.map(i => ({ productId: i.id, quantity: i.quantity, price: i.price })),
        totalAmount: cartTotal(),
        customerInfo: data
      });
    },
    onSuccess: () => {
      clearCart();
      setStep(3);
    }
  });

  if (cart.length === 0 && step !== 3) {
    return <div className="text-center py-32"><p className="text-xl text-slate-500 mb-4">Your cart is empty.</p><Button onClick={() => router.push('/products')}>Back to Shop</Button></div>;
  }

  const handleNextStep = async () => {
    if (step === 1) {
      const isStepValid = await trigger(['name', 'email', 'address', 'city', 'pincode']);
      if (isStepValid) setStep(2);
    }
  };

  const onSubmit = (data: CheckoutData) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full">
            <div className={`h-full bg-brand-accent transition-all duration-500 rounded-full ${step === 1 ? 'w-0' : step === 2 ? 'w-1/2' : 'w-full'}`}></div>
          </div>
          
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex flex-col items-center ${step >= s ? 'text-brand-accent' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-white border-2 transition-colors ${step >= s ? 'border-brand-accent text-brand-accent' : 'border-slate-300 text-slate-400'}`}>
                {s < step || step === 3 && s === 3 ? <CheckCircle2 size={16} /> : s}
              </div>
              <span className="text-xs font-semibold mt-2 bg-brand-bg px-2">
                {s === 1 ? 'SHIPPING' : s === 2 ? 'PAYMENT' : 'CONFIRMATION'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {step === 1 && (
            <FadeInReveal>
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-slate-100">
                <h2 className="text-2xl font-serif font-bold text-brand-dark mb-6">Shipping Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                      <Input {...register('name')} />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                      <Input type="email" {...register('email')} />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                    <Input {...register('address')} />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                      <Input {...register('city')} />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Pincode</label>
                      <Input {...register('pincode')} />
                      {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
                    </div>
                  </div>
                  <div className="pt-6">
                    <Button onClick={handleNextStep} size="lg" className="w-full">Continue to Payment <ChevronRight className="ml-2 w-4 h-4" /></Button>
                  </div>
                </div>
              </div>
            </FadeInReveal>
          )}

          {step === 2 && (
            <FadeInReveal>
              <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-slate-100">
                <h2 className="text-2xl font-serif font-bold text-brand-dark mb-6">Payment Method</h2>
                
                <div className="space-y-4 mb-8">
                  <label className={`block border rounded-lg p-4 cursor-pointer transition-colors ${watchPaymentMethod === 'cod' ? 'border-brand-accent bg-brand-accent/5' : 'border-slate-200'}`}>
                    <div className="flex items-center">
                      <input type="radio" value="cod" {...register('paymentMethod')} className="w-4 h-4 text-brand-accent focus:ring-brand-accent" />
                      <span className="ml-3 font-semibold text-brand-dark">Cash on Delivery</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-2 ml-7">Pay in cash when your order is delivered to your doorstep.</p>
                  </label>

                  <label className={`block border rounded-lg p-4 cursor-pointer transition-colors ${watchPaymentMethod === 'card' ? 'border-brand-accent bg-brand-accent/5' : 'border-slate-200'}`}>
                    <div className="flex items-center">
                      <input type="radio" value="card" {...register('paymentMethod')} className="w-4 h-4 text-brand-accent focus:ring-brand-accent" />
                      <span className="ml-3 font-semibold text-brand-dark">Credit / Debit Card</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-2 ml-7">Securely pay with your card via Razorpay.</p>
                  </label>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-1/3">Back</Button>
                  <Button type="submit" size="lg" className="w-2/3" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Processing...' : `Pay ₹${cartTotal()}`}
                  </Button>
                </div>
              </form>
            </FadeInReveal>
          )}

          {step === 3 && (
            <FadeInReveal>
              <div className="bg-white p-12 rounded-lg shadow-sm border border-slate-100 text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-brand-dark mb-4">Order Confirmed!</h2>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                  Thank you for shopping with Alwar Furniture. We've received your order and are preparing it for shipment.
                </p>
                <Button size="lg" onClick={() => router.push('/products')}>Continue Shopping</Button>
              </div>
            </FadeInReveal>
          )}
        </div>

        {/* Order Summary Sidebar */}
        {step !== 3 && (
          <FadeInReveal delay={0.2}>
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 h-fit sticky top-24">
              <h3 className="font-bold font-serif text-lg mb-4 text-brand-dark">Order Summary</h3>
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 line-clamp-1 flex-1 pr-4">{item.quantity}x {item.name}</span>
                    <span className="font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium">₹{cartTotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Shipping</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
              </div>
              <div className="border-t border-slate-200 mt-4 pt-4 flex justify-between items-center">
                <span className="font-bold text-brand-dark">Total</span>
                <span className="font-bold text-xl text-brand-dark">₹{cartTotal()}</span>
              </div>
            </div>
          </FadeInReveal>
        )}
      </div>
    </div>
  );
}
