import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-4 font-bold text-lg border-b border-slate-800">
          Admin Dashboard
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="block px-4 py-2 rounded hover:bg-slate-800">
            Overview
          </Link>
          <Link href="/admin/products" className="block px-4 py-2 rounded hover:bg-slate-800">
            Products
          </Link>
          <Link href="/admin/categories" className="block px-4 py-2 rounded hover:bg-slate-800">
            Categories
          </Link>
          <Link href="/admin/orders" className="block px-4 py-2 rounded hover:bg-slate-800">
            Orders
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-slate-50 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
