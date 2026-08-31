'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store';

export default function AdminOverview() {
  const router = useRouter();
  const { token, user } = useAuthStore();
  const [stats, setStats] = useState({
    totalProducts: '--',
    totalCategories: '--',
    totalOrders: '--',
    totalRevenue: '--',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token || user?.role !== 'ADMIN') return;
      
      try {
        const res = await fetch('http://localhost:5000/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token, user]);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'ADMIN') {
    return null; // Return null while redirecting
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded shadow border">
          <h2 className="text-lg font-semibold text-slate-600">Total Products</h2>
          <p className="text-4xl font-bold mt-2">{loading ? '...' : stats.totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded shadow border">
          <h2 className="text-lg font-semibold text-slate-600">Total Categories</h2>
          <p className="text-4xl font-bold mt-2">{loading ? '...' : stats.totalCategories}</p>
        </div>
        <div className="bg-white p-6 rounded shadow border">
          <h2 className="text-lg font-semibold text-slate-600">Total Orders</h2>
          <p className="text-4xl font-bold mt-2">{loading ? '...' : stats.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded shadow border">
          <h2 className="text-lg font-semibold text-slate-600">Revenue (INR)</h2>
          <p className="text-4xl font-bold mt-2 text-brand-accent">
            {loading ? '...' : `₹${stats.totalRevenue}`}
          </p>
        </div>
      </div>
    </div>
  );
}
