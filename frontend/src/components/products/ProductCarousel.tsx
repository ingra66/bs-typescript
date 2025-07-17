import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import UnifiedProductCard from './UnifiedProductCard';
import type { Product } from '../../services/productService';

export interface ProductCarouselProduct {
  id: number;
  brand?: string;
  name: string;
  price: number | string;
  image: string;
}

interface ProductCarouselProps {
  products: ProductCarouselProduct[];
  title?: string;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 4;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1 >= products.length ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? products.length - 1 : prevIndex - 1));
  };

  // Crear array de productos visibles
  const getVisibleProducts = () => {
    const visibleProducts = [];
    for (let i = 0; i < itemsPerView; i++) {
      const index = (currentIndex + i) % products.length;
      if (products[index]) {
        visibleProducts.push({
          ...products[index],
          originalIndex: index
        });
      }
    }
    return visibleProducts;
  };

  const visibleProducts = getVisibleProducts();

  return (
    <section className="bg-black py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            {title.toUpperCase()}
          </h2>
        )}
        
        <div className="relative overflow-hidden">
          {/* Flecha izquierda */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft size={32} />
          </button>

          {/* Flecha derecha */}
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-all duration-200 hover:scale-110"
          >
            <ChevronRight size={32} />
          </button>

          {/* Contenedor del grid con animación suave */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-16"
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{
              duration: 0.4,
              ease: "easeInOut"
            }}
          >
            {visibleProducts.map((product, index) => (
              <UnifiedProductCard
                key={`${product.id}-${currentIndex}-${index}`}
                product={{
                  id: product.id,
                  name: product.name,
                  price: Number(product.price),
                  main_image: product.image,
                  stock: 99,
                  description: '',
                  category_id: 0,
                  sku: '',
                  slug: product.name.toLowerCase().replace(/\s+/g, '-'),
                  is_active: true,
                  is_featured: false,
                  created_at: '',
                  updated_at: '',
                  images: []
                }}
                variant="default"
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}; 