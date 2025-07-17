import React from 'react';
import UnifiedProductCard from './UnifiedProductCard';
import type { Product } from '../../services/productService';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  loading?: boolean;
  onProductClick?: (product: Product) => void;
  background?: 'dark' | 'light';
  gridCols?: '1' | '2' | '3' | '4' | '5' | '6';
  showPrice?: boolean;
  showDescription?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  title,
  subtitle,
  loading = false,
  onProductClick,
  background = 'dark',
  gridCols = '4',
  showPrice = true,
  showDescription = true
}) => {
  const getGridColsClass = () => {
    switch (gridCols) {
      case '1': return 'grid-cols-1';
      case '2': return 'grid-cols-1 md:grid-cols-2';
      case '3': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case '4': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      case '5': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5';
      case '6': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  };

  if (loading) {
    return (
      <section className="py-8 bg-black mt-16 flex items-center justify-center min-h-[40vh]">
        <LoadingSpinner message="Cargando productos..." size="lg" />
      </section>
    );
  }

  return (
    <section className="py-8 bg-black mt-16">
      <div className="max-w-7xl mx-auto px-4">
        {title && (
          <h2 className="text-2xl font-bold mb-6 text-white">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-lg mb-6 text-gray-300">
            {subtitle}
          </p>
        )}
        
        <div className={`grid gap-6 ${getGridColsClass()}`}>
          {products.map((product) => (
            <UnifiedProductCard
              key={product.id}
              product={product}
              variant="default"
              className={onProductClick ? 'cursor-pointer' : ''}
            />
          ))}
        </div>
      </div>
    </section>
  );
}; 