import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/authService';

interface AuthInitializerProps {
  children: React.ReactNode;
}

export const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { setUser, setToken, clearAuth } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authService.getToken();
        const user = authService.getUser();

        if (token && user) {
          // Verificar si el token sigue siendo válido
          try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            setToken(token);
          } catch (error) {
            // Token inválido, limpiar estado
            clearAuth();
          }
        }
      } catch (error) {
        console.error('Error inicializando autenticación:', error);
        clearAuth();
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [setUser, setToken, clearAuth]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}; 