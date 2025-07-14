import React, { useEffect } from 'react';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import CartItem from './CartItem';
import { useNavigate } from 'react-router-dom';

const CartModal: React.FC = () => {
  const { 
    isOpen, 
    closeCart, 
    items, 
    getTotalItems, 
    getTotalPrice,
    isLoading,
    clearCart,
    debugCart
  } = useCartStore();
  
  // Debug: log de items cuando cambian
  console.log('CartModal: Items actuales:', items);
  console.log('CartModal: Total items:', getTotalItems());
  console.log('CartModal: Modal abierto:', isOpen);
  
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCart();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeCart]);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Redirigir a login y luego a checkout
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
    closeCart();
  };

  const handleContinueShopping = () => {
    closeCart();
    navigate('/');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeCart}
      />
      
      {/* Modal */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-white" size={24} />
              <h2 className="text-white text-xl font-semibold">
                Carrito ({getTotalItems()})
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={debugCart}
                className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-full transition-colors text-xs"
                title="Debug carrito"
              >
                🐛
              </button>
              <button
                onClick={closeCart}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Contenido */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <ShoppingBag className="text-gray-500 mb-4" size={48} />
                <h3 className="text-gray-400 text-lg font-medium mb-2">
                  Tu carrito está vacío
                </h3>
                <p className="text-gray-500 mb-6">
                  Agrega algunos productos para comenzar
                </p>
                <button
                  onClick={handleContinueShopping}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Continuar comprando
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-700 p-4 space-y-4">
              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-lg">Total:</span>
                <span className="text-white text-xl font-bold">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>

              {/* Botones */}
              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {isAuthenticated ? 'Proceder al pago' : 'Iniciar sesión para pagar'}
                  <ArrowRight size={18} />
                </button>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleContinueShopping}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Continuar comprando
                  </button>
                  
                  <button
                    onClick={clearCart}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartModal; 