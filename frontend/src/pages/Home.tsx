import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { CategoryGrid } from '@/components/categories/CategoryGrid';
import { ProductGrid } from '@/components/products/ProductGrid';
import type { Product } from '@/components/products/ProductCard';
import type { Category } from '@/components/categories/CategoryCard';

// Datos de ejemplo para productos
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Smartphone Galaxy S24",
    description: "El último smartphone de Samsung con cámara profesional y batería de larga duración",
    price: 899.99,
    originalPrice: 999.99,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    isWishlisted: false
  },
  {
    id: 2,
    name: "Laptop MacBook Pro",
    description: "Potente laptop para profesionales con chip M2 y pantalla Retina",
    price: 1499.99,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 89,
    inStock: true,
    isWishlisted: true
  },
  {
    id: 3,
    name: "Auriculares Sony WH-1000XM4",
    description: "Auriculares inalámbricos con cancelación de ruido líder en la industria",
    price: 299.99,
    originalPrice: 349.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    rating: 4.6,
    reviewCount: 256,
    inStock: true,
    isWishlisted: false
  },
  {
    id: 4,
    name: "Smartwatch Apple Watch",
    description: "Reloj inteligente con monitor de salud y GPS integrado",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    rating: 4.7,
    reviewCount: 167,
    inStock: false,
    isWishlisted: false
  },
  {
    id: 5,
    name: "Cámara Canon EOS R5",
    description: "Cámara mirrorless profesional con grabación 8K y estabilización avanzada",
    price: 3499.99,
    originalPrice: 3999.99,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 45,
    inStock: true,
    isWishlisted: true
  },
  {
    id: 6,
    name: "Tablet iPad Pro",
    description: "Tablet premium con chip M2 y Apple Pencil para creativos",
    price: 799.99,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
    rating: 4.6,
    reviewCount: 203,
    inStock: true,
    isWishlisted: false
  },
  {
    id: 7,
    name: "Consola PlayStation 5",
    description: "La consola más potente de Sony con gráficos de nueva generación",
    price: 499.99,
    originalPrice: 599.99,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 312,
    inStock: true,
    isWishlisted: false
  },
  {
    id: 8,
    name: "Monitor LG UltraWide",
    description: "Monitor curvo 34 pulgadas con resolución 4K para gaming y productividad",
    price: 699.99,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop",
    rating: 4.5,
    reviewCount: 78,
    inStock: true,
    isWishlisted: true
  }
];

// Datos de ejemplo para categorías
const mockCategories: Category[] = [
  {
    id: 1,
    name: "Smartphones",
    description: "Los mejores smartphones del mercado con tecnología de vanguardia",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    productCount: 45,
    slug: "smartphones"
  },
  {
    id: 2,
    name: "Laptops",
    description: "Computadoras portátiles para trabajo, estudio y gaming",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
    productCount: 32,
    slug: "laptops"
  },
  {
    id: 3,
    name: "Audio",
    description: "Auriculares, altavoces y equipos de audio profesional",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    productCount: 28,
    slug: "audio"
  },
  {
    id: 4,
    name: "Gaming",
    description: "Consolas, accesorios y equipos para gamers",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop",
    productCount: 56,
    slug: "gaming"
  }
];

export const Home: React.FC = () => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = (product: Product) => {
    setCartItemCount(prev => prev + 1);
    console.log('Producto agregado al carrito:', product.name);
  };

  const handleAddToWishlist = (product: Product) => {
    console.log('Producto agregado a favoritos:', product.name);
  };

  const handleProductClick = (product: Product) => {
    console.log('Producto clickeado:', product.name);
  };

  const handleCategoryClick = (category: Category) => {
    console.log('Categoría clickeada:', category.name);
  };

  const handleShopNow = () => {
    console.log('Navegar a productos');
  };

  const handleLearnMore = () => {
    console.log('Navegar a información');
  };

  const handleCartClick = () => {
    console.log('Abrir carrito');
  };

  const handleUserClick = () => {
    console.log('Abrir perfil de usuario');
  };

  return (
    <div className="app">
      <Header />
      <Hero />
      <CategoryGrid />
      
      {/* Productos Destacados */}
      <ProductGrid
        products={mockProducts}
        title="Productos Destacados"
        subtitle="Los productos más populares y mejor valorados por nuestros clientes"
        onProductClick={handleProductClick}
        loading={loading}
      />
      
      {/* Ofertas Especiales */}
      <ProductGrid
        products={mockProducts.filter(p => p.originalPrice)}
        title="Ofertas Especiales"
        subtitle="Aprovecha los descuentos exclusivos en productos seleccionados"
        onProductClick={handleProductClick}
      />
      <Footer />
    </div>
  );
}; 