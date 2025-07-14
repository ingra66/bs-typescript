import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Home, RefreshCw } from 'lucide-react';

const PaymentPending: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    const preferenceId = searchParams.get('preference_id');
    const externalReference = searchParams.get('external_reference');

    if (paymentId && preferenceId) {
      setOrderDetails({
        orderNumber: externalReference || 'ORD-' + Date.now(),
        paymentId: paymentId,
        amount: searchParams.get('amount') || '0',
        paymentMethod: searchParams.get('payment_method_type') || 'Tarjeta',
      });
    }
    setLoading(false);
  }, [searchParams]);

  // Timer para mostrar el tiempo transcurrido
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCheckStatus = async () => {
    // Aquí podrías hacer una llamada al backend para verificar el estado del pago
    // Por ahora solo recargamos la página
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icono de pendiente */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-600 rounded-full mb-6">
              <Clock size={40} className="text-white" />
            </div>
            <h1 className="text-white text-3xl font-bold mb-4">
              Pago Pendiente
            </h1>
            <p className="text-gray-400 text-lg">
              Tu pago está siendo procesado. Esto puede tomar unos minutos.
            </p>
          </div>

          {/* Timer */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-white text-xl font-semibold mb-4">
              Tiempo de espera
            </h2>
            <div className="text-4xl font-bold text-yellow-400 mb-4">
              {formatTime(timeElapsed)}
            </div>
            <p className="text-gray-400 text-sm">
              El procesamiento puede tomar hasta 10 minutos
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

          {/* Estados posibles */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h3 className="text-white text-lg font-semibold mb-4">
              Estados posibles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-yellow-900/20 rounded-lg">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-600 rounded-full mb-3">
                  <Clock size={24} className="text-white" />
                </div>
                <h4 className="text-yellow-400 font-medium mb-2">Pendiente</h4>
                <p className="text-gray-400 text-sm">
                  Procesando el pago
                </p>
              </div>
              <div className="text-center p-4 bg-green-900/20 rounded-lg">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-full mb-3">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <h4 className="text-green-400 font-medium mb-2">Aprobado</h4>
                <p className="text-gray-400 text-sm">
                  Pago confirmado
                </p>
              </div>
              <div className="text-center p-4 bg-red-900/20 rounded-lg">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600 rounded-full mb-3">
                  <XCircle size={24} className="text-white" />
                </div>
                <h4 className="text-red-400 font-medium mb-2">Rechazado</h4>
                <p className="text-gray-400 text-sm">
                  Pago fallido
                </p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleCheckStatus}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={20} />
              Verificar estado
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Ver mis pedidos
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-600 hover:bg-gray-500 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Volver al inicio
            </button>
          </div>

          {/* Información adicional */}
          <div className="mt-8 p-4 bg-gray-700 rounded-lg">
            <h4 className="text-white font-medium mb-2">Información importante</h4>
            <ul className="text-gray-400 text-sm space-y-1 text-left">
              <li>• Algunos métodos de pago pueden tardar más en procesarse</li>
              <li>• Recibirás una notificación cuando el pago se confirme</li>
              <li>• Puedes verificar el estado desde tu perfil</li>
              <li>• Si pasan más de 30 minutos, contacta a soporte@beltspot.com</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPending; 