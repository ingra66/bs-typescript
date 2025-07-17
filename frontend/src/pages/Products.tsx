import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Grid, List } from 'lucide-react';
import { motion } from "framer-motion";
import { useCartStore } from '../stores/cartStore';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import type { Category, Product } from '../services/productService';
import { ItemGrid, convertProductsToGridItems, type GridItem } from '../components/ui/ItemGrid';
import { CategoryGrid } from '../components/categories/CategoryGrid';
import UnifiedProductCard from '../components/products/UnifiedProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export const Products: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'latest' | 'price-asc' | 'price-desc' | 'name'>('latest');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Cargar categorías
        const categoriesResponse = await categoryService.getCategories();
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data);
        }

        // Si hay categorySlug, cargar productos de esa categoría
        if (categorySlug) {
          const category = categoriesResponse.data.find(cat => cat.slug === categorySlug);
          if (category) {
            setSelectedCategory(category);
            
            // Cargar productos de la categoría
            const productsResponse = await productService.getProducts({ 
              active: true, 
              category_id: category.id 
            });
            if (productsResponse.success) {
              setProducts(productsResponse.data);
            }
          }
        }
        // Si no hay categorySlug, solo cargar categorías (no productos)
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [categorySlug]);

  // Filtrar y ordenar productos
  const filteredAndSortedProducts = products
    .filter(product => {
      if (searchTerm) {
        return product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               product.description.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'latest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const handleCategoryClick = (category: any) => {
    navigate(`/category/${category.slug}`);
  };

  const handleProductClick = (item: GridItem) => {
    if (item.type === 'product') {
      navigate(`/producto/${item.id}`);
    }
  };

  const handleAddToCart = (product: Product) => {
    const item = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.main_image || product.images?.[0] || '/placeholder.svg',
      quantity: 1,
      stock: product.stock
    };
    addItem(item);
    alert('Producto agregado al carrito');
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen py-16 px-4 mt-16 flex items-center justify-center">
        <LoadingSpinner message="Cargando productos..." size="lg" />
      </div>
    );
  }

  // Si no hay categorySlug, mostrar grid de categorías
  if (!categorySlug) {
    return (
      <div className="bg-black min-h-screen">
        {/* Header */}
        <div className="bg-black border-b border-gray-700 py-8 px-4 mt-16">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white text-center">
              NUESTRAS CATEGORÍAS
            </h1>
            <p className="text-gray-300 mt-2 text-center">
              Explora nuestra colección por categorías
            </p>
          </div>
        </div>

        {/* Grid de categorías usando CategoryGrid */}
        <CategoryGrid
          categories={categories}
          loading={loading}
          onCategoryClick={handleCategoryClick}
        />
      </div>
    );
  }

  // Si hay categorySlug, mostrar productos de esa categoría
  return (
    <div className="bg-black min-h-screen">
      {/* Header con controles */}
      <div className="bg-black border-b border-gray-700 py-8 px-4 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Título y breadcrumb */}
            <div>
              <button
                onClick={() => navigate('/products')}
                className="text-red-400 hover:text-red-300 mb-2 text-sm font-medium"
              >
                ← Volver a categorías
              </button>
              <h1 className="text-3xl font-bold text-white">
                {selectedCategory?.name?.toUpperCase() || 'PRODUCTOS'}
              </h1>
              <p className="text-gray-300 mt-2">
                Mostrando {filteredAndSortedProducts.length} producto{filteredAndSortedProducts.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Controles */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-black text-white placeholder-gray-400"
                />
              </div>

              {/* Ordenar */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-black text-white"
              >
                <option value="latest">Más recientes</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="name">Nombre A-Z</option>
              </select>

              {/* Vista */}
              <div className="flex border border-gray-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-black text-gray-300'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-red-600 text-white' : 'bg-black text-gray-300'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de productos */}
      <div className="max-w-7xl mx-auto py-8 px-4">
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-300 mb-4">No se encontraron productos en esta categoría</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Ver todas las categorías
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'list' 
              ? 'grid-cols-1' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}>
            {filteredAndSortedProducts.map((product, index) => (
              <UnifiedProductCard
                key={product.id}
                product={product}
                variant="default"
                className={viewMode === 'list' ? 'flex flex-row' : ''}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 