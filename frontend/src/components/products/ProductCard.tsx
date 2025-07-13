import React from 'react';
import './ProductCard.css';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isWishlisted?: boolean;
}

interface ProductCardProps {
  product: Product;
  onProductClick?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onProductClick
}) => {
  return (
    <div className="product-card" onClick={() => onProductClick?.(product)}>
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
      />
      <div className="product-info">
        <div style={{ fontSize: '0.85rem', color: '#bbb', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600, marginBottom: 2 }}>
          B.B.Simon
        </div>
        <div className="product-title">
          {product.name}
        </div>
        <div className="product-price">
          ${Number(product.price).toFixed(2)}
        </div>
      </div>
    </div>
  );
}; 