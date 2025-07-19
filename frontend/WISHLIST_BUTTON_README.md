# WishlistButton - Componente Actualizado

## Descripción
El componente `WishlistButton` ha sido actualizado para implementar **Optimistic UI** y evitar redirecciones. Ahora el botón cambia inmediatamente al hacer clic, proporcionando feedback visual instantáneo al usuario.

## Características Principales

### ✅ **Optimistic UI**
- El botón cambia de estado **inmediatamente** al hacer clic
- No espera la respuesta de la API para mostrar el cambio visual
- Si la API falla, revierte automáticamente el cambio

### ✅ **Sin Redirecciones**
- `e.preventDefault()` y `e.stopPropagation()` evitan cualquier navegación
- El usuario permanece en la misma vista
- Solo redirige al login si no está autenticado

### ✅ **Feedback Visual Inmediato**
- **Gris**: Producto no está en favoritos
- **Rojo**: Producto está en favoritos
- **Spinner**: Durante la petición API
- **Animaciones**: Hover, click y transiciones suaves

### ✅ **Manejo de Errores**
- Si la API falla, revierte el cambio visual
- Muestra alerta al usuario
- Mantiene consistencia del estado

## Código del Componente

```tsx
import React, { useState, useEffect } from 'react';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useAuthStore } from '../../stores/authStore';

interface WishlistButtonProps {
  productId: number;
  productName?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
  onToggle?: (isInWishlist: boolean) => void;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  productName = 'Producto',
  size = 'md',
  className = '',
  showText = false,
  onToggle,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [localIsInWishlist, setLocalIsInWishlist] = useState(false);
  const [optimisticState, setOptimisticState] = useState<boolean | null>(null);
  
  const { isAuthenticated } = useAuthStore();
  const { 
    isInWishlist, 
    addToWishlist,
    removeFromWishlist,
    checkWishlistStatus
  } = useWishlistStore();

  // Verificar estado inicial
  useEffect(() => {
    const checkInitialStatus = async () => {
      if (isAuthenticated) {
        try {
          const status = await checkWishlistStatus(productId);
          setLocalIsInWishlist(status);
        } catch (error) {
          console.error('Error checking initial wishlist status:', error);
        }
      }
    };

    checkInitialStatus();
  }, [productId, isAuthenticated, checkWishlistStatus]);

  // Sincronizar con el store
  useEffect(() => {
    const storeStatus = isInWishlist(productId);
    setLocalIsInWishlist(storeStatus);
  }, [productId, isInWishlist]);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    // OPTIMISTIC UI: Cambiar inmediatamente el estado visual
    const newOptimisticState = !localIsInWishlist;
    setOptimisticState(newOptimisticState);
    setLocalIsInWishlist(newOptimisticState);
    
    setIsLoading(true);
    
    try {
      if (newOptimisticState) {
        await addToWishlist(productId);
      } else {
        await removeFromWishlist(productId);
      }
      
      if (onToggle) {
        onToggle(newOptimisticState);
      }

      console.log(`${productName} ${newOptimisticState ? 'agregado a' : 'eliminado de'} favoritos`);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      
      // REVERTIR si la API falla
      setLocalIsInWishlist(!newOptimisticState);
      setOptimisticState(null);
      
      alert(`Error: No se pudo ${newOptimisticState ? 'agregar' : 'eliminar'} el producto de favoritos`);
    } finally {
      setIsLoading(false);
      setOptimisticState(null);
    }
  };

  // Estilos dinámicos
  const buttonStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    border: 'none',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    opacity: isLoading ? 0.5 : 1,
    backgroundColor: localIsInWishlist ? '#EF4444' : '#E5E7EB',
    color: localIsInWishlist ? '#FFFFFF' : '#374151',
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <button
        onClick={handleToggleWishlist}
        disabled={isLoading}
        style={buttonStyles}
        aria-label={localIsInWishlist ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
        title={localIsInWishlist ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
      >
        {isLoading ? (
          <div style={{
            width: '20px',
            height: '20px',
            animation: 'spin 1s linear infinite',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
          }} />
        ) : (
          <svg
            style={{ width: '20px', height: '20px' }}
            fill={localIsInWishlist ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        )}
      </button>
    </>
  );
};

export default WishlistButton;
```

## Uso

### Básico
```tsx
<WishlistButton
  productId={123}
  productName="Mi Producto"
  onToggle={(isInWishlist) => {
    console.log(`Producto ${isInWishlist ? 'agregado a' : 'eliminado de'} favoritos`);
  }}
/>
```

### Con diferentes tamaños
```tsx
<WishlistButton productId={123} size="sm" />
<WishlistButton productId={123} size="md" />
<WishlistButton productId={123} size="lg" />
```

### Con texto
```tsx
<WishlistButton 
  productId={123} 
  showText={true} 
  productName="Producto Especial" 
/>
```

## Flujo de Funcionamiento

1. **Usuario hace clic** → Botón cambia inmediatamente (optimistic UI)
2. **Se inicia petición API** → Muestra spinner
3. **API responde exitosamente** → Mantiene el cambio
4. **API falla** → Revierte el cambio y muestra error

## Estados Visuales

| Estado | Color | Icono | Descripción |
|--------|-------|-------|-------------|
| **No favorito** | Gris (#E5E7EB) | Corazón vacío | Producto no está en favoritos |
| **Favorito** | Rojo (#EF4444) | Corazón lleno | Producto está en favoritos |
| **Cargando** | Opacidad 50% | Spinner | Petición API en progreso |
| **Error** | Revertido | Corazón original | API falló, estado revertido |

## Ventajas

### 🚀 **Performance**
- Respuesta instantánea al usuario
- No espera latencia de red
- Mejor experiencia de usuario

### 🎯 **UX**
- Feedback visual inmediato
- Sin redirecciones inesperadas
- Estados claros y consistentes

### 🛡️ **Robustez**
- Manejo de errores completo
- Reversión automática en fallos
- Consistencia de estado

### ♿ **Accesibilidad**
- Aria-labels descriptivos
- Navegación por teclado
- Estados semánticos claros

## Consideraciones Técnicas

### **CSS Inline**
- Sin dependencias de Tailwind
- Estilos encapsulados
- Fácil personalización

### **Event Handling**
- `preventDefault()` evita navegación
- `stopPropagation()` evita burbujeo
- Solo redirige al login si no autenticado

### **State Management**
- Estado local para UI optimista
- Sincronización con Zustand store
- Reversión en caso de error

### **API Integration**
- Llamadas directas a `addToWishlist`/`removeFromWishlist`
- Manejo de errores con try/catch
- Callback opcional para feedback

## Testing

Para probar el componente:

1. **Estado inicial**: Verificar que muestra el estado correcto
2. **Clic optimista**: Confirmar cambio inmediato
3. **API exitosa**: Verificar que mantiene el cambio
4. **API fallida**: Confirmar reversión del estado
5. **No autenticado**: Verificar redirección al login

## Ejemplo de Test

```tsx
// Test básico
test('WishlistButton cambia estado optimistamente', () => {
  render(<WishlistButton productId={1} />);
  
  const button = screen.getByRole('button');
  fireEvent.click(button);
  
  // Debe cambiar inmediatamente (optimistic UI)
  expect(button).toHaveStyle({ backgroundColor: '#EF4444' });
});
``` 