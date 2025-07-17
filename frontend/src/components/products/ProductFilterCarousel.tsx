import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';
import { motion, AnimatePresence } from "framer-motion";
import productService, { type Product, type ProductFilters } from '../../services/productService';
import categoryService from '../../services/categoryService';
import type { Category } from '../../services/productService';
import UnifiedProductCard from './UnifiedProductCard';
import LoadingSpinner from '../ui/LoadingSpinner';

export interface ProductFilterCarouselProduct {
  id: number;
  brand?: string;
  name: string;
  price: number | string;
  image: string;
  category_id: number;
}

interface ProductFilterCarouselProps {
  title?: string;
}

export const ProductFilterCarousel: React.FC<ProductFilterCarouselProps> = ({ title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState<ProductFilterCarouselProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<ProductFilterCarouselProduct[]>([]);
  const itemsPerView = 4;

  const navigate = useNavigate();
  const { addItem } = useCartStore();

  // Cargar categorías y productos
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, productsResponse] = await Promise.all([
          categoryService.getCategories(),
          productService.getProducts({ active: true })
        ]);

        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data);
        }

        if (productsResponse.success) {
          const formattedProducts = productsResponse.data.map((product: Product) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.main_image || product.images?.[0] || '/placeholder.svg',
            category_id: product.category_id,
            brand: product.category?.name
          }));
          setProducts(formattedProducts);
          setFilteredProducts(formattedProducts);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtrar productos cuando cambia la categoría seleccionada
  useEffect(() => {
    if (selectedCategory === null) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => product.category_id === selectedCategory);
      setFilteredProducts(filtered);
    }
    setCurrentIndex(0); // Resetear el índice del carrusel
  }, [selectedCategory, products]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1 >= filteredProducts.length ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? filteredProducts.length - 1 : prevIndex - 1));
  };

  const handleAddToCart = (product: ProductFilterCarouselProduct) => {
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

  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  // Crear array de productos visibles
  const getVisibleProducts = () => {
    if (filteredProducts.length === 0) return [];
    
    const visibleProducts = [];
    for (let i = 0; i < itemsPerView; i++) {
      const index = (currentIndex + i) % filteredProducts.length;
      if (filteredProducts[index]) {
        visibleProducts.push({
          ...filteredProducts[index],
          originalIndex: index
        });
      }
    }
    return visibleProducts;
  };

  const visibleProducts = getVisibleProducts();

  if (loading) {
    return (
      <section className="bg-black py-16 px-4 flex items-center justify-center min-h-[40vh]">
        <LoadingSpinner message="Cargando productos..." size="lg" />
      </section>
    );
  }

  return (
    <section className="bg-black py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            {title.toUpperCase()}
          </h2>
        )}
        
        <div className="flex gap-8">
          {/* Sidebar con categorías */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Categorías</h3>
              
              {/* Botón "Todos" */}
              <button
                onClick={() => handleCategoryClick(null)}
                className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                  selectedCategory === null
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Todos los productos
              </button>
              
              {/* Lista de categorías */}
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              
              {/* Contador de productos */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Carrusel de productos */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center text-white py-16">
                <p className="text-xl">No se encontraron productos en esta categoría</p>
                <button
                  onClick={() => handleCategoryClick(null)}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  Ver todos los productos
                </button>
              </div>
            ) : (
              <div className="relative overflow-hidden">
                {/* Flecha izquierda */}
                {filteredProducts.length > itemsPerView && (
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-all duration-200 hover:scale-110"
                  >
                    <ChevronLeft size={32} />
                  </button>
                )}

                {/* Flecha derecha */}
                {filteredProducts.length > itemsPerView && (
                  <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-all duration-200 hover:scale-110"
                  >
                    <ChevronRight size={32} />
                  </button>
                )}

                {/* Contenedor del grid con animación suave */}
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-16"
                  key={`${selectedCategory}-${currentIndex}`}
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
                        category_id: product.category_id,
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
}; 