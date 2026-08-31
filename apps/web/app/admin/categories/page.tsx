'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Category {
  id: string;
  name: string;
  description: string;
}

export default function AdminCategoriesPage() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiClient.get<Category[]>('/categories');
      return res.data;
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <button className="bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800">
          Add Category
        </button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded border shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell>{cat.description || 'N/A'}</TableCell>
                  <TableCell>
                    <button className="text-blue-600 hover:underline mr-4">Edit</button>
                    <button className="text-red-600 hover:underline">Delete</button>
                  </TableCell>
                </TableRow>
              ))}
              {categories?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-slate-500">
                    No categories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
