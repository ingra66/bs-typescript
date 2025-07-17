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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const item = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.main_image || product.images?.[0] || '/placeholder.svg',
      quantity: 1,
      stock: product.stock
    };
    addItem(item);
    alert('Producto agregado al carrito');
  };

  const handleProductClick = () => {
    navigate(`/producto/${product.id}`);
  };

  // Configuración según variante
  const cardConfig = {
    default: {
      container: "bg-transparent transition-all duration-300 cursor-pointer group aspect-square flex flex-col",
      image: "flex-1 flex items-center justify-center p-2",
      info: "p-3 text-center",
      title: "text-xs text-gray-300 mb-1 line-clamp-2",
      price: "text-sm font-bold text-white",
      button: "w-full bg-[#FF0000] hover:bg-black text-white px-2 py-1 text-xs font-medium transition-all duration-200 border border-white"
    },
    compact: {
      container: "bg-transparent transition-all duration-300 cursor-pointer group aspect-square flex flex-col",
      image: "flex-1 flex items-center justify-center p-1",
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
      {/* Imagen del producto */}
      <div className={config.image}>
        <img
          src={product.main_image || product.images?.[0] || '/placeholder.svg'}
          alt={product.name}
          className="w-full h-full object-contain"
        />
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