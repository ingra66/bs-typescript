import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import cartService from '../services/cartService';
import { useAuthStore } from './authStore';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  lastSync: number | null;
  
  // Acciones básicas
  addItem: (product: CartItem) => void;
  removeItem: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  closeCart: () => void;
  
  // Sincronización con backend
  syncWithBackend: () => Promise<void>;
  loadFromBackend: () => Promise<void>;
  
  // Getters
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemQuantity: (productId: number) => number;
  
        // Debug
      debugCart: () => Promise<void>;
      
      // Forzar sincronización
      forceSync: () => Promise<void>;
      
      // Forzar actualización
      forceUpdate: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoading: false,
      lastSync: null,

      addItem: (product: CartItem) => {
        console.log('=== cartStore: addItem INICIO ===');
        const { items } = get();
        console.log('cartStore: addItem llamado con producto:', product);
        console.log('cartStore: Items actuales:', items);
        
        const existingItem = items.find(item => item.id === product.id);
        console.log('cartStore: Item existente encontrado:', existingItem);
        
        if (existingItem) {
          // Actualizar cantidad si ya existe
          const updatedItems = items.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + product.quantity }
              : item
          );
          console.log('cartStore: Actualizando items:', updatedItems);
          set({ items: updatedItems });
        } else {
          // Agregar nuevo item
          const newItems = [...items, product];
          console.log('cartStore: Agregando nuevo item:', newItems);
          set({ items: newItems });
        }
        
        // Verificar el estado después de la actualización
        const finalState = get();
        console.log('cartStore: Estado final después de addItem:', finalState);
        console.log('cartStore: Items finales:', finalState.items);
        console.log('=== cartStore: addItem FIN ===');
      },

      removeItem: async (productId: number) => {
        const { isAuthenticated } = useAuthStore.getState();
        const { items } = get();
        
        // Actualización optimista: remover inmediatamente de la UI
        const updatedItems = items.filter(item => item.id !== productId);
        set({ items: updatedItems });
        
        if (isAuthenticated) {
          try {
            // Buscar el cartItem ID en el backend
            const response = await cartService.getCart();
            const cartItem = response.data?.items?.find((item: any) => item.product.id === productId);
            
            if (cartItem) {
              await cartService.removeFromCart(cartItem.id);
            }
          } catch (error) {
            console.error('Error removing item from backend:', error);
            // En caso de error, restaurar el item
            set({ items });
          }
        }
      },

      updateQuantity: async (productId: number, quantity: number) => {
        const { isAuthenticated } = useAuthStore.getState();
        const { items } = get();
        
        if (quantity <= 0) {
          await get().removeItem(productId);
          return;
        }
        
        // Actualización optimista: actualizar inmediatamente en la UI
        const updatedItems = items.map(item =>
          item.id === productId ? { ...item, quantity } : item
        );
        set({ items: updatedItems });
        
        if (isAuthenticated) {
          try {
            // Buscar el cartItem ID en el backend
            const response = await cartService.getCart();
            const cartItem = response.data?.items?.find((item: any) => item.product.id === productId);
            
            if (cartItem) {
              await cartService.updateCartItem(cartItem.id, quantity);
            }
          } catch (error) {
            console.error('Error updating quantity in backend:', error);
            // En caso de error, restaurar la cantidad original
            set({ items });
          }
        }
      },

      clearCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        
        // Actualización optimista: limpiar inmediatamente la UI
        set({ items: [] });
        
        if (isAuthenticated) {
          try {
            await cartService.clearCart();
          } catch (error) {
            console.error('Error clearing cart from backend:', error);
            // En caso de error, restaurar el carrito
            await get().loadFromBackend();
          }
        }
      },

      toggleCart: () => {
        const { isOpen } = get();
        set({ isOpen: !isOpen });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      syncWithBackend: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return;

        try {
          set({ isLoading: true });
          const { items } = get();
          console.log('cartStore: Items a sincronizar:', items);
          
          // Sincronizar carrito local con backend
          const response = await cartService.syncCart(items);
          
          // Actualizar con datos del backend
          if (response.data && response.data.items) {
            const mappedItems = response.data.items.map((item: any) => ({
              id: item.product.id,
              name: item.product.name,
              price: parseFloat(item.product.price),
              image: item.product.image || item.product.main_image,
              quantity: item.quantity,
              stock: item.product.stock
            }));
            console.log('cartStore: Items sincronizados:', mappedItems);
            set({ items: mappedItems });
          }
        } catch (error: any) {
          console.error('Error syncing cart:', error);
          // Si es un error 401, no hacer nada (el usuario no está autenticado)
          if (error.response?.status === 401) {
            console.log('cartStore: Usuario no autenticado, manteniendo carrito local');
          }
        } finally {
          set({ isLoading: false });
        }
      },

      loadFromBackend: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return;

        const { lastSync, items } = get();
        const now = Date.now();
        
        // Cache de 30 segundos para evitar llamadas innecesarias
        if (lastSync && (now - lastSync) < 30000) {
          return;
        }

        // Si hay items locales, no sobrescribir inmediatamente
        if (items.length > 0) {
          console.log('cartStore: Hay items locales, no sobrescribiendo desde backend');
          return;
        }

        try {
          set({ isLoading: true });
          const response = await cartService.getCart();
          
          // Verificar que response.data existe y tiene items
          if (response.data && response.data.items) {
            const mappedItems = response.data.items.map((item: any) => ({
              id: item.product.id,
              name: item.product.name,
              price: parseFloat(item.product.price),
              image: item.product.image || item.product.main_image,
              quantity: item.quantity,
              stock: item.product.stock
            }));
            set({ items: mappedItems, lastSync: now });
          } else {
            set({ items: [], lastSync: now });
          }
        } catch (error: any) {
          console.error('Error loading cart from backend:', error);
          // Si es un error 401, no hacer nada (el usuario no está autenticado)
          if (error.response?.status !== 401) {
            set({ items: [] });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getItemQuantity: (productId: number) => {
        const { items } = get();
        const item = items.find(item => item.id === productId);
        return item ? item.quantity : 0;
      },

      // Método de debug para verificar el estado del carrito
      debugCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        console.log('=== DEBUG CART ===');
        console.log('Usuario autenticado:', isAuthenticated);
        console.log('Token presente:', !!localStorage.getItem('auth_token'));
        
        if (isAuthenticated) {
          try {
            const response = await cartService.getCart();
            console.log('Carrito del backend:', response);
          } catch (error) {
            console.error('Error obteniendo carrito del backend:', error);
          }
        }
        
        const { items } = get();
        console.log('Carrito local:', items);
        console.log('=== FIN DEBUG ===');
      },

      // Forzar sincronización ignorando cache
      forceSync: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return;

        try {
          set({ isLoading: true, lastSync: null });
          const response = await cartService.getCart();
          
          if (response.data && response.data.items) {
            const mappedItems = response.data.items.map((item: any) => ({
              id: item.product.id,
              name: item.product.name,
              price: parseFloat(item.product.price),
              image: item.product.image || item.product.main_image,
              quantity: item.quantity,
              stock: item.product.stock
            }));
            set({ items: mappedItems, lastSync: Date.now() });
          } else {
            set({ items: [], lastSync: Date.now() });
          }
        } catch (error) {
          console.error('Error force syncing cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      // Forzar actualización del store
      forceUpdate: () => {
        const { items } = get();
        console.log('cartStore: Forzando actualización, items actuales:', items);
        set({ items: [...items] });
      },
    }),
    {
      name: 'cart-storage', // nombre de la clave en localStorage
      partialize: (state) => ({ items: state.items }), // solo persiste los items
    }
  )
); 