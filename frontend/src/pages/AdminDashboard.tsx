import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/stores/authStore';
import { Shield } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-900 py-12 px-4">
        <div className="max-w-lg w-full bg-gray-900 rounded-lg shadow-lg p-10 border border-gray-800 text-center">
          <div className="flex justify-center mb-6">
            <Shield className="h-12 w-12 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Panel de Administración</h1>
          <p className="text-lg text-gray-300 mb-6">Bienvenido, <span className="font-semibold text-blue-400">{user?.name}</span></p>
          <p className="text-gray-400">Desde aquí podrás gestionar productos, categorías, usuarios y más.<br/> (Próximamente...)</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}; 