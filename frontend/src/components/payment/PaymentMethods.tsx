import React, { useState, useEffect } from 'react';
import { CreditCard, Wallet, Banknote } from 'lucide-react';
import mercadoPagoService from '../../services/mercadopagoService';
import type { PaymentMethod } from '../../types/payment';
import LoadingSpinner from '../ui/LoadingSpinner';

interface PaymentMethodsProps {
  className?: string;
  onMethodSelect?: (method: PaymentMethod) => void;
  selectedMethod?: PaymentMethod | null;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ 
  className = '', 
  onMethodSelect,
  selectedMethod 
}) => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await mercadoPagoService.getPaymentMethods();
      
      if (response.success) {
        setMethods(response.data);
      } else {
        setError('Error al cargar métodos de pago');
      }
    } catch (err) {
      setError('Error al cargar métodos de pago');
      console.error('Error loading payment methods:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentIcon = (paymentTypeId: string) => {
    switch (paymentTypeId) {
      case 'credit_card':
        return <CreditCard size={24} className="text-red-400" />;
      case 'debit_card':
        return <CreditCard size={24} className="text-green-400" />;
      case 'digital_wallet':
        return <Wallet size={24} className="text-purple-400" />;
      default:
        return <Banknote size={24} className="text-gray-400" />;
    }
  };

  const getPaymentTypeLabel = (paymentTypeId: string) => {
    switch (paymentTypeId) {
      case 'credit_card':
        return 'Tarjeta de crédito';
      case 'debit_card':
        return 'Tarjeta de débito';
      case 'digital_wallet':
        return 'Billetera digital';
      case 'bank_transfer':
        return 'Transferencia bancaria';
      case 'cash':
        return 'Efectivo';
      default:
        return 'Otro método';
    }
  };

  if (loading) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 ${className} flex items-center justify-center`}>
        <LoadingSpinner message="Cargando métodos de pago..." size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
        <div className="text-center">
          <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-white text-lg font-medium mb-2">Error al cargar métodos de pago</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadPaymentMethods}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 rounded-lg ${className}`}>
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-white text-xl font-semibold mb-2">Métodos de pago</h2>
        <p className="text-gray-400">Selecciona tu método de pago preferido</p>
      </div>

      <div className="p-6">
        {methods.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-white text-lg font-medium mb-2">No hay métodos disponibles</h3>
            <p className="text-gray-400">No se encontraron métodos de pago en este momento</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {methods.map((method) => (
              <div
                key={method.id}
                onClick={() => onMethodSelect?.(method)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-700 ${
                  selectedMethod?.id === method.id
                    ? 'border-green-500 bg-gray-700'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {method.thumbnail ? (
                      <img
                        src={method.thumbnail}
                        alt={method.name}
                        className="w-12 h-8 object-contain"
                      />
                    ) : (
                      getPaymentIcon(method.payment_type_id)
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{method.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {getPaymentTypeLabel(method.payment_type_id)}
                    </p>
                  </div>
                  
                  {selectedMethod?.id === method.id && (
                    <div className="flex-shrink-0">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="p-6 bg-gray-700 rounded-b-lg">
        <div className="text-sm text-gray-300">
          <h4 className="text-white font-medium mb-2">Información importante:</h4>
          <ul className="space-y-1">
            <li>• Todos los pagos son procesados de forma segura por MercadoPago</li>
            <li>• Puedes pagar con tarjetas de crédito, débito o efectivo</li>
            <li>• Los pagos con tarjeta pueden tener cuotas sin interés</li>
            <li>• Recibirás confirmación por email después del pago</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods; 