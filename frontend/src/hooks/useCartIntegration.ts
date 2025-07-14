import { useCartStore } from '../stores/cartStore';
import type { Product } from '../types/product';

export const useCartIntegration = () => {
  const { addItem, getItemQuantity, updateQuantity, removeItem } = useCartStore();

  const addToCart = (product: Product, quantity: number = 1) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      stock: product.stock
    });
  };

  const getQuantityInCart = (productId: number) => {
    return getItemQuantity(productId);
  };

  const updateQuantityInCart = (productId: number, quantity: number) => {
    updateQuantity(productId, quantity);
  };

  const removeFromCart = (productId: number) => {
    removeItem(productId);
  };

  const isInCart = (productId: number) => {
    return getItemQuantity(productId) > 0;
  };

  return {
    addToCart,
    getQuantityInCart,
    updateQuantityInCart,
    removeFromCart,
    isInCart
  };
}; 