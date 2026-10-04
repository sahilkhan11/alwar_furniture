import Link from 'next/link';
import { LayoutDashboard, Package, ListTree, ShoppingCart, Users, LogOut, FileText, Image, Settings } from 'lucide-react';
import { LogoutButton } from '../../components/LogoutButton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row md:flex-row min-h-[calc(100vh-64px)] bg-neutral-100">
      {/* Sidebar */}
      <aside className="w-full sm:w-64 md:w-64 bg-slate-900 text-white flex flex-col relative shrink-0">
        <div className="p-4 font-bold text-lg border-b border-slate-800 flex justify-between items-center">
          <span>Admin Dashboard</span>
          <Link href="/" className="sm:hidden md:hidden text-sm text-brand-accent">Back to Store</Link>
        </div>
        <nav className="flex flex-row sm:flex-col md:flex-col p-4 gap-2 overflow-x-auto whitespace-nowrap no-scrollbar sm:flex-1 md:flex-1">
          <Link href="/admin" className="px-4 py-2 rounded bg-slate-800/50 hover:bg-slate-700">Overview</Link>
          <Link href="/admin/products" className="px-4 py-2 rounded bg-slate-800/50 hover:bg-slate-700">Products</Link>
          <Link href="/admin/categories" className="px-4 py-2 rounded bg-slate-800/50 hover:bg-slate-700">Categories</Link>
          <Link href="/admin/orders" className="px-4 py-2 rounded bg-slate-800/50 hover:bg-slate-700">Orders</Link>
          <Link href="/admin/users" className="px-4 py-2 rounded bg-slate-800/50 hover:bg-slate-700">Users</Link>
          <Link href="/admin/sliders" className="px-4 py-2 rounded bg-slate-800/50 hover:bg-slate-700">Sliders</Link>
          <Link href="/admin/resources" className="px-4 py-2 rounded bg-slate-800/50 hover:bg-slate-700">Resources</Link>
          <Link href="/admin/settings" className="px-4 py-2 rounded bg-slate-800/50 hover:bg-slate-700 text-amber-500">Settings</Link>
          
          <div className="hidden sm:block md:block flex-1" /> {/* Spacer */}
          <div className="hidden md:block"><LogoutButton /></div>
        </nav>
        <div className="hidden md:block p-4">
          <Link href="/" className="block text-center text-sm text-neutral-400 hover:text-white transition">
            &larr; Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full overflow-x-hidden sm:overflow-auto md:overflow-auto bg-neutral-100">
        <div className="p-4 md:p-8 overflow-x-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
