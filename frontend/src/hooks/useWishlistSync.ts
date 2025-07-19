import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useWishlistStore } from '../stores/wishlistStore';

export const useWishlistSync = () => {
  const { isAuthenticated } = useAuthStore();
  const { fetchWishlist, clearWishlist } = useWishlistStore();

  useEffect(() => {
    if (isAuthenticated) {
      // Sincronizar wishlist cuando el usuario se autentica
      fetchWishlist();
    } else {
      // Limpiar wishlist cuando el usuario se desautentica
      clearWishlist();
    }
  }, [isAuthenticated, fetchWishlist, clearWishlist]);
}; 