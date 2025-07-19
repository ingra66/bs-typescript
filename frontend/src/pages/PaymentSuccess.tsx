import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Home, Package, CreditCard } from 'lucide-react';
import paymentService from '../services/paymentService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';

const PaymentSuccess: React.FC = () => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner message="Confirmando pago..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icono de éxito */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-6">
              <CheckCircle size={40} className="text-white" />
            </div>
            <h1 className="text-white text-3xl font-bold mb-4">
              ¡Pago Exitoso!
            </h1>
            <p className="text-gray-400 text-lg">
              Tu pedido ha sido procesado correctamente
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
                  <p className="text-gray-400 text-sm">Monto pagado</p>
                  <p className="text-green-400 font-bold text-lg">
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

          {/* Información adicional */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h3 className="text-white text-lg font-semibold mb-4">
              ¿Qué sigue?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600 rounded-full mb-3">
                  <Package size={24} className="text-white" />
                </div>
                <h4 className="text-white font-medium mb-2">Procesamiento</h4>
                <p className="text-gray-400 text-sm">
                  Tu pedido está siendo preparado para el envío
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-600 rounded-full mb-3">
                  <CreditCard size={24} className="text-white" />
                </div>
                <h4 className="text-white font-medium mb-2">Confirmación</h4>
                <p className="text-gray-400 text-sm">
                  Recibirás un email con los detalles de tu compra
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-full mb-3">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <h4 className="text-white font-medium mb-2">Envío</h4>
                <p className="text-gray-400 text-sm">
                  Te notificaremos cuando tu pedido sea enviado
                </p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/')}
              variant="primary"
              iconBefore={<Home size={20} />}
              text="Volver al inicio"
            />
            <Button
              onClick={() => navigate('/profile')}
              variant="secondary"
              text="Ver mis pedidos"
            />
          </div>

          {/* Información adicional */}
          <div className="mt-8 p-4 bg-gray-700 rounded-lg">
            <h4 className="text-white font-medium mb-2">Información importante</h4>
            <ul className="text-gray-400 text-sm space-y-1 text-left">
              <li>• Recibirás un email de confirmación en los próximos minutos</li>
              <li>• El tiempo de envío es de 3-5 días hábiles</li>
              <li>• Puedes rastrear tu pedido desde tu perfil</li>
              <li>• Para consultas, contacta a soporte@beltspot.com</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 