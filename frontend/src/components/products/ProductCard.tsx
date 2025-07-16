import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart, Eye, Plus } from 'lucide-react';
import type { Product } from '../../types/product';
import { useCartStore } from '../../stores/cartStore';
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";

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
    <Card className="group bg-gray-800/50 border-gray-700/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      {/* Imagen del producto */}
      <div className="relative overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
        
        {/* Overlay con botones */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30">
            <Eye size={16} className="text-white" />
          </Button>
          <Button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30">
            <Heart size={16} className="text-white" />
          </Button>
        </div>
        
        {/* Badge de stock */}
        <div className="absolute top-3 right-3">
          {product.stock === 0 ? (
            <span className="inline-block bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
              Sin stock
            </span>
          ) : (
            <span className="inline-block bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
              Stock: {product.stock}
            </span>
          )}
        </div>
      </div>
      
      {/* Contenido */}
      <CardContent className="p-6">
        {/* Categoría y rating */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-400 text-sm font-medium">Categoría</span>
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span className="text-gray-300 text-sm font-medium">4.5</span>
          </div>
        </div>
        
        {/* Nombre del producto */}
        <Link to={`/product/${product.id}`}>
          <h3 className="text-white font-bold text-lg mb-2 hover:text-green-400 transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        {/* Descripción */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        
        {/* Precio */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-green-400 text-2xl font-bold">
            ${Number(product.price).toFixed(2)}
          </span>
        </div>
        
        {/* Botón agregar al carrito */}
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all duration-200 ${
            product.stock === 0 
              ? 'bg-gray-600 cursor-not-allowed' 
              : isInCart 
                ? 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
          }`}
        >
          {product.stock === 0 ? (
            <>
              <ShoppingCart size={16} />
              Sin stock
            </>
          ) : isInCart ? (
            <>
              <ShoppingCart size={16} />
              En carrito ({currentQuantity})
            </>
          ) : (
            <>
              <Plus size={16} />
              Agregar al carrito
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard; 