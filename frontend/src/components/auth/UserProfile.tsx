import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { User, Mail, Calendar, Shield, LogOut, Package } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white">
            Mi Perfil
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Gestiona tu información personal
          </p>
        </div>

        <Card className="p-8 bg-gray-800 border-gray-700">
          <div className="space-y-6">
            {/* Información del usuario */}
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white">{user.name}</h2>
                <p className="text-gray-400">{user.email}</p>
                <div className="flex items-center mt-1">
                  {user.is_admin ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <Shield className="h-3 w-3 mr-1" />
                      Administrador
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <User className="h-3 w-3 mr-1" />
                      Usuario
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Detalles del usuario */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-300">Email</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-300">Miembro desde</p>
                    <p className="text-sm text-gray-400">
                      {formatDate(user.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-300">Rol</p>
                    <p className="text-sm text-gray-400">
                      {user.is_admin ? 'Administrador' : 'Usuario'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">
                    Estado de la cuenta
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Email verificado</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.email_verified_at 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.email_verified_at ? 'Sí' : 'No'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Última actualización</span>
                      <span className="text-sm text-gray-400">
                        {formatDate(user.updated_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="border-t border-gray-700 pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate('/orders')}
                  className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Mis Órdenes
                </Button>
                <Button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isLoading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}; 