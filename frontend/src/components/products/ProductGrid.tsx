import React from 'react';
import ProductCard from './ProductCard';
import type { Product } from '../../types/product';
import { Card, CardContent } from "../ui/Card";
import { Loader2 } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  loading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  title,
  subtitle,
  loading = false
}) => {
  if (loading) {
    return (
      <section className="w-full py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          {title && (
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {title}
              </h2>
              {subtitle && (
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="animate-pulse bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="w-full h-48 bg-gray-700 rounded-lg mb-4" />
                  <div className="space-y-3">
                    <div className="w-3/4 h-4 bg-gray-700 rounded" />
                    <div className="w-1/2 h-4 bg-gray-700 rounded" />
                    <div className="w-1/3 h-6 bg-gray-700 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        {title && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-red-500"></div>
              <span className="text-red-500 text-sm font-medium uppercase tracking-wider">
                Productos Destacados
              </span>
              <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-red-500"></div>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-400">
              Intenta con otros filtros o vuelve más tarde
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}; 