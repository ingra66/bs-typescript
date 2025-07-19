# Sistema de Wishlist (Favoritos)

## Descripción
El sistema de wishlist permite a los usuarios guardar productos como favoritos para acceder a ellos más tarde. El sistema incluye funcionalidades tanto en el backend como en el frontend.

## Backend

### Base de Datos
- **Tabla**: `wishlists`
- **Campos**:
  - `id` (Primary Key)
  - `user_id` (Foreign Key a users)
  - `product_id` (Foreign Key a products)
  - `notes` (Opcional - notas del usuario)
  - `is_public` (Boolean - lista pública o privada)
  - `timestamps` (created_at, updated_at)

### Modelo
- **Archivo**: `backend/app/Models/Wishlist.php`
- **Relaciones**: 
  - `belongsTo(User::class)`
  - `belongsTo(Product::class)`
- **Scopes**: `byUser`, `public`, `private`

### Controlador
- **Archivo**: `backend/app/Http/Controllers/Api/WishlistController.php`
- **Métodos**:
  - `index()` - Listar favoritos del usuario
  - `store()` - Agregar producto a favoritos
  - `destroy()` - Eliminar producto de favoritos
  - `check()` - Verificar si producto está en favoritos

### Rutas API
```php
Route::prefix('wishlist')->group(function () {
    Route::get('/', [WishlistController::class, 'index']);
    Route::post('/', [WishlistController::class, 'store']);
    Route::delete('/{product}', [WishlistController::class, 'destroy']);
    Route::get('/check/{product}', [WishlistController::class, 'check']);
});
```

## Frontend

### Servicio
- **Archivo**: `frontend/src/services/wishlistService.ts`
- **Funciones**:
  - `getWishlist()` - Obtener lista de favoritos
  - `addToWishlist()` - Agregar a favoritos
  - `removeFromWishlist()` - Eliminar de favoritos
  - `checkWishlistStatus()` - Verificar estado
  - `toggleWishlist()` - Alternar estado

### Store (Zustand)
- **Archivo**: `frontend/src/stores/wishlistStore.ts`
- **Estado**:
  - `items` - Lista de productos favoritos
  - `isLoading` - Estado de carga
  - `error` - Errores
  - `isInitialized` - Estado de inicialización

### Componentes

#### WishlistButton
- **Archivo**: `frontend/src/components/ui/WishlistButton.tsx`
- **Props**:
  - `productId` - ID del producto
  - `productName` - Nombre del producto
  - `size` - Tamaño del botón ('sm', 'md', 'lg')
  - `className` - Clases CSS adicionales
  - `showText` - Mostrar texto
  - `onToggle` - Callback al cambiar estado

#### WishlistIcon
- **Archivo**: `frontend/src/components/ui/WishlistIcon.tsx`
- **Props**:
  - `size` - Tamaño del icono
  - `className` - Clases CSS adicionales
  - `showBadge` - Mostrar contador

### Páginas

#### Wishlist
- **Archivo**: `frontend/src/pages/Wishlist.tsx`
- **Funcionalidades**:
  - Mostrar lista de productos favoritos
  - Eliminar productos de favoritos
  - Navegar a detalles del producto
  - Estado de carga y errores
  - Redirección a login si no autenticado

### Hook de Sincronización
- **Archivo**: `frontend/src/hooks/useWishlistSync.ts`
- **Funcionalidad**: Sincroniza la wishlist cuando el usuario se autentica/desautentica

## Uso

### Agregar botón de wishlist a un producto
```tsx
import WishlistButton from '../components/ui/WishlistButton';

<WishlistButton
  productId={product.id}
  productName={product.name}
  size="md"
  onToggle={(isInWishlist) => {
    console.log(`Producto ${isInWishlist ? 'agregado a' : 'eliminado de'} favoritos`);
  }}
/>
```

### Mostrar icono de wishlist con contador
```tsx
import WishlistIcon from '../components/ui/WishlistIcon';

<WishlistIcon size={20} showBadge={true} />
```

### Usar el store directamente
```tsx
import { useWishlistStore } from '../stores/wishlistStore';

const { 
  items, 
  isLoading, 
  toggleWishlist, 
  isInWishlist,
  getWishlistCount 
} = useWishlistStore();
```

## Características

### ✅ Implementado
- [x] Base de datos con relaciones
- [x] API REST completa
- [x] Autenticación requerida
- [x] Store con Zustand
- [x] Persistencia local
- [x] Componentes reutilizables
- [x] Página de wishlist
- [x] Botones en tarjetas de productos
- [x] Botón en página de producto
- [x] Icono con contador en header
- [x] Sincronización automática
- [x] Manejo de errores
- [x] Estados de carga

### 🔄 Funcionalidades Adicionales (Opcionales)
- [ ] Wishlist local para usuarios no autenticados
- [ ] Sincronización de wishlist local al autenticarse
- [ ] Notificaciones toast
- [ ] Wishlist pública/compartible
- [ ] Categorización de favoritos
- [ ] Exportar wishlist
- [ ] Wishlist compartida entre dispositivos

## Rutas

### Frontend
- `/wishlist` - Página de favoritos

### Backend
- `GET /api/v1/wishlist` - Listar favoritos
- `POST /api/v1/wishlist` - Agregar a favoritos
- `DELETE /api/v1/wishlist/{product}` - Eliminar de favoritos
- `GET /api/v1/wishlist/check/{product}` - Verificar estado

## Middleware
- Todas las rutas de wishlist requieren autenticación (`auth:sanctum`)
- Verificación de permisos de usuario
- Validación de datos de entrada

## Seguridad
- Autenticación requerida para todas las operaciones
- Validación de propiedad de items
- Sanitización de datos de entrada
- Protección CSRF 