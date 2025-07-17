import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import paymentService from '../../services/paymentService';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import type { CreateOrderRequest } from '../../types/order';

interface PaymentProcessorProps {
  className?: string;
  orderData: CreateOrderRequest;
  onSuccess?: (orderId: number) => void;
  onError?: (error: string) => void;
}

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({
  className = '',
  orderData,
  onSuccess,
  onError,
}) => {
  const navigate = useNavigate();
  const { items } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'creating' | 'processing' | 'redirecting'>('creating');
  const [error, setError] = useState<string | null>(null);

  const processPayment = async () => {
    try {
      setLoading(true);
      setError(null);
      setStep('creating');

      console.log('Procesando pago con items:', items);
      console.log('Usuario:', user);

      // Intentar crear preferencia de pago con los items del carrito
      let preferenceResponse;
      try {
        preferenceResponse = await paymentService.createPaymentPreference(items, user);
      } catch (error) {
        console.log('Fallback: usando preferencia simple');
        // Si falla, usar el método simple que sabemos que funciona
        preferenceResponse = await paymentService.createSimplePreference();
      }
      
      if (!preferenceResponse.success) {
        throw new Error('Error al crear preferencia de pago');
      }

      setStep('redirecting');

      // Redirigir a MercadoPago usando la URL de sandbox para desarrollo
      const checkoutUrl = preferenceResponse.data.sandbox_init_point || preferenceResponse.data.init_point;
      
      // Notificar éxito antes de redirigir
      onSuccess?.(0); // ID temporal
      
      // Pequeño delay para mostrar el estado
      setTimeout(() => {
        paymentService.redirectToPayment(checkoutUrl);
      }, 1000);

    } catch (err) {
      console.error('Payment processing error:', err);
      
      // Obtener detalles del error si es una respuesta de Axios
      let errorMessage = 'Error desconocido';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as any;
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.response?.data?.errors) {
          errorMessage = JSON.stringify(axiosError.response.data.errors);
        } else {
          errorMessage = axiosError.message || 'Error en el pago';
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStepIcon = () => {
    switch (step) {
      case 'creating':
        return <Loader2 size={24} className="animate-spin text-red-400" />;
      case 'processing':
        return <CreditCard size={24} className="text-red-400" />;
      case 'redirecting':
        return <CheckCircle size={24} className="text-red-400" />;
      default:
        return <Loader2 size={24} className="animate-spin text-red-400" />;
    }
  };

  const getStepMessage = () => {
    switch (step) {
      case 'creating':
        return 'Creando tu orden...';
      case 'processing':
        return 'Preparando el pago...';
      case 'redirecting':
        return 'Redirigiendo a MercadoPago...';
      default:
        return 'Procesando...';
    }
  };



  return (
    <div className={`bg-gray-800 rounded-lg ${className}`}>
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-white text-xl font-semibold mb-2">Procesar pago</h2>
        <p className="text-gray-400">Completa tu compra de forma segura</p>
      </div>

      <div className="p-6">
        {error ? (
          <div className="text-center py-8">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-white text-lg font-medium mb-2">Error en el pago</h3>
            <p className="text-gray-400 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setError(null)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Reintentar
              </button>
              <button
                onClick={() => navigate('/cart')}
                className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Volver al carrito
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="text-center py-8">
            <div className="mb-4">
              {getStepIcon()}
            </div>
            <h3 className="text-white text-lg font-medium mb-2">{getStepMessage()}</h3>
            <p className="text-gray-400">Por favor, no cierres esta ventana</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Resumen de la orden */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">Resumen de tu orden</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Dirección de envío:</span>
                  <span className="text-white">{orderData.shipping_address.city}, {orderData.shipping_address.state}</span>
                </div>
                {orderData.coupon_code && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cupón aplicado:</span>
                    <span className="text-green-400">{orderData.coupon_code}</span>
                  </div>
                )}
                {orderData.notes && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Notas:</span>
                    <span className="text-white">{orderData.notes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Información de seguridad */}
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-red-400 mt-0.5" />
                <div>
                  <h4 className="text-white font-medium mb-2">Pago seguro</h4>
                  <p className="text-gray-300 text-sm">
                    Tu información de pago está protegida con encriptación SSL. 
                    MercadoPago es una plataforma de pago segura y confiable.
                  </p>
                </div>
              </div>
            </div>

            {/* Botón de pago */}
            <button
              onClick={processPayment}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <CreditCard size={20} />
              {loading ? 'Procesando...' : 'Pagar ahora'}
            </button>

            {/* Información adicional */}
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Al hacer clic en "Pagar ahora" serás redirigido a MercadoPago para completar tu pago de forma segura.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentProcessor; 