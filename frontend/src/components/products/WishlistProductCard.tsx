import React, { useState } from 'react';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import type { Product } from '../../services/productService';
import AutoCloseAlertModal from '../ui/AutoCloseAlertModal';
import AlertModal from '../ui/AlertModal';

interface WishlistProductCardProps {
  product: Product;
  className?: string;
  variant?: 'default' | 'compact';
  onRemove?: () => void;
}

const WishlistProductCard: React.FC<WishlistProductCardProps> = ({ 
  product, 
  className = '',
  variant = 'default',
  onRemove
}) => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { removeFromWishlist } = useWishlistStore();
  const [showCartAlert, setShowCartAlert] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Función para obtener la URL de la imagen
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return '/placeholder.svg';
    
    // Si ya es una URL completa, devolverla tal como está
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Construir URL completa
    const baseUrl = import.meta.env.DEV ? 'http://localhost:8000' : (import.meta.env.VITE_API_URL || 'http://localhost:8000');
    return `${baseUrl}/storage/${imagePath}`;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const item = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: getImageUrl(product.main_image || product.images?.[0]),
      quantity: 1,
      stock: product.stock
    };
    addItem(item);
    setShowCartAlert(true);
  };

  const handleProductClick = () => {
    navigate(`/product/${product.slug}`);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/product/${product.slug}`);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowRemoveModal(true);
  };

  const handleConfirmRemove = async () => {
    setIsRemoving(true);
    try {
      await removeFromWishlist(product.id);
      setShowRemoveModal(false);
      // Callback para actualizar la vista
      if (onRemove) {
        onRemove();
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Error al eliminar el producto de favoritos');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
  };

  // Configuración según variante
  const cardConfig = {
    default: {
      container: "bg-transparent transition-all duration-300 cursor-pointer group aspect-square flex flex-col",
      image: "flex-1 flex items-center justify-center p-2 relative",
      info: "p-3 text-center",
      title: "text-xs text-gray-300 mb-1 line-clamp-2",
      price: "text-sm font-bold text-white",
      button: "w-full bg-[#FF0000] hover:bg-black text-white px-2 py-1 text-xs font-medium transition-all duration-200 border border-white"
    },
    compact: {
      container: "bg-transparent transition-all duration-300 cursor-pointer group aspect-square flex flex-col",
      image: "flex-1 flex items-center justify-center p-1 relative",
      info: "p-2 text-center",
      title: "text-xs text-gray-300 mb-1 line-clamp-2",
      price: "text-sm font-bold text-white",
      button: "w-full bg-[#FF0000] hover:bg-black text-white px-1 py-1 text-xs font-medium transition-all duration-200 border border-white"
    }
  };

  const config = cardConfig[variant];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          ease: "easeOut"
        }}
        className={`${config.container} ${className}`}
        onClick={handleProductClick}
      >
        {/* Imagen del producto con overlay de lupa */}
        <div className={`${config.image} h-48`}>
          <img
            src={getImageUrl(product.main_image || product.images?.[0])}
            alt={product.name}
            className="w-full h-full object-contain cursor-pointer"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center'
            }}
            onClick={handleImageClick}
            onError={(e) => {
              // Fallback a imagen placeholder si hay error
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          
          {/* Botón de eliminar de wishlist */}
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={handleRemoveClick}
              disabled={isRemoving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                cursor: isRemoving ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: isRemoving ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isRemoving) {
                  e.currentTarget.style.backgroundColor = '#DC2626';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isRemoving) {
                  e.currentTarget.style.backgroundColor = '#EF4444';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
              aria-label="Eliminar de favoritos"
              title="Eliminar de favoritos"
            >
              {isRemoving ? (
                <div style={{
                  width: '16px',
                  height: '16px',
                  animation: 'spin 1s linear infinite',
                  border: '2px solid currentColor',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                }} />
              ) : (
                <svg
                  style={{ width: '16px', height: '16px' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              )}
            </button>
          </div>
          
          {/* Overlay con lupa que aparece en hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30">
            <div className="bg-white bg-opacity-90 rounded-full p-2 transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <svg 
                className="w-6 h-6 text-gray-800" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" 
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Información minimalista */}
        <div className={config.info}>
          {/* Nombre del producto */}
          <div className={config.title}>
            {product.name}
          </div>
          {/* Precio */}
          <div className={config.price}>
            ${Number(product.price).toFixed(2)}
          </div>
        </div>

        {/* Botón minimalista */}
        <div className="p-3 pt-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`${config.button} ${
              product.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : ''
            }`}
          >
            {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
          </motion.button>
        </div>
      </motion.div>
      
      {/* Modal de confirmación para eliminar */}
      <AlertModal
        isOpen={showRemoveModal}
        title="Eliminar de favoritos"
        message={`¿Estás seguro que querés eliminar "${product.name}" de tus favoritos?`}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
      />
      
      {/* Modal de confirmación para agregar al carrito */}
      <AutoCloseAlertModal
        isOpen={showCartAlert}
        title="Producto agregado"
        message="El producto ha sido agregado al carrito exitosamente"
        onClose={() => setShowCartAlert(false)}
      />
    </>
  );
};

export default WishlistProductCard; 