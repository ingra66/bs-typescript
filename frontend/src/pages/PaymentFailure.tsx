import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, RefreshCw, Home, CreditCard } from 'lucide-react';
import paymentService from '../services/paymentService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';

const PaymentFailure: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const paymentResponse = paymentService.processPaymentResponse(searchParams);

    if (paymentResponse.paymentId && paymentResponse.preferenceId) {
      setOrderDetails({
        orderNumber: paymentResponse.externalReference || 'ORD-' + Date.now(),
        paymentId: paymentResponse.paymentId,
        amount: paymentResponse.amount || '0',
        paymentMethod: paymentResponse.paymentMethodType || 'Tarjeta',
      });
    }
    setLoading(false);
  }, [searchParams]);

  const handleRetryPayment = () => {
    // Aquí podrías redirigir al checkout nuevamente
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner message="Verificando pago..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icono de error */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-6">
              <XCircle size={40} className="text-white" />
            </div>
            <h1 className="text-white text-3xl font-bold mb-4">
              Pago Fallido
            </h1>
            <p className="text-gray-400 text-lg">
              No se pudo procesar tu pago. No te preocupes, no se ha cobrado nada.
            </p>
          </div>

          {/* Detalles del pago */}
          {orderDetails && (
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h2 className="text-white text-xl font-semibold mb-4">
                Detalles de la transacción
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-gray-400 text-sm">Número de orden</p>
                  <p className="text-white font-medium">{orderDetails.orderNumber}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">ID de pago</p>
                  <p className="text-white font-medium">{orderDetails.paymentId}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Monto</p>
                  <p className="text-white font-bold text-lg">
                    ${Number(orderDetails.amount).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Método de pago</p>
                  <p className="text-white font-medium">{orderDetails.paymentMethod}</p>
                </div>
              </div>
            </div>
          )}

          {/* Posibles causas */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h3 className="text-white text-lg font-semibold mb-4">
              Posibles causas del error
            </h3>
            <div className="text-left space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-400 text-sm">
                  Fondos insuficientes en la cuenta o tarjeta
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-400 text-sm">
                  Datos de la tarjeta incorrectos o vencidos
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-400 text-sm">
                  Problemas temporales con el procesador de pagos
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-400 text-sm">
                  La transacción fue cancelada por el usuario
                </p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleRetryPayment}
              variant="primary"
              iconBefore={<RefreshCw size={20} />}
              text="Intentar nuevamente"
            />
            <Button
              onClick={() => navigate('/cart')}
              variant="secondary"
              iconBefore={<CreditCard size={20} />}
              text="Revisar carrito"
            />
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              iconBefore={<Home size={20} />}
              text="Volver al inicio"
            />
          </div>

          {/* Información adicional */}
          <div className="mt-8 p-4 bg-gray-700 rounded-lg">
            <h4 className="text-white font-medium mb-2">¿Necesitas ayuda?</h4>
            <ul className="text-gray-400 text-sm space-y-1 text-left">
              <li>• Verifica que los datos de tu tarjeta sean correctos</li>
              <li>• Asegúrate de tener fondos suficientes</li>
              <li>• Intenta con otro método de pago</li>
              <li>• Contacta a soporte@beltspot.com si el problema persiste</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure; 