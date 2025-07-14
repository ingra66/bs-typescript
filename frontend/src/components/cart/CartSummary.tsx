import React from 'react';
import { useCartStore } from '../../stores/cartStore';

interface CartSummaryProps {
  className?: string;
}

const CartSummary: React.FC<CartSummaryProps> = ({ className = '' }) => {
  const { getTotalItems, getTotalPrice } = useCartStore();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
      <h3 className="text-white font-semibold mb-3">Resumen del carrito</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-gray-300">
          <span>Productos ({totalItems})</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Envío</span>
          <span className="text-green-400">Gratis</span>
        </div>
        <div className="border-t border-gray-600 pt-2">
          <div className="flex justify-between text-white font-semibold">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-400">
        <p>• Envío gratuito en pedidos superiores a $50</p>
        <p>• Devoluciones gratuitas hasta 30 días</p>
      </div>
    </div>
  );
};

export default CartSummary; 