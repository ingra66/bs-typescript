import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { wishlistService } from '../services/wishlistService';
import type { WishlistItem } from '../services/wishlistService';

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

interface WishlistActions {
  // Acciones básicas
  setItems: (items: WishlistItem[]) => void;
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Acciones de API
  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId: number, notes?: string, isPublic?: boolean) => Promise<boolean>;
  removeFromWishlist: (productId: number) => Promise<void>;
  toggleWishlist: (productId: number, notes?: string, isPublic?: boolean) => Promise<boolean>;
  checkWishlistStatus: (productId: number) => Promise<boolean>;
  
  // Utilidades
  isInWishlist: (productId: number) => boolean;
  getWishlistCount: () => number;
  clearWishlist: () => void;
}

type WishlistStore = WishlistState & WishlistActions;

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      items: [],
      isLoading: false,
      error: null,
      isInitialized: false,

      // Acciones básicas
      setItems: (items) => set({ items, isInitialized: true }),
      addItem: (item) => set((state) => ({ 
        items: [...state.items, item],
        error: null 
      })),
      removeItem: (productId) => set((state) => ({ 
        items: state.items.filter(item => item.product.id !== productId),
        error: null 
      })),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Acciones de API
      fetchWishlist: async () => {
        const { setLoading, setError, setItems } = get();
        
        try {
          setLoading(true);
          setError(null);
          const items = await wishlistService.getWishlist();
          setItems(items);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al cargar wishlist';
          setError(errorMessage);
          console.error('Error fetching wishlist:', error);
        } finally {
          setLoading(false);
        }
      },

      addToWishlist: async (productId, notes, isPublic = false) => {
        const { setLoading, setError, addItem } = get();
        
        try {
          setLoading(true);
          setError(null);
          const item = await wishlistService.addToWishlist(productId, notes, isPublic);
          addItem(item);
          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al agregar a wishlist';
          setError(errorMessage);
          console.error('Error adding to wishlist:', error);
          return false;
        } finally {
          setLoading(false);
        }
      },

      removeFromWishlist: async (productId) => {
        const { setLoading, setError, removeItem } = get();
        
        try {
          setLoading(true);
          setError(null);
          await wishlistService.removeFromWishlist(productId);
          removeItem(productId);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al eliminar de wishlist';
          setError(errorMessage);
          console.error('Error removing from wishlist:', error);
          throw error;
        } finally {
          setLoading(false);
        }
      },

      toggleWishlist: async (productId, notes, isPublic = false) => {
        const { setLoading, setError, addItem, removeItem } = get();
        
        try {
          setLoading(true);
          setError(null);
          const isInWishlist = await wishlistService.toggleWishlist(productId, notes, isPublic);
          
          if (isInWishlist) {
            // Si se agregó, necesitamos obtener el item completo
            const item = await wishlistService.addToWishlist(productId, notes, isPublic);
            addItem(item);
          } else {
            // Si se eliminó, removemos del estado local
            removeItem(productId);
          }
          
          return isInWishlist;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al toggle wishlist';
          setError(errorMessage);
          console.error('Error toggling wishlist:', error);
          return false;
        } finally {
          setLoading(false);
        }
      },

      checkWishlistStatus: async (productId) => {
        try {
          return await wishlistService.checkWishlistStatus(productId);
        } catch (error) {
          console.error('Error checking wishlist status:', error);
          return false;
        }
      },

      // Utilidades
      isInWishlist: (productId) => {
        const { items } = get();
        return items.some(item => item.product.id === productId);
      },

      getWishlistCount: () => {
        const { items } = get();
        return items.length;
      },

      clearWishlist: () => set({ items: [], error: null }),
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ 
        items: state.items,
        isInitialized: state.isInitialized 
      }),
    }
  )
); 