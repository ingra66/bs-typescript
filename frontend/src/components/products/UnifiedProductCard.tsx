import React from 'react';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';
import type { Product } from '../../services/productService';

interface UnifiedProductCardProps {
  product: Product;
  className?: string;
  variant?: 'default' | 'compact';
}

const UnifiedProductCard: React.FC<UnifiedProductCardProps> = ({ 
  product, 
  className = '',
  variant = 'default'
}) => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();

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
    alert('Producto agregado al carrito');
  };

  const handleProductClick = () => {
    navigate(`/product/${product.slug}`);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/product/${product.slug}`);
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
  );
};

export default UnifiedProductCard; 