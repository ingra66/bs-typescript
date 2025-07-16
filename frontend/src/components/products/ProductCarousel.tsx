import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import './ProductCarousel.css';
import { useNavigate } from 'react-router-dom';
// import cartService from '../../services/cartService';
// import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';

export interface ProductCarouselProduct {
  id: number;
  brand?: string;
  name: string;
  price: number | string;
  image: string;
}

interface ProductCarouselProps {
  products: ProductCarouselProduct[];
  title?: string;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 5;

  const navigate = useNavigate();
  // const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + itemsPerView >= products.length ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? Math.max(0, products.length - itemsPerView) : prevIndex - 1));
  };

  // NUEVA FUNCIÓN: agregar al carrito usando el store local
  const handleAddToCart = (product: ProductCarouselProduct) => {
    const item = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      quantity: 1,
      stock: 99 // Opcional, puedes ajustar si tienes stock real
    };
    addItem(item);
    alert('Producto agregado al carrito');
  };

  const visibleProducts = products.slice(currentIndex, currentIndex + itemsPerView);

  return (
    <section className="lux-carousel-section">
      <div className="lux-carousel-container">
        <h2 className="lux-carousel-title">{title}</h2>
        <button
          className="lux-carousel-arrow lux-carousel-arrow-left"
          onClick={prevSlide}
        >
          <ChevronLeft size={22} />
        </button>
        <button
          className="lux-carousel-arrow lux-carousel-arrow-right"
          onClick={nextSlide}
        >
          <ChevronRight size={22} />
        </button>
        <div className="lux-carousel-row">
          {visibleProducts.map((product) => (
            <div
              key={product.id}
              className="lux-product-card"
              style={{ cursor: 'pointer' }}
              onClick={e => {
                // Evita que el click en el botón de carrito navegue
                if ((e.target as HTMLElement).closest('.lux-btn-cart')) return;
                navigate(`/producto/${product.id}`);
              }}
            >
              <div className="lux-product-image">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                />
              </div>
              <div className="lux-product-title">{product.name}</div>
              <div className="lux-product-price">${Number(product.price).toFixed(2)}</div>
              <div className="lux-product-actions">
                <button
                  className="lux-btn-action lux-btn-cart"
                  onClick={e => { e.stopPropagation(); handleAddToCart(product); }}
                  // disabled={loadingId === product.id}
                  title="Agregar al carrito"
                  // style={loadingId === product.id ? { opacity: 0.7, cursor: 'wait' } : {}}
                >
                  <ShoppingCart size={18} style={{ marginRight: 6 }} /> Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 