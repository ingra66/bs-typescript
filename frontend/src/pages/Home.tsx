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
        products={products.map(p => ({
          ...p,
          brand: (p as any).brand || '',
          name: p.name,
          price: p.price,
          image: (p as any).image || '/placeholder.svg',
        }))}
        title="Productos Destacados"
      />
      {/* Nuevo componente con filtros por categorías */}
      <ProductFilterCarousel title="Explora Nuestros Productos" />
    </div>
  );
}; 