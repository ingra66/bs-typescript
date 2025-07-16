import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, Eye } from 'lucide-react';
import orderService from '../../services/orderService';
import type { Order } from '../../types/order';
import { getOrderStatusLabel, getPaymentStatusLabel, getOrderStatusColor, getPaymentStatusColor } from '../../types/order';

interface OrderListProps {
  className?: string;
}

const OrderList: React.FC<OrderListProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    payment_status: '',
    order_by: 'created_at',
    order_direction: 'desc' as 'asc' | 'desc',
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  useEffect(() => {
    loadOrders();
  }, [filters, pagination.current_page]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await orderService.getOrders({
        ...filters,
        page: pagination.current_page,
        per_page: pagination.per_page,
      });

      if (response.success) {
        setOrders(response.data);
        setPagination(response.pagination);
      } else {
        setError('Error al cargar las órdenes');
      }
    } catch (err) {
      setError('Error al cargar las órdenes');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, current_page: page }));
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
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-white text-lg font-medium mb-2">Error al cargar órdenes</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadOrders}
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
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-white text-xl font-semibold">Mis Órdenes</h2>
            <p className="text-gray-400">Gestiona tus pedidos y compras</p>
          </div>
          
          {/* Filtros */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="processing">En proceso</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregado</option>
              <option value="cancelled">Cancelado</option>
            </select>
            
            <select
              value={filters.payment_status}
              onChange={(e) => handleFilterChange('payment_status', e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Todos los pagos</option>
              <option value="pending">Pendiente</option>
              <option value="paid">Pagado</option>
              <option value="failed">Fallido</option>
              <option value="refunded">Reembolsado</option>
            </select>
            
            <select
              value={filters.order_direction}
              onChange={(e) => handleFilterChange('order_direction', e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="desc">Más recientes</option>
              <option value="asc">Más antiguos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de órdenes */}
      <div className="p-6">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-white text-lg font-medium mb-2">No tienes órdenes</h3>
            <p className="text-gray-400 mb-4">Cuando hagas una compra, aparecerá aquí</p>
            <button
              onClick={() => navigate('/')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Comenzar a comprar
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Información principal */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-medium">{order.order_number}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                        {getOrderStatusLabel(order.status)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                        {getPaymentStatusLabel(order.payment_status)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(order.created_at)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Package size={14} />
                        {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-white font-semibold text-lg">
                        {formatCurrency(order.total_amount)}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {order.items.length} {order.items.length === 1 ? 'artículo' : 'artículos'}
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/orders/${order.id}`);
                      }}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <Eye size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginación */}
        {pagination.last_page > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="flex gap-2">
              {pagination.current_page > 1 && (
                <button
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Anterior
                </button>
              )}
              
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    page === pagination.current_page
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              {pagination.current_page < pagination.last_page && (
                <button
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Siguiente
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList; 