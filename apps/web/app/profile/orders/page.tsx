'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Package, Clock, CheckCircle2, Truck } from 'lucide-react';
import { FadeInReveal } from '@/components/ui/FadeInReveal';

export default function MyOrdersPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const res = await apiClient.get('/orders/my-orders');
      return res.data;
    },
    enabled: !!user,
  });

  if (!mounted || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED': return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'SHIPPED': return <Truck className="w-5 h-5 text-blue-600" />;
      default: return <Clock className="w-5 h-5 text-amber-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'SHIPPED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/profile" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <h1 className="text-3xl font-serif font-bold text-brand-dark mb-0">My Orders</h1>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-32 bg-slate-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : orders?.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-slate-200">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-700 mb-2">No orders found</h2>
          <p className="text-slate-500 mb-6">Looks like you haven't placed any orders yet.</p>
          <Link href="/products">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders?.map((order: any, idx: number) => (
            <FadeInReveal key={order.id} delay={idx * 0.1}>
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">
                      Order Placed: <span className="font-medium text-slate-700">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </p>
                    <p className="text-xs text-slate-400 font-mono">ID: {order.id}</p>
                  </div>
                  <div className="flex flex-col sm:items-end">
                    <p className="text-sm text-slate-500 mb-1">Total Amount</p>
                    <p className="font-bold text-brand-dark">Rs {Number(order.totalAmount).toLocaleString('en-IN')}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    {getStatusIcon(order.status)}
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  {order.items && order.items.length > 0 ? (
                    <div className="space-y-4 bg-slate-50 p-4 rounded border border-slate-100">
                      {order.items.map((item: any) => (
                        <div key={item.id} className="flex gap-4 bg-white p-3 rounded shadow-sm border border-slate-100">
                          {item.product?.images?.[0] ? (
                            <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                          ) : (
                            <div className="w-16 h-16 bg-slate-200 rounded flex items-center justify-center text-xs text-slate-400">No Image</div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-800 line-clamp-1">{item.product?.name || 'Unknown Product'}</h4>
                            <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right font-medium text-slate-800">
                            Rs {(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded border border-slate-100">
                      This order contains <strong>0</strong> item(s).
                    </p>
                  )}
                </div>
              </div>
            </FadeInReveal>
          ))}
        </div>
      )}
    </div>
  );
}
