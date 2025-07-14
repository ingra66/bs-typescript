import React, { useEffect, useRef } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';

const CartSync: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { loadFromBackend, clearCart } = useCartStore();
  const lastAuthState = useRef(isAuthenticated);

  // Cargar carrito del backend cuando el usuario se autentica
  useEffect(() => {
    // Solo ejecutar cuando cambia el estado de autenticación
    if (isAuthenticated !== lastAuthState.current) {
      if (isAuthenticated) {
        console.log('CartSync: Usuario autenticado, cargando carrito del backend');
        // Solo cargar si no hay items locales
        const { items } = useCartStore.getState();
        if (items.length === 0) {
          loadFromBackend();
        } else {
          console.log('CartSync: Hay items locales, sincronizando con backend');
          // Sincronizar items locales con backend
          useCartStore.getState().syncWithBackend();
        }
      } else {
        console.log('CartSync: Usuario no autenticado, limpiando carrito local');
        clearCart();
      }
      lastAuthState.current = isAuthenticated;
    }
  }, [isAuthenticated, loadFromBackend, clearCart]);

  return null; // Componente invisible
};

export default CartSync; 