import React from 'react';
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import type { Product, Category } from '../../services/productService';
import LoadingSpinner from './LoadingSpinner';

export interface GridItem {
  id: number;
  name: string;
  image: string;
  description?: string;
  price?: number;
  slug?: string;
  type: 'category' | 'product';
}

interface ItemGridProps {
  items: GridItem[];
  title?: string;
  subtitle?: string;
  loading?: boolean;
  onItemClick?: (item: GridItem) => void;
  showPrice?: boolean;
  showDescription?: boolean;
  gridCols?: '1' | '2' | '3' | '4' | '5' | '6';
  background?: 'dark' | 'light';
}

export const ItemGrid: React.FC<ItemGridProps> = ({
  items,
  title,
  subtitle,
  loading = false,
  onItemClick,
  showPrice = false,
  showDescription = false,
  gridCols = '4',
  background = 'dark'
}) => {
  const getGridCols = () => {
    const colsMap = {
      '1': 'grid-cols-1',
      '2': 'grid-cols-1 sm:grid-cols-2',
      '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      '5': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
      '6': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
    };
    return colsMap[gridCols];
  };

  const getBackgroundClasses = () => {
    return background === 'dark' 
      ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
      : 'bg-white';
  };

  const getTextColor = () => {
    return background === 'dark' ? 'text-white' : 'text-gray-900';
  };

  const getSubtitleColor = () => {
    return background === 'dark' ? 'text-gray-400' : 'text-gray-600';
  };

  if (loading) {
    return (
      <section className={`w-full py-16 ${getBackgroundClasses()}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center min-h-[40vh]">
          <LoadingSpinner message="Cargando..." size="lg" />
        </div>
      </section>
    );
  }

  return (
    <section className={`w-full py-16 ${getBackgroundClasses()}`}>
      <div className="max-w-7xl mx-auto px-4">
        {title && (
          <div className="text-center mb-12">
            {background === 'dark' && (
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-red-500"></div>
                <span className="text-red-500 text-sm font-medium uppercase tracking-wider">
                  {items[0]?.type === 'category' ? 'Categorías' : 'Productos'}
                </span>
                <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-red-500"></div>
              </div>
            )}
            <h2 className={`text-3xl lg:text-4xl font-bold ${getTextColor()} mb-4`}>
              {title}
            </h2>
            {subtitle && (
              <p className={`text-lg max-w-2xl mx-auto ${getSubtitleColor()}`}>
                {subtitle}
              </p>
            )}
          </div>
        )}
        
        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className={`w-16 h-16 mx-auto mb-6 rounded-full ${
              background === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
            } flex items-center justify-center`}>
              <Loader2 className={`w-8 h-8 ${
                background === 'dark' ? 'text-gray-400' : 'text-gray-600'
              } animate-spin`} />
            </div>
            <h3 className={`text-xl font-semibold ${getTextColor()} mb-2`}>
              No se encontraron {items[0]?.type === 'category' ? 'categorías' : 'productos'}
            </h3>
            <p className={getSubtitleColor()}>
              Intenta con otros filtros o vuelve más tarde
            </p>
          </div>
        ) : (
          <div className={`grid ${getGridCols()} gap-6`}>
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                  delay: index * 0.1
                }}
                className={`relative cursor-pointer group transition-all duration-300 hover:scale-105 rounded-lg overflow-hidden ${
                  background === 'dark' 
                    ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' 
                    : 'bg-white border-gray-200'
                } border hover:shadow-lg`}
                onClick={() => onItemClick?.(item)}
              >
                {/* Imagen */}
                <div className="relative aspect-square">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {item.type === 'product' && showPrice && item.price && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      ${Number(item.price).toFixed(2)}
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-4">
                  <h3 className={`font-semibold mb-2 line-clamp-2 ${
                    background === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.name}
                  </h3>
                  
                  {showDescription && item.description && (
                    <p className={`text-sm line-clamp-2 ${
                      background === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {item.description}
                    </p>
                  )}
                  
                  {item.type === 'product' && showPrice && item.price && (
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-lg font-bold ${
                        background === 'dark' ? 'text-red-400' : 'text-red-600'
                      }`}>
                        ${Number(item.price).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Overlay sutil en hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
                  background === 'dark' ? 'bg-white' : 'bg-black'
                }`}></div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

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

// Helper functions para convertir productos y categorías a GridItem
export const convertProductsToGridItems = (products: Product[]): GridItem[] => {
  return products.map(product => ({
    id: product.id,
    name: product.name,
    image: getImageUrl(product.main_image || product.images?.[0]),
    description: product.description,
    price: Number(product.price),
    type: 'product' as const
  }));
};

export const convertCategoriesToGridItems = (categories: Category[]): GridItem[] => {
  return categories.map(category => ({
    id: category.id,
    name: category.name,
    image: category.image || '/placeholder.svg',
    slug: category.slug,
    type: 'category' as const
  }));
}; 