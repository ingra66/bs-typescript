import React, { useState } from 'react';
import paymentService from '../../services/paymentService';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';

const PaymentDebug: React.FC = () => {
  const { items } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testPaymentPreference = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      console.log('Testing payment with items:', items);
      console.log('User:', user);

      const response = await paymentService.createPaymentPreference(items, user);
      setResult(response);
    } catch (err) {
      console.error('Payment test error:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const testOrderPayment = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await paymentService.createOrderPayment({});
      setResult(response);
    } catch (err) {
      console.error('Order payment test error:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h3 className="text-white text-lg font-semibold mb-4">Debug de MercadoPago</h3>
      
      <div className="space-y-4">
        {/* Información del carrito */}
        <div className="bg-gray-700 rounded p-4">
          <h4 className="text-white font-medium mb-2">Carrito actual:</h4>
          <div className="text-gray-300 text-sm">
            <p>Items: {items.length}</p>
            <p>Usuario: {user?.name || 'No autenticado'}</p>
            <p>Email: {user?.email || 'No disponible'}</p>
          </div>
        </div>

        {/* Botones de prueba */}
        <div className="flex gap-4">
          <button
            onClick={testPaymentPreference}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
          >
            {loading ? 'Probando...' : 'Probar Preferencia'}
          </button>
          
          <button
            onClick={testOrderPayment}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
          >
            {loading ? 'Probando...' : 'Probar Orden'}
          </button>
        </div>

        {/* Resultado */}
        {result && (
          <div className="bg-green-900/20 border border-green-500/30 rounded p-4">
            <h4 className="text-green-400 font-medium mb-2">Resultado exitoso:</h4>
            <pre className="text-green-300 text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded p-4">
            <h4 className="text-red-400 font-medium mb-2">Error:</h4>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentDebug; 