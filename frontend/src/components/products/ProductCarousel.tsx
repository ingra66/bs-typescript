import React, { useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import type { PanInfo } from "framer-motion";
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
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Crear array de productos duplicados para el loop infinito
  const createInfiniteProducts = () => {
    // Duplicar los productos 3 veces para crear el efecto infinito
    return [...products, ...products, ...products];
  };

  const infiniteProducts = createInfiniteProducts();
  const itemsPerView = 4;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - 1; // Cambio: -1 para mover hacia la derecha
      // Si llegamos al inicio del primer set, saltar al final del segundo
      if (nextIndex < 0) {
        return products.length - 1;
      }
      return nextIndex;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const prevIndexNew = prevIndex + 1; // Cambio: +1 para mover hacia la izquierda
      // Si llegamos al final del primer set, saltar al inicio del segundo
      if (prevIndexNew >= products.length) {
        return 0;
      }
      return prevIndexNew;
    });
  };

  // Manejar el drag
  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 50;

    if (info.offset.x > threshold) {
      // Swipe hacia la derecha - ir al anterior
      prevSlide();
    } else if (info.offset.x < -threshold) {
      // Swipe hacia la izquierda - ir al siguiente
      nextSlide();
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
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
      <div className="max-w-7xl mx-auto relative">
        {title && (
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl font-bold text-center mb-12 text-white"
          >
            {title.toUpperCase()}
          </motion.h2>
        )}
        
        {/* Flecha izquierda - COMPLETAMENTE FUERA */}
        <motion.button
          onClick={prevSlide}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute -left-8 top-1/2 transform -translate-y-1/2 z-20 text-white hover:text-gray-300 transition-all duration-300"
        >
          <img src="/flecha.png" alt="Flecha izquierda" className="w-8 h-8 rotate-180" />
        </motion.button>

        {/* Flecha derecha - COMPLETAMENTE FUERA */}
        <motion.button
          onClick={nextSlide}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute -right-8 top-1/2 transform -translate-y-1/2 z-20 text-white hover:text-gray-300 transition-all duration-300"
        >
          <img src="/flecha.png" alt="Flecha derecha" className="w-8 h-8" />
        </motion.button>
        
        <div className="relative overflow-hidden px-16" ref={containerRef}>
          {/* Contenedor del carrusel con Framer Motion */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            key={`${currentIndex}`}
            initial={{ 
              opacity: 0.8, 
              x: 30 
            }}
            animate={{ 
              opacity: 1, 
              x: 0 
            }}
            transition={{
              duration: 0.6,
              ease: "easeOut"
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{ touchAction: "pan-y" }}
            whileDrag={{ scale: 0.98 }}
          >
            {visibleProducts.map((product, index) => (
              <motion.div 
                key={`${product.id}-${currentIndex}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                style={{ 
                  pointerEvents: isDragging ? "none" : "auto"
                }}
              >
                <UnifiedProductCard
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}; 