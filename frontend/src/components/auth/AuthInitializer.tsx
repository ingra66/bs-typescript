import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/authService';
import LoadingSpinner from '../ui/LoadingSpinner';

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
          } catch (error: any) {
            console.log('Token inválido o error de autenticación:', error);
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner message="Cargando autenticación..." size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}; 