import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import userService from '../../services/userService';

const WishlistDebug: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [debugData, setDebugData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testWishlistConnection = async () => {
    setLoading(true);
    setError(null);
    setDebugData(null);

    try {
      // Probar con un usuario específico (ID 15 como en la imagen)
      const response = await userService.getUserWishlist(15);
      console.log('🔍 Debug response:', response);
      
      setDebugData({
        success: response.success,
        data: response.data,
        message: response.message,
        dataLength: Array.isArray(response.data) ? response.data.length : 'No es array',
        dataType: typeof response.data,
      });
    } catch (err: any) {
      console.error('❌ Error en debug:', err);
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const testBackendDebug = async () => {
    setLoading(true);
    setError(null);
    setDebugData(null);

    try {
      // Llamar al endpoint de debug del backend
      const response = await fetch('http://localhost:8000/api/v1/admin/users/debug/wishlist-test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      console.log('🔍 Backend debug response:', data);
      
      setDebugData({
        success: data.success,
        data: data.data,
        message: data.message,
        status: response.status,
      });
    } catch (err: any) {
      console.error('❌ Error en backend debug:', err);
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Debug de Wishlist - Panel de Administración
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Pruebas de Conexión
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Este componente permite probar la conexión con el backend para la funcionalidad de wishlist.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={testWishlistConnection}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Probar Wishlist Usuario 15'}
            </Button>
            
            <Button
              variant="contained"
              color="secondary"
              onClick={testBackendDebug}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Probar Backend Debug'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6">Error</Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      )}

      {debugData && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Resultado de la Prueba
            </Typography>
            
            <Box sx={{ backgroundColor: '#f8f9fa', p: 2, borderRadius: 1, fontFamily: 'monospace', fontSize: '12px' }}>
              <pre>{JSON.stringify(debugData, null, 2)}</pre>
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Análisis:
              </Typography>
              <ul>
                <li>
                  <strong>Éxito:</strong> {debugData.success ? '✅ Sí' : '❌ No'}
                </li>
                <li>
                  <strong>Mensaje:</strong> {debugData.message}
                </li>
                <li>
                  <strong>Tipo de datos:</strong> {debugData.dataType || 'N/A'}
                </li>
                <li>
                  <strong>Cantidad de items:</strong> {debugData.dataLength || 'N/A'}
                </li>
                {debugData.status && (
                  <li>
                    <strong>Status HTTP:</strong> {debugData.status}
                  </li>
                )}
              </ul>
            </Box>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Instrucciones de Debug
          </Typography>
          <ol>
            <li>
              <strong>Probar Wishlist Usuario 15:</strong> Llama al endpoint específico para el usuario 15
            </li>
            <li>
              <strong>Probar Backend Debug:</strong> Llama al endpoint de debug del backend
            </li>
            <li>
              <strong>Verificar logs:</strong> Revisa la consola del navegador para logs detallados
            </li>
            <li>
              <strong>Verificar Network:</strong> Revisa la pestaña Network en DevTools
            </li>
          </ol>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Si no hay datos de wishlist, es posible que necesites ejecutar el seeder:
            <code>php artisan db:seed --class=WishlistSeeder</code>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default WishlistDebug; 