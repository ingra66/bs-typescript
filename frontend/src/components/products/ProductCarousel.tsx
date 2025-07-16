import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';
import { motion, AnimatePresence } from "framer-motion";

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

  const navigate = useNavigate();
  const { addItem } = useCartStore();

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1 >= products.length ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? products.length - 1 : prevIndex - 1));
  };

  const handleAddToCart = (product: ProductCarouselProduct) => {
    const item = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      quantity: 1,
      stock: 99
    };
    addItem(item);
    alert('Producto agregado al carrito');
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
            {title}
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
              <motion.div
                key={`${product.id}-${currentIndex}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                  delay: index * 0.1
                }}
                className="bg-transparent transition-all duration-300 cursor-pointer group aspect-square flex flex-col"
                onClick={() => navigate(`/producto/${product.id}`)}
              >
                {/* Imagen del producto */}
                <div className="flex-1 flex items-center justify-center p-2">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Información minimalista */}
                <div className="p-3 text-center">
                  {/* Nombre del producto */}
                  <div className="text-xs text-gray-300 mb-1 line-clamp-2">
                    {product.name}
                  </div>
                  {/* Precio */}
                  <div className="text-sm font-bold text-white">
                    ${Number(product.price).toFixed(2)}
                  </div>
                </div>

                {/* Botón minimalista como el Hero */}
                <div className="p-3 pt-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className="w-full bg-[#FF0000] hover:bg-black text-white px-2 py-1 text-xs font-medium transition-all duration-200 border border-white"
                  >
                    Agregar al carrito
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}; 