import React, { useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import api from '@/services/api';

const AuthDebug: React.FC = () => {
  const [authInfo, setAuthInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      // Verificar token en localStorage
      const token = authService.getToken();
      const user = authService.getUser();
      
      // Intentar hacer una petición autenticada
      let authResponse = null;
      try {
        const response = await api.get('/user');
        authResponse = response.data;
      } catch (error: any) {
        authResponse = {
          error: error.response?.data || error.message,
          status: error.response?.status
        };
      }

      setAuthInfo({
        token: token ? `${token.substring(0, 20)}...` : 'No hay token',
        user: user,
        authResponse: authResponse,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error checking auth:', error);
      setAuthInfo({ error: 'Error al verificar autenticación' });
    } finally {
      setLoading(false);
    }
  };

  const clearAuth = () => {
    authService.clearAuth();
    setAuthInfo(null);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Debug de Autenticación</h3>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <button 
            onClick={checkAuthStatus}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Verificar Estado'}
          </button>
          
          <button 
            onClick={clearAuth}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Limpiar Auth
          </button>
        </div>

        {authInfo && (
          <div className="space-y-2">
            <div className="p-3 bg-white border rounded">
              <h4 className="font-medium mb-2">Información de Autenticación:</h4>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(authInfo, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthDebug; 