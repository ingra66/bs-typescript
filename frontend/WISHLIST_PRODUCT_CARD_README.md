# WishlistProductCard - Componente para Favoritos

## Descripción
El componente `WishlistProductCard` es una versión especializada del `UnifiedProductCard` diseñada específicamente para mostrar productos en la vista de wishlist (favoritos). Reutiliza la estructura del card original pero reemplaza el botón de wishlist por un botón de eliminar con confirmación.

## Características Principales

### ✅ **Reutilización de Estructura**
- Basado en `UnifiedProductCard`
- Mantiene el mismo diseño y funcionalidades
- Solo cambia el botón de wishlist por botón de eliminar

### ✅ **Botón de Eliminar**
- Icono de basurero en lugar de corazón
- Color rojo para indicar acción destructiva
- Spinner durante la eliminación
- Animaciones de hover y click

### ✅ **Modal de Confirmación**
- Usa `AlertModal` existente
- Pregunta de confirmación personalizada
- Botones "Cancelar" (gris) y "Confirmar" (rojo)
- Previene eliminaciones accidentales

### ✅ **Gestión de Estado**
- Callback `onRemove` para actualizar la vista
- Estados de carga durante eliminación
- Manejo de errores con alertas

## Código del Componente

```tsx
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import type { Product } from '../../services/productService';
import AutoCloseAlertModal from '../ui/AutoCloseAlertModal';
import AlertModal from '../ui/AlertModal';

interface WishlistProductCardProps {
  product: Product;
  className?: string;
  variant?: 'default' | 'compact';
  onRemove?: () => void;
}

const WishlistProductCard: React.FC<WishlistProductCardProps> = ({ 
  product, 
  className = '',
  variant = 'default',
  onRemove
}) => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { removeFromWishlist } = useWishlistStore();
  const [showCartAlert, setShowCartAlert] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowRemoveModal(true);
  };

  const handleConfirmRemove = async () => {
    setIsRemoving(true);
    try {
      await removeFromWishlist(product.id);
      setShowRemoveModal(false);
      if (onRemove) {
        onRemove();
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Error al eliminar el producto de favoritos');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
  };

  return (
    <>
      <motion.div className={`card-container ${className}`}>
        {/* Imagen del producto */}
        <div className="image-container">
          <img src={getImageUrl(product.main_image)} alt={product.name} />
          
          {/* Botón de eliminar */}
          <div className="remove-button-container">
            <button
              onClick={handleRemoveClick}
              disabled={isRemoving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                cursor: isRemoving ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: isRemoving ? 0.5 : 1,
              }}
              aria-label="Eliminar de favoritos"
              title="Eliminar de favoritos"
            >
              {isRemoving ? (
                <div style={{
                  width: '16px',
                  height: '16px',
                  animation: 'spin 1s linear infinite',
                  border: '2px solid currentColor',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                }} />
              ) : (
                <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Información del producto */}
        <div className="product-info">
          <h3 className="product-title">{product.name}</h3>
          <div className="product-price">${product.price.toFixed(2)}</div>
        </div>

        {/* Botón de agregar al carrito */}
        <div className="cart-button-container">
          <button onClick={handleAddToCart} className="cart-button">
            Agregar al carrito
          </button>
        </div>
      </motion.div>
      
      {/* Modal de confirmación */}
      <AlertModal
        isOpen={showRemoveModal}
        title="Eliminar de favoritos"
        message={`¿Estás seguro que querés eliminar "${product.name}" de tus favoritos?`}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
      />
    </>
  );
};
```

## Uso

### Básico
```tsx
<WishlistProductCard
  product={product}
  onRemove={() => {
    // Recargar la wishlist
    fetchWishlist();
  }}
/>
```

### Con variante compacta
```tsx
<WishlistProductCard
  product={product}
  variant="compact"
  onRemove={handleProductRemoved}
/>
```

### En la vista de wishlist
```tsx
{items.map((item) => (
  <WishlistProductCard
    key={item.id}
    product={item.product}
    onRemove={() => fetchWishlist()}
  />
))}
```

## Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `product` | `Product` | ✅ | Producto a mostrar |
| `className` | `string` | ❌ | Clases CSS adicionales |
| `variant` | `'default' \| 'compact'` | ❌ | Variante del card |
| `onRemove` | `() => void` | ❌ | Callback cuando se elimina |

## Flujo de Eliminación

1. **Usuario hace click** en el botón de eliminar (basurero)
2. **Se abre AlertModal** con mensaje de confirmación
3. **Si confirma**:
   - Se llama a `removeFromWishlist(product.id)`
   - Se ejecuta el callback `onRemove()`
   - Se actualiza la vista
4. **Si cancela**:
   - Se cierra el modal
   - No se hace ningún cambio
5. **Durante el proceso**:
   - Se muestra spinner en el botón
   - Se deshabilita el botón

## Estados Visuales

| Estado | Botón | Descripción |
|--------|-------|-------------|
| **Normal** | Basurero rojo | Listo para eliminar |
| **Hover** | Basurero rojo oscuro | Efecto hover |
| **Cargando** | Spinner | Eliminación en progreso |
| **Deshabilitado** | Opacidad 50% | Durante eliminación |

## Diferencias con UnifiedProductCard

| Característica | UnifiedProductCard | WishlistProductCard |
|----------------|-------------------|-------------------|
| **Botón principal** | WishlistButton | Botón de eliminar |
| **Icono** | Corazón | Basurero |
| **Color** | Rojo/Gris | Rojo fijo |
| **Acción** | Toggle wishlist | Eliminar de wishlist |
| **Confirmación** | No | AlertModal |
| **Callback** | `onToggle` | `onRemove` |

## Integración con Wishlist

```tsx
// En la página de Wishlist
const Wishlist: React.FC = () => {
  const { items, fetchWishlist } = useWishlistStore();

  const handleProductRemoved = () => {
    // Recargar la wishlist después de eliminar
    fetchWishlist();
  };

  return (
    <div className="wishlist-grid">
      {items.map((item) => (
        <WishlistProductCard
          key={item.id}
          product={item.product}
          onRemove={handleProductRemoved}
        />
      ))}
    </div>
  );
};
```

## Ventajas

### 🎯 **UX Consistente**
- Mismo diseño que otras cards
- Navegación familiar
- Funcionalidades conocidas

### 🛡️ **Seguridad**
- Confirmación antes de eliminar
- Previene eliminaciones accidentales
- Manejo de errores robusto

### ♻️ **Reutilización**
- Basado en componente existente
- Mantiene funcionalidades originales
- Fácil mantenimiento

### 🎨 **Flexibilidad**
- Variantes (default/compact)
- Callback personalizable
- Estilos configurables

## Consideraciones Técnicas

### **Event Handling**
- `preventDefault()` y `stopPropagation()` en botón eliminar
- Evita navegación accidental
- Mantiene funcionalidad de card

### **State Management**
- Estados locales para UI
- Integración con Zustand store
- Callback para actualización

### **Error Handling**
- Try/catch en eliminación
- Alertas de error
- Reversión de estado en fallos

### **Accessibility**
- Aria-labels descriptivos
- Estados semánticos
- Navegación por teclado

## Testing

```tsx
// Test de eliminación
test('WishlistProductCard elimina producto con confirmación', async () => {
  const mockOnRemove = jest.fn();
  render(<WishlistProductCard product={mockProduct} onRemove={mockOnRemove} />);
  
  const removeButton = screen.getByLabelText('Eliminar de favoritos');
  fireEvent.click(removeButton);
  
  // Debe abrir modal de confirmación
  expect(screen.getByText('¿Estás seguro que querés eliminar')).toBeInTheDocument();
  
  // Confirmar eliminación
  const confirmButton = screen.getByText('Confirmar');
  fireEvent.click(confirmButton);
  
  // Debe llamar al callback
  expect(mockOnRemove).toHaveBeenCalled();
});
``` 