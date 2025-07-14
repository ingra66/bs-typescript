import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import type { CartItem as CartItemType } from '../../stores/cartStore';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();

  // Debug: ver qué datos llegan
  console.log('CartItem: Datos del item:', item);

  // Asegurar que price sea un número
  const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
  const stock = typeof item.stock === 'number' ? item.stock : parseInt(item.stock) || 0;

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= stock) {
      await updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = async () => {
    await removeItem(item.id);
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-700">
      {/* Imagen del producto */}
      <div className="flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-lg"
        />
      </div>

      {/* Información del producto */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-medium truncate">{item.name}</h3>
        <p className="text-gray-400 text-sm">
          Stock disponible: {stock}
        </p>
        <p className="text-green-400 font-semibold">
          ${price.toFixed(2)}
        </p>
      </div>

      {/* Controles de cantidad */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Minus size={16} className="text-white" />
        </button>
        
        <span className="text-white font-medium min-w-[2rem] text-center">
          {item.quantity}
        </span>
        
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={item.quantity >= stock}
          className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus size={16} className="text-white" />
        </button>
      </div>

      {/* Precio total del item */}
      <div className="text-right min-w-[4rem]">
        <p className="text-green-400 font-semibold">
          ${(price * item.quantity).toFixed(2)}
        </p>
      </div>

      {/* Botón eliminar */}
      <button
        onClick={handleRemove}
        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-full transition-colors"
        aria-label="Eliminar producto"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default CartItem; 