import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import CartItem from '../components/cart/CartItem';

const CartPage: React.FC = () => {
  const { 
    items, 
    getTotalItems, 
    getTotalPrice, 
    clearCart,
    isLoading 
  } = useCartStore();
  
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      clearCart();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-white" size={28} />
              <h1 className="text-white text-2xl font-bold">
                Carrito de Compras
              </h1>
            </div>
          </div>
          
          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 px-3 py-2 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
              Vaciar carrito
            </button>
          )}
        </div>

        {/* Contenido */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="text-gray-500 mx-auto mb-6" size={64} />
                <h2 className="text-gray-400 text-xl font-medium mb-4">
                  Tu carrito está vacío
                </h2>
                <p className="text-gray-500 mb-8">
                  No tienes productos en tu carrito. ¡Agrega algunos productos para comenzar!
                </p>
                <button
                  onClick={handleContinueShopping}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Continuar comprando
                </button>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                  <h2 className="text-white text-lg font-semibold">
                    Productos ({getTotalItems()})
                  </h2>
                </div>
                <div className="divide-y divide-gray-700">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Resumen del pedido */}
          {items.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg p-6 sticky top-8">
                <h2 className="text-white text-lg font-semibold mb-6">
                  Resumen del pedido
                </h2>
                
                {/* Detalles */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Productos ({getTotalItems()})</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Envío</span>
                    <span>Gratis</span>
                  </div>
                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between text-white text-lg font-semibold">
                      <span>Total</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Botones */}
                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    {isAuthenticated ? 'Proceder al pago' : 'Iniciar sesión para pagar'}
                  </button>
                  
                  <button
                    onClick={handleContinueShopping}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Continuar comprando
                  </button>
                </div>

                {/* Información adicional */}
                <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Información importante</h3>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Envío gratuito en pedidos superiores a $50</li>
                    <li>• Devoluciones gratuitas hasta 30 días</li>
                    <li>• Pago seguro con tarjeta o efectivo</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage; 