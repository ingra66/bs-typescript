import React from 'react';
import WishlistButton from './WishlistButton';

const WishlistButtonExample: React.FC = () => {
  const handleToggle = (isInWishlist: boolean) => {
    console.log(`Producto ${isInWishlist ? 'agregado a' : 'eliminado de'} favoritos`);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#1f2937', minHeight: '100vh' }}>
      <h2 style={{ color: '#ffffff', marginBottom: '20px' }}>Ejemplos de WishlistButton</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Ejemplo 1: Botón pequeño */}
        <div>
          <h3 style={{ color: '#ffffff', marginBottom: '10px' }}>Botón pequeño (sm)</h3>
          <WishlistButton
            productId={1}
            productName="Producto de ejemplo"
            size="sm"
            onToggle={handleToggle}
          />
        </div>

        {/* Ejemplo 2: Botón mediano */}
        <div>
          <h3 style={{ color: '#ffffff', marginBottom: '10px' }}>Botón mediano (md)</h3>
          <WishlistButton
            productId={2}
            productName="Producto de ejemplo"
            size="md"
            onToggle={handleToggle}
          />
        </div>

        {/* Ejemplo 3: Botón grande */}
        <div>
          <h3 style={{ color: '#ffffff', marginBottom: '10px' }}>Botón grande (lg)</h3>
          <WishlistButton
            productId={3}
            productName="Producto de ejemplo"
            size="lg"
            onToggle={handleToggle}
          />
        </div>

        {/* Ejemplo 4: Con texto */}
        <div>
          <h3 style={{ color: '#ffffff', marginBottom: '10px' }}>Con texto</h3>
          <WishlistButton
            productId={4}
            productName="Producto de ejemplo"
            size="md"
            showText={true}
            onToggle={handleToggle}
          />
        </div>

        {/* Ejemplo 5: Múltiples botones */}
        <div>
          <h3 style={{ color: '#ffffff', marginBottom: '10px' }}>Múltiples botones</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[5, 6, 7, 8, 9].map((id) => (
              <WishlistButton
                key={id}
                productId={id}
                productName={`Producto ${id}`}
                size="sm"
                onToggle={handleToggle}
              />
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#374151', borderRadius: '8px' }}>
        <h4 style={{ color: '#ffffff', marginBottom: '10px' }}>Características implementadas:</h4>
        <ul style={{ color: '#d1d5db', fontSize: '14px', lineHeight: '1.6' }}>
          <li>✅ <strong>Optimistic UI:</strong> El botón cambia inmediatamente al hacer clic</li>
          <li>✅ <strong>Sin redirecciones:</strong> El usuario se queda en la misma página</li>
          <li>✅ <strong>Feedback visual:</strong> Colores rojo (favorito) y gris (no favorito)</li>
          <li>✅ <strong>Estados de carga:</strong> Spinner durante la petición API</li>
          <li>✅ <strong>Manejo de errores:</strong> Revertir cambios si la API falla</li>
          <li>✅ <strong>Animaciones:</strong> Hover, click y transiciones suaves</li>
          <li>✅ <strong>Accesibilidad:</strong> Aria-labels y navegación por teclado</li>
          <li>✅ <strong>CSS inline:</strong> Sin dependencias de Tailwind</li>
        </ul>
      </div>
    </div>
  );
};

export default WishlistButtonExample; 