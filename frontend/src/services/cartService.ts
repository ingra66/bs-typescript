import api from './api';

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
}

export interface CartResponse {
  success: boolean;
  data: {
    items: CartItem[];
    subtotal: number;
    formatted_subtotal: string;
    total_items: number;
  };
  message?: string;
}

class CartService {
  // Obtener carrito del usuario logueado
  async getCart(): Promise<CartResponse> {
    const response = await api.get('/cart');
    return response.data;
  }

  // Agregar producto al carrito
  async addToCart(productId: number, quantity: number = 1): Promise<CartResponse> {
    const response = await api.post('/cart/add', {
      product_id: productId,
      quantity
    });
    return response.data;
  }

  // Actualizar cantidad de un producto
  async updateCartItem(itemId: number, quantity: number): Promise<CartResponse> {
    const response = await api.put(`/cart/${itemId}`, {
      quantity
    });
    return response.data;
  }

  // Eliminar producto del carrito
  async removeFromCart(itemId: number): Promise<CartResponse> {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data;
  }

  // Limpiar carrito
  async clearCart(): Promise<void> {
    await api.delete('/cart/clear');
  }

  // Sincronizar carrito local con backend
  async syncCart(localCart: any[]): Promise<CartResponse> {
    const response = await api.post('/cart/sync', {
      items: localCart
    });
    return response.data;
  }
}

export default new CartService(); 