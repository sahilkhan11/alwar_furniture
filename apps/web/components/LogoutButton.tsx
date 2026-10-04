'use client';

import { useAuthStore } from '../lib/store';
import { useRouter } from 'next/navigation';
import { cn } from '../lib/utils';
import { LogOut } from 'lucide-react';

export function LogoutButton({ className }: { className?: string }) {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className={cn("block w-full text-left px-4 py-2 mt-auto text-red-400 hover:bg-slate-800 rounded transition-colors", className)}
    >
      <div className="flex items-center">
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </div>
    </button>
  );
}
