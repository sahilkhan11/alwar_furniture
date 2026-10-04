import Link from 'next/link';
import { LayoutDashboard, Package, ListTree, ShoppingCart, Users, LogOut, FileText, Image, Settings } from 'lucide-react';
import { LogoutButton } from '../../components/LogoutButton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-neutral-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col shrink-0 md:fixed md:left-0 md:top-[64px] md:h-[calc(100vh-64px)] z-10 shadow-lg">
        <div className="p-4 font-bold text-lg border-b border-slate-800 flex justify-between items-center">
          <span>Admin Dashboard</span>
          <Link href="/" className="md:hidden text-sm text-brand-accent">Back to Store</Link>
        </div>
        <nav className="flex flex-row md:flex-col p-4 gap-2 overflow-x-auto whitespace-nowrap no-scrollbar flex-1">
          <Link href="/admin" className="px-4 py-2 rounded bg-slate-800/50 hover:bg-slate-700 w-full text-left">Overview</Link>
          <Link href="/admin/products" className="px-4 py-2 rounded bg-slate-800/50 hover:bg-slate-700 w-full text-left">Products</Link>
          <Link href="/admin/categories" className="px-4 py-2 rounded bg-slate-800/50 hover:bg-slate-700 w-full text-left">Categories</Link>
          <Link href="/admin/orders" className="px-4 py-2 rounded bg-slate-800/50 hover:bg-slate-700 w-full text-left">Orders</Link>
          <Link href="/admin/users" className="px-4 py-2 rounded bg-slate-800/50 hover:bg-slate-700 w-full text-left">Users</Link>
          <Link href="/admin/sliders" className="px-4 py-2 rounded bg-slate-800/50 hover:bg-slate-700 w-full text-left">Sliders</Link>
          <Link href="/admin/resources" className="px-4 py-2 rounded bg-slate-800/50 hover:bg-slate-700 w-full text-left">Resources</Link>
          <Link href="/admin/settings" className="px-4 py-2 rounded bg-slate-800/50 hover:bg-slate-700 w-full text-left text-amber-500">Settings</Link>
          
          <div className="hidden md:block flex-1" /> {/* Spacer */}
          <div className="hidden md:block w-full"><LogoutButton /></div>
        </nav>
        <div className="hidden md:block p-4 border-t border-slate-800">
          <Link href="/" className="block text-center text-sm text-neutral-400 hover:text-white transition w-full">
            &larr; Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full bg-neutral-100 md:ml-64 min-h-[calc(100vh-64px)]">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
