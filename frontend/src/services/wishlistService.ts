import api from './api';

import type { Product } from './productService';

export interface WishlistItem {
  id: number;
  product: Product;
  notes?: string;
  is_public: boolean;
  created_at: string;
}

export interface WishlistResponse {
  success: boolean;
  data: WishlistItem[];
  message: string;
}

export interface WishlistCheckResponse {
  success: boolean;
  data: {
    is_in_wishlist: boolean;
  };
}

class WishlistService {
  /**
   * Obtener todos los productos en la wishlist del usuario
   */
  async getWishlist(): Promise<WishlistItem[]> {
    try {
      const response = await api.get<WishlistResponse>('/wishlist');
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener wishlist:', error);
      throw error;
    }
  }

  /**
   * Agregar un producto a la wishlist
   */
  async addToWishlist(productId: number, notes?: string, isPublic: boolean = false): Promise<WishlistItem> {
    try {
      const response = await api.post<{ success: boolean; data: WishlistItem; message: string }>('/wishlist', {
        product_id: productId,
        notes,
        is_public: isPublic,
      });
      return response.data.data;
    } catch (error) {
      console.error('Error al agregar a wishlist:', error);
      throw error;
    }
  }

  /**
   * Eliminar un producto de la wishlist
   */
  async removeFromWishlist(productId: number): Promise<void> {
    try {
      await api.delete(`/wishlist/${productId}`);
    } catch (error) {
      console.error('Error al eliminar de wishlist:', error);
      throw error;
    }
  }

  /**
   * Verificar si un producto está en la wishlist
   */
  async checkWishlistStatus(productId: number): Promise<boolean> {
    try {
      const response = await api.get<WishlistCheckResponse>(`/wishlist/check/${productId}`);
      return response.data.data.is_in_wishlist;
    } catch (error) {
      console.error('Error al verificar estado de wishlist:', error);
      return false;
    }
  }

  /**
   * Toggle del estado de wishlist (agregar/eliminar)
   */
  async toggleWishlist(productId: number, notes?: string, isPublic: boolean = false): Promise<boolean> {
    try {
      const isInWishlist = await this.checkWishlistStatus(productId);
      
      if (isInWishlist) {
        await this.removeFromWishlist(productId);
        return false; // Ya no está en wishlist
      } else {
        await this.addToWishlist(productId, notes, isPublic);
        return true; // Ahora está en wishlist
      }
    } catch (error) {
      console.error('Error al toggle wishlist:', error);
      throw error;
    }
  }
}

export const wishlistService = new WishlistService(); 