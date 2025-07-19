import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';
import { motion, AnimatePresence } from "framer-motion";
import type { Product, ProductFilters } from '../../services/productService';
import type { Category } from '../../services/productService';
import UnifiedProductCard from './UnifiedProductCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import AlertModal from '../ui/AlertModal';
import AutoCloseAlertModal from '../ui/AutoCloseAlertModal';
import { Button } from '../ui/Button';

export interface ProductFilterCarouselProduct {
  id: number;
  brand?: string;
  name: string;
  price: number | string;
  image: string;
  category_id: number;
  category_slug?: string;
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
  const [showAlert, setShowAlert] = useState(false);
  const itemsPerView = 4;
  const maxProducts = 20; // Aumentar el número máximo de productos

  const navigate = useNavigate();
  const { addItem } = useCartStore();

  // Cargar categorías y productos
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, productsResponse] = await Promise.all([
          fetch('http://localhost:8000/api/v1/categories').then(res => res.json()),
          fetch('http://localhost:8000/api/v1/products?active=true&per_page=50').then(res => res.json())
        ]);

        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data);
        }

        if (productsResponse.success) {
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

          const formattedProducts = productsResponse.data.slice(0, maxProducts).map((product: Product) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            image: getImageUrl(product.main_image || product.images?.[0]),
            category_id: product.category_id,
            category_slug: product.category?.slug,
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
    setShowAlert(true);
  };

  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  const handleVerMasClick = (categorySlug: string) => {
    navigate(`/category/${categorySlug}`);
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

  // Obtener la categoría seleccionada actual
  const selectedCategoryData = selectedCategory 
    ? categories.find(cat => cat.id === selectedCategory) 
    : null;

  if (loading) {
    return (
      <section className="bg-black py-16 px-4 flex items-center justify-center min-h-[40vh]">
        <LoadingSpinner message="Cargando productos..." size="lg" />
      </section>
    );
  }

  return (
    <section className="bg-black py-16 px-4">
      <style>
        {`
          .category-button {
            background: transparent;
            border: 1px solid white;
            color: white;
            transition: all 0.2s ease;
          }
          .category-button:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: #FF0000;
          }
          .category-button.active {
            background: #FF0000;
            border-color: #FF0000;
            color: white;
          }
        `}
      </style>
      <div className="max-w-7xl mx-auto">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            {title.toUpperCase()}
          </h2>
        )}
        
        <div className="flex gap-8 items-stretch">
          {/* Sidebar con categorías */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-black rounded-lg p-4 h-full flex flex-col justify-center">
              <h3 className="text-lg font-bold text-white mb-3">Categorías</h3>
              
              {/* Categorías dinámicas del backend */}
              <div className="space-y-1">
                <Button
                  onClick={() => handleCategoryClick(null)}
                  variant={selectedCategory === null ? "primary" : "secondary"}
                  size="sm"
                  text="TODOS"
                  fullWidth
                  className="justify-start rounded-none text-sm"
                />
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    variant={selectedCategory === category.id ? "primary" : "secondary"}
                    size="sm"
                    text={category.name.toUpperCase()}
                    fullWidth
                    className="justify-start rounded-none text-sm"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Grid de productos */}
          <div className="flex-1 bg-black p-4">
            {filteredProducts.length === 0 ? (
              <div className="text-center text-white py-16">
                <p className="text-xl">No se encontraron productos en esta categoría</p>
                <Button
                  onClick={() => handleCategoryClick(null)}
                  variant="primary"
                  size="md"
                  text="Ver todos los productos"
                  className="mt-4"
                />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header con título de categoría y botón Ver más */}
                {selectedCategoryData && (
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">
                      {selectedCategoryData.name.toUpperCase()}
                    </h3>
                    <Button
                      onClick={() => handleVerMasClick(selectedCategoryData.slug)}
                      variant="primary"
                      size="sm"
                      text="VER MÁS"
                      className="px-6"
                    />
                  </div>
                )}

                {/* Grid de productos */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts.map((product, index) => (
                    <UnifiedProductCard
                      key={`${product.id}-${index}`}
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
                </div>

                {/* Botón Ver más para categoría específica */}
                {selectedCategoryData && filteredProducts.length > 0 && (
                  <div className="text-center mt-6">
                    <Button
                      onClick={() => handleVerMasClick(selectedCategoryData.slug)}
                      variant="primary"
                      size="md"
                      text={`VER TODOS LOS PRODUCTOS DE ${selectedCategoryData.name.toUpperCase()}`}
                      className="px-8 py-3"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <AutoCloseAlertModal
        isOpen={showAlert}
        title="Producto agregado"
        message="El producto ha sido agregado al carrito exitosamente"
        onClose={() => setShowAlert(false)}
      />
    </section>
  );
}; 