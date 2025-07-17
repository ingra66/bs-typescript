import React, { useState, useEffect } from 'react';
import { Hero } from '@/components/home/Hero';
import { BrandSection } from '@/components/home/BrandSection';
import { CategoryGrid } from '@/components/categories/CategoryGrid';
import { ProductCarousel } from '@/components/products/ProductCarousel';
import { ProductFilterCarousel } from '@/components/products/ProductFilterCarousel';
import type { Product } from '@/types/product';
import type { Category } from '@/types/product';

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch productos destacados
    fetch('/api/v1/products/featured')
      .then(res => res.json())
      .then(data => {
        setProducts(data.data || []);
      })
      .catch(() => setProducts([]));
    // Fetch categorías de navegación
    fetch('/api/v1/categories/navigation')
      .then(res => res.json())
      .then(data => {
        setCategories(data.data || []);
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  const handleCategoryClick = (category: Category) => {
    console.log('Categoría clickeada:', category.name);
  };

  return (
    <div className="home-content">
      <Hero />
      <BrandSection />
      <CategoryGrid categories={categories as any} onCategoryClick={handleCategoryClick as any} loading={loading} />
      <ProductCarousel
        products={products.map(p => {
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

          return {
          ...p,
          brand: (p as any).brand || '',
          name: p.name,
          price: p.price,
            image: getImageUrl((p as any).main_image || (p as any).images?.[0]),
          };
        })}
        title="Productos Destacados"
      />
      {/* Nuevo componente con filtros por categorías */}
      <ProductFilterCarousel title="Explora Nuestros Productos" />
    </div>
  );
}; 