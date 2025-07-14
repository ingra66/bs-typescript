import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import type { Product } from '../../types/product';
import { useCartStore } from '../../stores/cartStore';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, getItemQuantity, items } = useCartStore();

  const handleAddToCart = () => {
    console.log('=== ProductCard: BOTÓN PRESIONADO ===');
    console.log('=== ProductCard: Add to Cart INICIO ===');
    console.log('ProductCard: Items actuales en el hook:', items);
    
    const testItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      stock: product.stock
    };
    console.log('ProductCard: Test item a agregar:', testItem);
    
    addItem(testItem);
    
    console.log('ProductCard: Test item agregado');
    console.log('ProductCard: Items después de agregar:', items);
    console.log('=== ProductCard: Add to Cart FIN ===');
  };

  // Obtener cantidad actual
  const currentQuantity = getItemQuantity(product.id);
  const isInCart = currentQuantity > 0;

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Imagen del producto */}
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {/* Badge de stock */}
        {product.stock === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Sin stock
          </div>
        )}
        
        {/* Botón de favoritos */}
        <button className="absolute top-2 left-2 p-2 bg-gray-900 bg-opacity-50 hover:bg-opacity-75 rounded-full transition-all duration-200">
          <Heart size={16} className="text-white" />
        </button>
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Categoría y rating */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm">Categoría</span>
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span className="text-gray-400 text-sm">4.5</span>
          </div>
        </div>

        {/* Nombre del producto */}
        <Link to={`/product/${product.id}`}>
          <h3 className="text-white font-semibold text-lg mb-2 hover:text-green-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Descripción */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Precio y stock */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-green-400 text-xl font-bold">
            ${Number(product.price).toFixed(2)}
          </span>
          <span className="text-gray-400 text-sm">
            Stock: {product.stock}
          </span>
        </div>

        {/* Botón agregar al carrito - AHORA USANDO EL HOOK CORRECTAMENTE */}
        <button 
          onClick={() => {
            console.log('=== BOTÓN SIMPLE PRESIONADO ===');
            handleAddToCart();
          }}
          disabled={product.stock === 0}
          className={`
            w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 mb-2
            ${isInCart 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
            ${product.stock === 0 ? 'bg-gray-500 cursor-not-allowed' : ''}
          `}
        >
          <ShoppingCart size={16} />
          {product.stock === 0 ? 'Sin stock' : isInCart ? `En carrito (${currentQuantity})` : 'Agregar al carrito'}
        </button>
        
        {/* Botón de prueba completamente simple */}
        <button 
          onClick={() => {
            alert('Botón presionado!');
            console.log('=== BOTÓN DE PRUEBA PRESIONADO ===');
          }}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 mb-2"
        >
          BOTÓN DE PRUEBA (debería mostrar alert)
        </button>
      </div>
    </div>
  );
};

export default ProductCard; 