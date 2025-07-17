import React, { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import cartService from '../../services/cartService';
import type { Product } from '../../services/productService';
import { useCartStore } from '../../stores/cartStore';
import LoadingSpinner from '../ui/LoadingSpinner';

interface AddToCartButtonProps {
  product: Product;
  variant?: 'simple' | 'full';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ 
  product, 
  variant = 'full', 
  className = '',
  size = 'md'
}) => {
  const { isAuthenticated } = useAuthStore();
  const { addItem, getItemQuantity } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = () => {
    console.log('AddToCartButton: Botón clickeado para producto:', product.id);
    setIsAdding(true);
    
    // Crear el item
    const newItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.main_image || product.images?.[0] || '/placeholder.svg',
      quantity: 1,
      stock: product.stock
    };
    
    console.log('AddToCartButton: Agregando item:', newItem);
    
    // Usar el hook del store para que se re-renderice
    addItem(newItem);
    
    console.log('AddToCartButton: Item agregado al store');
    
    // Mostrar éxito inmediatamente
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
    
    // Sincronizar con backend en segundo plano si está autenticado
    if (isAuthenticated) {
      cartService.addToCart(product.id, 1).catch(error => {
        console.error('Error syncing with backend:', error);
      });
    }
    
    setIsAdding(false);
  };

  // Obtener cantidad actual usando el hook
  const currentQuantity = getItemQuantity(product.id);
  const isInCart = currentQuantity > 0;

  // Configuración de tamaños
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18
  };

  return (
    <div className="relative">
      <button
        onClick={handleAddToCart}
        disabled={isAdding || product.stock === 0}
        className={`
          flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200
          ${sizeClasses[size]}
          ${isInCart 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'bg-red-600 hover:bg-red-700 text-white'
          }
          ${product.stock === 0 ? 'bg-gray-500 cursor-not-allowed' : ''}
          ${isAdding ? 'opacity-75 cursor-wait' : ''}
          ${className}
        `}
      >
        {isAdding ? (
          <>
            <span className="w-4 h-4 inline-block align-middle">
              <LoadingSpinner size="sm" />
            </span>
            Agregando...
          </>
        ) : showSuccess ? (
          <>
            <Check size={iconSizes[size]} />
            ¡Agregado!
          </>
        ) : isInCart ? (
          <>
            <Check size={iconSizes[size]} />
            {variant === 'full' ? `En carrito (${currentQuantity})` : `(${currentQuantity})`}
          </>
        ) : (
          <>
            <ShoppingCart size={iconSizes[size]} />
            {product.stock === 0 ? 'Sin stock' : (variant === 'simple' ? 'Agregar' : 'Agregar al carrito')}
          </>
        )}
      </button>
      
      {isInCart && !showSuccess && variant === 'full' && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
          {currentQuantity}
        </div>
      )}
    </div>
  );
};

export default AddToCartButton; 