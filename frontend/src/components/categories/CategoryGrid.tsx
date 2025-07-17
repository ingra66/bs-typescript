import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";

export interface CategoryGridCategory {
  id: number;
  name?: string; // Para compatibilidad con backend
  title?: string; // Para compatibilidad con mock
  subtitle?: string;
  image?: string | null;
  backgroundColor?: "black" | "light";
  productCount?: number;
  slug?: string;
  description?: string;
}

interface CategoryGridProps {
  categories: CategoryGridCategory[];
  loading?: boolean;
  onCategoryClick?: (category: CategoryGridCategory) => void;
}

const PLACEHOLDER_IMAGE = "/placeholder.svg";

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  loading = false,
  onCategoryClick
}) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: CategoryGridCategory) => {
    if (onCategoryClick) {
      onCategoryClick(category);
    } else {
      // Navegar a la página de productos con filtro por categoría
      navigate(`/category/${category.slug}`);
    }
  };

  if (loading) {
    return (
      <section className="bg-black py-8 px-4 mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-gray-300">Cargando categorías...</div>
        </div>
      </section>
    );
  }
  
  if (!categories || categories.length === 0) {
    return (
      <section className="bg-black py-8 px-4 mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-gray-300">No hay categorías para mostrar</div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-black py-8 px-4 mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(0, 6).map((category, index) => {
            const isBlackBackground = index % 2 === 0; // Alternar fondos
            
            return (
              <motion.div
                key={category.id}
                initial={{ scale: 0.7, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: "easeOut"
                }}
                className={`relative cursor-pointer group rounded-2xl overflow-hidden ${
                  isBlackBackground ? 'bg-black' : 'bg-white'
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {/* Imagen de la categoría */}
                <div className="relative h-64 flex items-center justify-center p-6">
                  <img
                    src={category.image || PLACEHOLDER_IMAGE}
                    alt={category.name || category.title || ''}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                
                {/* Texto de la categoría */}
                <div className={`absolute bottom-0 left-0 right-0 p-6 text-center ${
                  isBlackBackground ? 'text-white' : 'text-black'
                }`}>
                  <h3 className="text-2xl font-bold uppercase tracking-wide">
                    {category.name || category.title}
                  </h3>
                  {category.subtitle && (
                    <p className="text-sm mt-1 opacity-80">
                      {category.subtitle}
                    </p>
                  )}
                </div>
                
                {/* Overlay sutil en hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
                  isBlackBackground ? 'bg-white' : 'bg-black'
                }`}></div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}; 