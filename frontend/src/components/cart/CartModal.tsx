import React, { useEffect } from 'react';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import CartItem from './CartItem';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CartModal: React.FC = () => {
  const {
    isOpen,
    closeCart,
    items,
    getTotalItems,
    getTotalPrice,
    isLoading,
    clearCart,
    removeItem
  } = useCartStore();

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
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeCart]);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
    closeCart();
  };

  const handleViewCart = () => {
    navigate('/cart');
    closeCart();
  };

  const handleContinueShopping = () => {
    closeCart();
    navigate('/');
  };

  const handleRemoveItem = async (itemId: number) => {
    await removeItem(itemId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay sutil */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.15)',
              zIndex: 40,
              pointerEvents: 'auto'
            }}
            onClick={closeCart}
          />
          
          {/* Sidebar minimalista */}
          <motion.div
            initial={{ transform: 'translateX(100%)' }}
            animate={{ transform: 'translateX(0)' }}
            exit={{ transform: 'translateX(100%)' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              height: '100vh',
              width: '20vw',
              minWidth: '320px',
              maxWidth: '480px',
              backgroundColor: '#000000',
              boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.8)',
              zIndex: 50,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header minimalista */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '24px 20px',
              borderBottom: '1px solid #1a1a1a'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <ShoppingBag size={18} style={{ color: 'white' }} />
                <h2 style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 400,
                  margin: 0
                }}>
                  Carrito ({getTotalItems()})
                </h2>
              </div>
              <button
                onClick={closeCart}
                style={{
                  padding: '6px',
                  color: '#666',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#666';
                }}
                aria-label="Cerrar carrito"
              >
                <X size={16} />
              </button>
            </div>

            {/* Contenido del carrito */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              backgroundColor: '#000000',
              padding: '0 20px'
            }}>
              {isLoading ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100px'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #333',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                </div>
              ) : items.length === 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '200px',
                  textAlign: 'center'
                }}>
                  <ShoppingBag size={24} style={{ color: '#333', marginBottom: '12px' }} />
                  <h3 style={{
                    color: '#666',
                    fontSize: '14px',
                    fontWeight: 400,
                    margin: '0 0 8px 0'
                  }}>
                    Carrito vacío
                  </h3>
                  <p style={{
                    color: '#444',
                    fontSize: '12px',
                    margin: '0 0 16px 0'
                  }}>
                    Agrega productos para comenzar
                  </p>
                  <button
                    onClick={handleContinueShopping}
                    style={{
                      backgroundColor: 'white',
                      color: 'black',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '12px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0f0f0';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    Continuar comprando
                  </button>
                </div>
              ) : (
                <div style={{ paddingTop: '16px' }}>
                  {items.map((item) => (
                    <div key={item.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px 0',
                      borderBottom: '1px solid #1a1a1a'
                    }}>
                      {/* Imagen del producto */}
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        flexShrink: 0
                      }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>

                      {/* Información del producto */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: 400,
                          margin: '0 0 4px 0',
                          lineHeight: '1.2'
                        }}>
                          {item.name}
                        </h3>
                        <p style={{
                          color: '#666',
                          fontSize: '12px',
                          margin: 0
                        }}>
                          {item.quantity} x ${Number(item.price).toFixed(2)}
                        </p>
                      </div>

                      {/* Botón eliminar */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        style={{
                          padding: '4px',
                          color: '#666',
                          backgroundColor: 'transparent',
                          border: 'none',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          width: '20px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#666';
                        }}
                        aria-label="Eliminar producto"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer minimalista */}
            {items.length > 0 && (
              <div style={{
                borderTop: '1px solid #1a1a1a',
                padding: '20px',
                backgroundColor: '#000000'
              }}>
                {/* Subtotal */}
                <div style={{
                  textAlign: 'center',
                  marginBottom: '20px'
                }}>
                  <p style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 600,
                    margin: 0
                  }}>
                    Subtotal: ${getTotalPrice().toFixed(2)}
                  </p>
                </div>

                {/* Botones */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleViewCart}
                    style={{
                      flex: 1,
                      backgroundColor: '#1a1a1a',
                      color: 'white',
                      padding: '12px 16px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '12px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#333';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#1a1a1a';
                    }}
                  >
                    View cart
                  </button>
                  
                  <button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    style={{
                      flex: 1,
                      backgroundColor: '#1a1a1a',
                      color: 'white',
                      padding: '12px 16px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '12px',
                      transition: 'all 0.2s',
                      opacity: isLoading ? 0.5 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.backgroundColor = '#333';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.backgroundColor = '#1a1a1a';
                      }
                    }}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartModal; 