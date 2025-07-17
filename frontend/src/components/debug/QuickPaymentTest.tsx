import React, { useState } from 'react';
import paymentService from '../../services/paymentService';

const QuickPaymentTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testPayment = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      // Simular items del carrito
      const mockItems = [
        {
          product_name: 'Producto Test',
          quantity: 1,
          unit_price: 100.00,
        }
      ];

      const mockUser = {
        name: 'Usuario Test',
        email: 'test@example.com',
      };

      console.log('Probando pago con datos mock...');
      const response = await paymentService.createPaymentPreference(mockItems, mockUser);
      setResult(response);

      if (response.success && response.data.sandbox_init_point) {
        console.log('¡Éxito! URL de pago:', response.data.sandbox_init_point);
      }

    } catch (err) {
      console.error('Error en prueba de pago:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const testSimplePayment = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      console.log('Probando pago simple...');
      const response = await paymentService.createSimplePreference();
      setResult(response);

      if (response.success && response.data.sandbox_init_point) {
        console.log('¡Éxito! URL de pago:', response.data.sandbox_init_point);
      }

    } catch (err) {
      console.error('Error en prueba simple:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h3 className="text-white text-lg font-semibold mb-4">Prueba Rápida de Pago</h3>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={testPayment}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
          >
            {loading ? 'Probando...' : 'Probar Pago Completo'}
          </button>
          
          <button
            onClick={testSimplePayment}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
          >
            {loading ? 'Probando...' : 'Probar Pago Simple'}
          </button>
        </div>

        {result && (
          <div className="bg-green-900/20 border border-green-500/30 rounded p-4">
            <h4 className="text-green-400 font-medium mb-2">✅ Resultado exitoso:</h4>
            <div className="text-green-300 text-sm space-y-2">
              <p><strong>Preference ID:</strong> {result.data.preference_id}</p>
              <p><strong>Sandbox URL:</strong> {result.data.sandbox_init_point}</p>
              <p><strong>Production URL:</strong> {result.data.init_point}</p>
            </div>
            {result.data.sandbox_init_point && (
              <button
                onClick={() => window.open(result.data.sandbox_init_point, '_blank')}
                className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
              >
                🔗 Abrir MercadoPago Sandbox
              </button>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded p-4">
            <h4 className="text-red-400 font-medium mb-2">❌ Error:</h4>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickPaymentTest; 