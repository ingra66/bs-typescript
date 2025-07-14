import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';

interface CartIconProps {
  className?: string;
  onClick?: () => void;
}

const CartIcon: React.FC<CartIconProps> = ({ className = '', onClick }) => {
  const { getTotalItems, toggleCart } = useCartStore();
  const totalItems = getTotalItems();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      toggleCart();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`relative p-2 text-white hover:text-gray-300 transition-colors ${className}`}
        aria-label="Carrito de compras"
      >
        <ShoppingCart size={24} />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </button>
    </div>
  );
};

export default CartIcon; 