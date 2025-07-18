import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '@/components/home/Hero';
import { BrandSection } from '@/components/home/BrandSection';
import { CategoryGrid, type CategoryGridCategory } from '@/components/categories/CategoryGrid';
import { ProductCarousel } from '@/components/products/ProductCarousel';
import { ProductFilterCarousel } from '@/components/products/ProductFilterCarousel';
import type { Category } from '@/types/product';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Fetch productos destacados
    fetch('http://localhost:8000/api/v1/products/featured')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setProducts(data.data);
        } else {
          setProducts([]);
        }
      })
      .catch(error => {
        console.error('Error fetching featured products:', error);
        setError('Error cargando productos destacados');
        setProducts([]);
      });
    
    // Fetch categorías
    fetch('http://localhost:8000/api/v1/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setCategories(data.data);
        } else {
          setCategories([]);
        }
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        setError('Error cargando categorías');
        setCategories([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCategoryClick = (category: CategoryGridCategory) => {
    if (category.slug) {
      navigate(`/category/${category.slug}`);
    }
  };

  return (
    <div className="home-content">
      <Hero />
      <BrandSection />
      
      {/* Sección de Categorías */}
      <section className="bg-black py-12 px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <CategoryGrid 
            categories={categories.map(cat => ({
              ...cat,
              image: cat.image ? `http://localhost:8000/storage/${cat.image}` : '/placeholder.svg'
            }))} 
            onCategoryClick={handleCategoryClick} 
            loading={loading} 
          />
        </div>
      </section>

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