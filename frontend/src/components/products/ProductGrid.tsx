import React from 'react';
import ProductCard from './ProductCard';
import type { Product } from '../../types/product';

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  loading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  title,
  subtitle,
  loading = false
}) => {
  if (loading) {
    return (
      <section style={{ 
        width: '100vw',
        margin: 0,
        padding: '60px 0',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        background: '#111'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
          {title && (
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '2rem', color: '#d90429', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</h2>
              {subtitle && (
                <p style={{ color: '#fff', fontSize: '1rem', marginTop: '10px' }}>{subtitle}</p>
              )}
            </div>
          )}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '32px'
          }}>
            {[...Array(8)].map((_, index) => (
              <div key={index} style={{ 
                aspectRatio: '1',
                background: '#181818',
                opacity: 0.5,
                display: 'flex',
                flexDirection: 'column',
                border: '2px solid transparent'
              }} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ 
      width: '100vw',
      margin: 0,
      padding: '60px 0',
      position: 'relative',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
      background: '#111'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        {title && (
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2rem', color: '#d90429', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</h2>
            {subtitle && (
              <p style={{ color: '#fff', fontSize: '1rem', marginTop: '10px' }}>{subtitle}</p>
            )}
          </div>
        )}
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <div style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '10px' }}>No se encontraron productos</div>
            <p style={{ color: '#999' }}>Intenta con otros filtros o vuelve más tarde</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '32px'
          }}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}; 