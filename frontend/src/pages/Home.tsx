import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { CategoryGrid } from '@/components/categories/CategoryGrid';
import { ProductGrid } from '@/components/products/ProductGrid';
import type { Product } from '@/components/products/ProductCard';
import type { Category } from '@/components/categories/CategoryCard';

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

  const handleProductClick = (product: Product) => {
    console.log('Producto clickeado:', product.name);
  };

  const handleCategoryClick = (category: Category) => {
    console.log('Categoría clickeada:', category.name);
  };

  return (
    <div className="app">
      <Header />
      <Hero />
      <CategoryGrid categories={categories} onCategoryClick={handleCategoryClick} loading={loading} />
      <ProductGrid
        products={products}
        title="Productos Destacados"
        subtitle="Los productos más populares y mejor valorados por nuestros clientes"
        onProductClick={handleProductClick}
        loading={loading}
      />
      <Footer />
    </div>
  );
}; 