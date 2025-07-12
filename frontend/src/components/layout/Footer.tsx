import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer style={{ 
      width: '100vw',
      margin: 0,
      position: 'relative',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
      background: '#000',
      color: '#fff',
      textAlign: 'center',
      padding: '40px 0'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ 
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#d90429',
            marginBottom: '10px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            BeltSpot
          </h3>
          <p style={{ 
            color: '#ccc',
            fontSize: '0.9rem',
            marginBottom: '20px'
          }}>
            Handmade meets luxury. Unique accessories for bold personalities.
          </p>
        </div>
        
        <div style={{ 
          borderTop: '1px solid #333',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '30px',
          flexWrap: 'wrap'
        }}>
          <a href="#" style={{ color: '#d90429', textDecoration: 'none', fontSize: '0.9rem' }}>Productos</a>
          <a href="#" style={{ color: '#d90429', textDecoration: 'none', fontSize: '0.9rem' }}>Categorías</a>
          <a href="#" style={{ color: '#d90429', textDecoration: 'none', fontSize: '0.9rem' }}>Ofertas</a>
          <a href="#" style={{ color: '#d90429', textDecoration: 'none', fontSize: '0.9rem' }}>Contacto</a>
          <a href="#" style={{ color: '#d90429', textDecoration: 'none', fontSize: '0.9rem' }}>Ayuda</a>
        </div>
        
        <div style={{ 
          marginTop: '20px',
          color: '#999',
          fontSize: '0.8rem'
        }}>
          © 2024 BeltSpot. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}; 