# Guía de Debug - Wishlist en Panel de Administración

## Problema Identificado
En la imagen se muestra que el modal de wishlist aparece correctamente, pero muestra el mensaje "Este usuario no tiene productos en su wishlist" para el Usuario 15. Esto indica que la funcionalidad está funcionando, pero no hay datos de wishlist en la base de datos.

## Pasos para Solucionar

### 1. Verificar Datos de Wishlist

#### Opción A: Usar el Seeder (Recomendado)
```bash
# En el directorio backend
php artisan db:seed --class=WishlistSeeder
```

#### Opción B: Crear Datos Manualmente
```sql
-- Verificar si hay usuarios y productos
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_products FROM products;

-- Crear wishlist items de prueba
INSERT INTO wishlists (user_id, product_id, notes, is_public, created_at, updated_at) 
VALUES 
(15, 1, 'Producto favorito', 0, NOW(), NOW()),
(15, 2, 'Para regalo', 1, NOW(), NOW()),
(16, 1, 'Me gusta mucho', 0, NOW(), NOW());
```

### 2. Verificar Endpoints

#### Probar el Endpoint de Debug
```bash
# Usar el componente WishlistDebug en el frontend
# O hacer una petición directa:
curl -X GET "http://localhost:8000/api/v1/admin/users/debug/wishlist-test" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

#### Probar el Endpoint de Wishlist
```bash
curl -X GET "http://localhost:8000/api/v1/admin/users/15/wishlist" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### 3. Verificar Logs del Backend

Revisar los logs de Laravel para ver si hay errores:
```bash
# En el directorio backend
tail -f storage/logs/laravel.log
```

### 4. Verificar Configuración de Base de Datos

#### Verificar Conexión
```bash
php artisan tinker
>>> DB::connection()->getPdo()
```

#### Verificar Tabla Wishlist
```bash
php artisan tinker
>>> Schema::hasTable('wishlists')
>>> DB::table('wishlists')->count()
```

### 5. Verificar Relaciones de Modelos

#### En el Backend
```php
// Verificar en tinker
php artisan tinker

// Probar relaciones
$user = App\Models\User::find(15);
$user->wishlists; // Debe mostrar wishlist items

$wishlist = App\Models\Wishlist::first();
$wishlist->user; // Debe mostrar el usuario
$wishlist->product; // Debe mostrar el producto
```

### 6. Verificar Frontend

#### Revisar Console del Navegador
1. Abrir DevTools (F12)
2. Ir a la pestaña Console
3. Buscar logs que empiecen con 🔍, ✅, o ❌

#### Revisar Network Tab
1. Abrir DevTools (F12)
2. Ir a la pestaña Network
3. Hacer click en "Ver Wishlist"
4. Verificar la petición a `/admin/users/15/wishlist`

### 7. Componente de Debug

Usar el componente `WishlistDebug` para probar la conexión:

```tsx
// En cualquier página del admin
import WishlistDebug from '../components/admin/WishlistDebug';

// Agregar temporalmente
<WishlistDebug />
```

### 8. Verificar Autenticación

#### Verificar Token
```javascript
// En la consola del navegador
console.log('Token:', localStorage.getItem('token'));
```

#### Verificar Headers
```javascript
// En el archivo api.ts
console.log('Headers:', {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
});
```

## Posibles Causas del Problema

### 1. No Hay Datos de Wishlist
- **Solución**: Ejecutar el seeder o crear datos manualmente

### 2. Problema de Autenticación
- **Síntoma**: Error 401 o 403
- **Solución**: Verificar token y permisos de admin

### 3. Problema de Relaciones
- **Síntoma**: Error 500 o datos vacíos
- **Solución**: Verificar que los modelos User, Product y Wishlist tengan las relaciones correctas

### 4. Problema de CORS
- **Síntoma**: Error de red en el navegador
- **Solución**: Verificar configuración de CORS en el backend

### 5. Problema de Rutas
- **Síntoma**: Error 404
- **Solución**: Verificar que las rutas estén registradas correctamente

## Comandos Útiles

### Backend
```bash
# Limpiar cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Verificar rutas
php artisan route:list | grep wishlist

# Verificar logs
tail -f storage/logs/laravel.log

# Ejecutar seeder
php artisan db:seed --class=WishlistSeeder
```

### Frontend
```bash
# Limpiar cache
npm run build
npm run dev

# Verificar variables de entorno
echo $VITE_API_URL
```

## Estructura de Datos Esperada

### Respuesta del Backend
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 15,
      "product_id": 1,
      "notes": "Producto favorito",
      "is_public": false,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "product": {
        "id": 1,
        "name": "Producto Ejemplo",
        "slug": "producto-ejemplo",
        "price": "99.99",
        "main_image": "products/image.jpg",
        "category": {
          "id": 1,
          "name": "Electrónicos"
        }
      }
    }
  ],
  "message": "Wishlist obtenida correctamente"
}
```

## Verificación Final

1. **Ejecutar seeder**: `php artisan db:seed --class=WishlistSeeder`
2. **Verificar datos**: `php artisan tinker` → `DB::table('wishlists')->count()`
3. **Probar endpoint**: Usar el componente WishlistDebug
4. **Verificar frontend**: Revisar console y network tab
5. **Probar funcionalidad**: Ir al panel de admin y probar "Ver Wishlist"

## Logs de Debug Agregados

### Backend
- Logs detallados en `getUserWishlist()`
- Endpoint de debug `/admin/users/debug/wishlist-test`

### Frontend
- Logs en `userService.getUserWishlist()`
- Componente `WishlistDebug` para pruebas

## Contacto

Si el problema persiste después de seguir esta guía, revisar:
1. Logs del backend en `storage/logs/laravel.log`
2. Console del navegador para errores de JavaScript
3. Network tab para errores de red
4. Verificar que el usuario tenga permisos de administrador 