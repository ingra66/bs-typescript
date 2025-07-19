import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import orderService from '../../services/orderService';
import type { Order } from '../../types/order';
import { getOrderStatusLabel, getPaymentStatusLabel, getOrderStatusColor, getPaymentStatusColor } from '../../types/order';
import AlertModal from '../ui/AlertModal';

interface OrderDetailProps {
  className?: string;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ className = '' }) => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadOrder(parseInt(orderId));
    }
  }, [orderId]);

  const loadOrder = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await orderService.getOrder(id);
      
      if (response.success) {
        setOrder(response.data);
      } else {
        setError('Error al cargar la orden');
      }
    } catch (err) {
      setError('Error al cargar la orden');
      console.error('Error loading order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order || !confirm('¿Estás seguro de que quieres cancelar esta orden?')) {
      return;
    }

    try {
      setCancelling(true);
      const response = await orderService.cancelOrder(order.id);
      
      if (response.success) {
        setOrder(response.data);
        setShowSuccessAlert(true);
      } else {
        setShowErrorAlert(true);
      }
    } catch (err) {
      setShowErrorAlert(true);
      console.error('Error cancelling order:', err);
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-white text-lg font-medium mb-2">Error al cargar la orden</h3>
          <p className="text-gray-400 mb-4">{error || 'Orden no encontrada'}</p>
          <button
            onClick={() => navigate('/orders')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Volver a mis órdenes
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`bg-gray-800 rounded-lg ${className}`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/orders')}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-white text-2xl font-bold">{order.order_number}</h1>
              <p className="text-gray-400">Detalles de la orden</p>
            </div>
          </div>

          {/* Estados */}
          <div className="flex flex-wrap gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.status)}`}>
              {getOrderStatusLabel(order.status)}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
              {getPaymentStatusLabel(order.payment_status)}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Información general */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Calendar size={20} />
                Información de la orden
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Fecha de creación:</span>
                  <span className="text-white">{formatDate(order.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Última actualización:</span>
                  <span className="text-white">{formatDate(order.updated_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total de artículos:</span>
                  <span className="text-white">{order.items.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <DollarSign size={20} />
                Resumen de costos
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal:</span>
                  <span className="text-white">{formatCurrency(order.total_amount - order.tax_amount - order.shipping_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Envío:</span>
                  <span className="text-white">{formatCurrency(order.shipping_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Impuestos:</span>
                  <span className="text-white">{formatCurrency(order.tax_amount)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-600 pt-2">
                  <span className="text-white font-semibold">Total:</span>
                  <span className="text-green-400 font-bold text-lg">{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dirección de envío */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <MapPin size={20} />
              Dirección de envío
            </h3>
            <div className="text-sm text-gray-300">
              <p className="font-medium">{order.shipping_address.name}</p>
              <p>{order.shipping_address.address}</p>
              <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</p>
              <p>{order.shipping_address.country}</p>
              {order.shipping_address.phone && (
                <p className="mt-2">Tel: {order.shipping_address.phone}</p>
              )}
            </div>
          </div>

          {/* Productos */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Package size={20} />
              Productos ({order.items.length})
            </h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-600 rounded-lg">
                  <div className="w-16 h-16 bg-gray-500 rounded-lg flex items-center justify-center">
                    {item.product_data.images && item.product_data.images.length > 0 ? (
                      <img
                        src={item.product_data.images[0]}
                        alt={item.product_name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Package size={24} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{item.product_name}</h4>
                    <p className="text-gray-400 text-sm">SKU: {item.product_sku}</p>
                    <p className="text-gray-400 text-sm">Categoría: {item.product_data.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{formatCurrency(item.unit_price)}</p>
                    <p className="text-gray-400 text-sm">Cantidad: {item.quantity}</p>
                    <p className="text-green-400 font-semibold">{formatCurrency(item.total_price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notas */}
          {order.notes && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">Notas adicionales</h3>
              <p className="text-gray-300">{order.notes}</p>
            </div>
          )}

          {/* Acciones */}
          <div className="flex flex-wrap gap-3">
            {order.status === 'pending' && order.payment_status === 'pending' && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <AlertCircle size={16} />
                {cancelling ? 'Cancelando...' : 'Cancelar orden'}
              </button>
            )}
            
            <button
              onClick={() => navigate('/orders')}
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Volver a mis órdenes
            </button>
          </div>
        </div>
      </div>
      
      <AlertModal
        isOpen={showSuccessAlert}
        title="Orden cancelada"
        message="Orden cancelada exitosamente"
        confirmText="Aceptar"
        onConfirm={() => setShowSuccessAlert(false)}
        onCancel={() => setShowSuccessAlert(false)}
      />
      
      <AlertModal
        isOpen={showErrorAlert}
        title="Error"
        message="Error al cancelar la orden"
        confirmText="Aceptar"
        onConfirm={() => setShowErrorAlert(false)}
        onCancel={() => setShowErrorAlert(false)}
      />
    </>
  );
};

export default OrderDetail; 