import React, { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import cartService from '../../services/cartService';
import type { Product } from '../../types/product';

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product, className = '' }) => {
  const { isAuthenticated } = useAuthStore();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = () => {
    console.log('AddToCartButton: Botón clickeado para producto:', product.id);
    setIsAdding(true);
    
    // Agregar directamente al store como el test
    const newItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      stock: product.stock
    };
    
    console.log('AddToCartButton: Agregando item:', newItem);
    
    // Usar el store directamente como el test
    useCartStore.getState().addItem(newItem);
    
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

  // Obtener cantidad actual directamente del store
  const currentQuantity = useCartStore.getState().getItemQuantity(product.id);

  const isInCart = currentQuantity > 0;

  return (
    <div className="relative">
      <button
        onClick={handleAddToCart}
        disabled={isAdding || product.stock === 0}
        className={`
          flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
          ${isInCart 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
          }
          ${product.stock === 0 ? 'bg-gray-500 cursor-not-allowed' : ''}
          ${isAdding ? 'opacity-75 cursor-wait' : ''}
          ${className}
        `}
      >
        {isAdding ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Agregando...
          </>
        ) : showSuccess ? (
          <>
            <Check size={16} />
            ¡Agregado!
          </>
        ) : isInCart ? (
          <>
            <Check size={16} />
            En carrito ({currentQuantity})
          </>
        ) : (
          <>
            <ShoppingCart size={16} />
            {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
          </>
        )}
      </button>
      
      {isInCart && !showSuccess && (
        <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
          {currentQuantity}
        </div>
      )}
    </div>
  );
};

export default AddToCartButton; 