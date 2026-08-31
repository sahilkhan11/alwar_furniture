import React from 'react';
import { Search, ShieldAlert, ShieldCheck, Mail, Calendar } from 'lucide-react';

// Mock Data
const USERS = [
  { id: 'usr_01', name: 'Ramesh Kumar', email: 'ramesh@example.com', role: 'CUSTOMER', joined: 'Oct 1, 2026' },
  { id: 'usr_02', name: 'Priya Singh', email: 'priya@example.com', role: 'CUSTOMER', joined: 'Oct 5, 2026' },
  { id: 'usr_03', name: 'Admin User', email: 'admin@alwarfurniture.com', role: 'ADMIN', joined: 'Sep 15, 2026' },
  { id: 'usr_04', name: 'Amit Patel', email: 'amit@example.com', role: 'CUSTOMER', joined: 'Oct 12, 2026' },
];

export default function AdminUsers() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-900">Users</h1>
          <p className="text-neutral-600 mt-1">Manage registered customers and administrators</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
          <select className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-500">
            <option>All Roles</option>
            <option>CUSTOMER</option>
            <option>ADMIN</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-sm text-neutral-600">
              <tr>
                <th className="px-6 py-3 font-medium">User Name</th>
                <th className="px-6 py-3 font-medium">Contact</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Joined</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-sm">
              {USERS.map(user => (
                <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                        {user.name.charAt(0)}
                      </div>
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-neutral-600">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.role === 'ADMIN' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        <ShieldCheck className="w-3 h-3" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                        Customer
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-neutral-600">
                      <Calendar className="w-4 h-4" />
                      <span>{user.joined}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select 
                      className="text-sm border border-neutral-300 rounded-md py-1 px-2 text-neutral-700 bg-white hover:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      defaultValue={user.role}
                    >
                      <option value="CUSTOMER">Make Customer</option>
                      <option value="ADMIN">Make Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
