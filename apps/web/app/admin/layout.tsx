import Link from 'next/link';
import { LayoutDashboard, Package, ListTree, ShoppingCart, Users, LogOut, FileText, Image, Settings, Search, ChevronLeft } from 'lucide-react';
import { LogoutButton } from '../../components/LogoutButton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Products', icon: Package, href: '/admin/products', hasSubmenu: true },
    { name: 'Categories', icon: ListTree, href: '/admin/categories', hasSubmenu: true },
    { name: 'Orders', icon: ShoppingCart, href: '/admin/orders', hasSubmenu: true },
    { name: 'Users', icon: Users, href: '/admin/users' },
    { name: 'Sliders', icon: Image, href: '/admin/sliders', hasSubmenu: true },
    { name: 'Resources', icon: FileText, href: '/admin/resources', hasSubmenu: true },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-full md:w-[260px] bg-[#222831] text-gray-300 flex flex-col shrink-0 md:fixed md:left-0 md:top-0 md:h-screen z-50">
        
        {/* Branding / Top Area */}
        <div className="h-16 flex items-center px-6 bg-[#1b1f26] text-white font-semibold tracking-wider text-sm border-b border-gray-800 shadow-sm relative">
          ALWAR ADMIN
          {/* A small white triangle pointer on the right border like in the image */}
          <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-slate-50"></div>
        </div>

        {/* Search Bar matching image */}
        <div className="px-4 py-3 bg-[#1e232b]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-transparent border-b border-gray-600 text-sm py-2 pl-9 pr-2 text-white focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-2 no-scrollbar">
          {menuItems.map((item, idx) => (
            <Link 
              key={idx} 
              href={item.href} 
              className="flex items-center px-6 py-3 hover:bg-[#2c3440] hover:text-white transition-colors group"
            >
              <item.icon className="w-4 h-4 mr-4 text-gray-400 group-hover:text-white" strokeWidth={2} />
              <span className="flex-1 text-sm font-light tracking-wide">{item.name}</span>
              {item.hasSubmenu && (
                <ChevronLeft className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
              )}
            </Link>
          ))}
        </nav>

        {/* Footer Area */}
        <div className="p-4 border-t border-gray-800 bg-[#1b1f26]">
          <LogoutButton className="w-full flex items-center px-2 py-2 hover:bg-[#2c3440] hover:text-white rounded text-sm font-light transition-colors text-gray-300" />
          <Link href="/" className="mt-2 flex items-center px-2 py-2 hover:bg-[#2c3440] hover:text-white rounded text-sm font-light transition-colors text-gray-300">
            &larr; <span className="ml-2">Back to Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full bg-slate-50 md:ml-[260px] min-h-screen">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
