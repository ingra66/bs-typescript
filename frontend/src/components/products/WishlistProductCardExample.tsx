import React from 'react';
import WishlistProductCard from './WishlistProductCard';
import type { Product } from '../../services/productService';

const WishlistProductCardExample: React.FC = () => {
  // Producto de ejemplo
  const exampleProduct: Product = {
    id: 1,
    category_id: 1,
    name: "Producto de Ejemplo",
    slug: "producto-ejemplo",
    description: "Este es un producto de ejemplo para mostrar el componente WishlistProductCard",
    price: 99.99,
    compare_price: 129.99,
    stock: 10,
    sku: "PROD-001",
    images: ["https://via.placeholder.com/300x300"],
    is_active: true,
    is_featured: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    category: {
      id: 1,
      name: "Categoría Ejemplo",
      slug: "categoria-ejemplo",
      is_active: true
    },
    main_image: "https://via.placeholder.com/300x300",
    discount_percentage: 23,
    average_rating: 4.5,
    reviews_count: 12
  };

  const handleProductRemoved = () => {
    console.log('Producto eliminado de favoritos');
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#1f2937', minHeight: '100vh' }}>
      <h2 style={{ color: '#ffffff', marginBottom: '20px' }}>Ejemplo de WishlistProductCard</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Ejemplo 1: Card por defecto */}
        <div>
          <h3 style={{ color: '#ffffff', marginBottom: '10px' }}>Card por defecto</h3>
          <div style={{ maxWidth: '300px' }}>
            <WishlistProductCard
              product={exampleProduct}
              onRemove={handleProductRemoved}
            />
          </div>
        </div>

        {/* Ejemplo 2: Card compacta */}
        <div>
          <h3 style={{ color: '#ffffff', marginBottom: '10px' }}>Card compacta</h3>
          <div style={{ maxWidth: '250px' }}>
            <WishlistProductCard
              product={exampleProduct}
              variant="compact"
              onRemove={handleProductRemoved}
            />
          </div>
        </div>

        {/* Ejemplo 3: Múltiples cards */}
        <div>
          <h3 style={{ color: '#ffffff', marginBottom: '10px' }}>Múltiples cards</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px',
            maxWidth: '800px'
          }}>
            {[1, 2, 3].map((id) => (
              <WishlistProductCard
                key={id}
                product={{
                  ...exampleProduct,
                  id: id,
                  name: `Producto ${id}`,
                  slug: `producto-${id}`,
                  price: 99.99 + (id * 10),
                }}
                onRemove={handleProductRemoved}
              />
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#374151', borderRadius: '8px' }}>
        <h4 style={{ color: '#ffffff', marginBottom: '10px' }}>Características del componente:</h4>
        <ul style={{ color: '#d1d5db', fontSize: '14px', lineHeight: '1.6' }}>
          <li>✅ <strong>Reutiliza estructura:</strong> Basado en UnifiedProductCard</li>
          <li>✅ <strong>Botón de eliminar:</strong> Icono de basurero en lugar de wishlist</li>
          <li>✅ <strong>Modal de confirmación:</strong> AlertModal antes de eliminar</li>
          <li>✅ <strong>Estados de carga:</strong> Spinner durante eliminación</li>
          <li>✅ <strong>Navegación:</strong> Click en imagen/card va al producto</li>
          <li>✅ <strong>Agregar al carrito:</strong> Mantiene funcionalidad original</li>
          <li>✅ <strong>Callback de eliminación:</strong> Notifica cuando se elimina</li>
          <li>✅ <strong>Estilos consistentes:</strong> Mismo diseño que otras cards</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#7f1d1d', borderRadius: '8px' }}>
        <h4 style={{ color: '#ffffff', marginBottom: '10px' }}>Flujo de eliminación:</h4>
        <ol style={{ color: '#fecaca', fontSize: '14px', lineHeight: '1.6' }}>
          <li>Usuario hace click en el botón de eliminar (basurero)</li>
          <li>Se abre AlertModal con confirmación</li>
          <li>Si confirma: se llama al endpoint y se actualiza la vista</li>
          <li>Si cancela: se cierra el modal sin cambios</li>
          <li>Durante el proceso: se muestra spinner en el botón</li>
        </ol>
      </div>
    </div>
  );
};

export default WishlistProductCardExample; 