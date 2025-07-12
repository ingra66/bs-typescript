# 🛒 Ecommerce BeltSpot - Migraciones y Modelos

## 📋 Tabla de Contenidos
- [Migraciones](#-migraciones)
- [Modelos](#-modelos)
- [Relaciones](#-relaciones)
- [Características](#-características)
- [Uso](#-uso)

---

## 🗄️ Migraciones

### **Estructura de Base de Datos**

#### 1. **`categories`** - Categorías de Productos
```sql
- id (bigint, auto-increment)
- name (varchar) - Nombre de la categoría
- slug (varchar, unique) - URL amigable
- description (text, nullable) - Descripción
- image (varchar, nullable) - Imagen de la categoría
- is_active (boolean, default: true) - Estado activo
- created_at, updated_at (timestamps)
- deleted_at (soft deletes)
```

#### 2. **`products`** - Productos Principales
```sql
- id (bigint, auto-increment)
- category_id (bigint, foreign key) - Categoría
- name (varchar) - Nombre del producto
- slug (varchar, unique) - URL amigable
- description (text) - Descripción completa
- price (decimal 10,2) - Precio actual
- compare_price (decimal 10,2, nullable) - Precio anterior
- stock (integer, default: 0) - Stock disponible
- sku (varchar, unique) - Código de producto
- images (json, nullable) - Array de imágenes
- is_active (boolean, default: true) - Estado activo
- is_featured (boolean, default: false) - Producto destacado
- created_at, updated_at (timestamps)
- deleted_at (soft deletes)
```

#### 3. **`product_variants`** - Variantes de Productos
```sql
- id (bigint, auto-increment)
- product_id (bigint, foreign key) - Producto padre
- name (varchar) - Tipo de variante (Color, Tamaño, etc.)
- value (varchar) - Valor de la variante (Rojo, XL, etc.)
- price_adjustment (decimal 10,2, default: 0) - Ajuste de precio
- stock (integer, default: 0) - Stock de la variante
- sku (varchar, unique) - SKU específico
- barcode (varchar, nullable) - Código de barras
- weight (decimal 8,2, nullable) - Peso en kg
- width, height, length (decimal 8,2, nullable) - Dimensiones
- is_active (boolean, default: true)
- created_at, updated_at (timestamps)
```

#### 4. **`orders`** - Órdenes/Pedidos
```sql
- id (bigint, auto-increment)
- user_id (bigint, foreign key) - Usuario
- order_number (varchar, unique) - Número de orden
- total_amount (decimal 10,2) - Total de la orden
- tax_amount (decimal 10,2, default: 0) - Impuestos
- shipping_amount (decimal 10,2, default: 0) - Envío
- status (varchar, default: 'pending') - Estado de la orden
- payment_status (varchar, default: 'pending') - Estado del pago
- payment_method (varchar, nullable) - Método de pago
- mp_payment_id (varchar, nullable) - ID de pago MercadoPago
- mp_preference_id (varchar, nullable) - ID de preferencia MP
- shipping_address (json) - Dirección de envío
- billing_address (json) - Dirección de facturación
- notes (text, nullable) - Notas adicionales
- created_at, updated_at (timestamps)
- deleted_at (soft deletes)
```

#### 5. **`order_items`** - Items de Cada Orden
```sql
- id (bigint, auto-increment)
- order_id (bigint, foreign key) - Orden
- product_id (bigint, foreign key) - Producto
- product_name (varchar) - Nombre al momento de la compra
- product_sku (varchar) - SKU al momento de la compra
- quantity (integer) - Cantidad comprada
- unit_price (decimal 10,2) - Precio unitario
- total_price (decimal 10,2) - Precio total del item
- product_data (json, nullable) - Datos del producto al comprar
- created_at, updated_at (timestamps)
```

#### 6. **`cart_items`** - Carrito de Compras
```sql
- id (bigint, auto-increment)
- user_id (bigint, foreign key) - Usuario
- product_id (bigint, foreign key) - Producto
- quantity (integer) - Cantidad en carrito
- created_at, updated_at (timestamps)
```

#### 7. **`coupons`** - Cupones de Descuento
```sql
- id (bigint, auto-increment)
- code (varchar, unique) - Código del cupón
- name (varchar) - Nombre del cupón
- description (text, nullable) - Descripción
- type (enum: 'percentage', 'fixed') - Tipo de descuento
- value (decimal 10,2) - Valor del descuento
- minimum_amount (decimal 10,2, default: 0) - Monto mínimo
- max_uses (integer, nullable) - Usos máximos
- used_count (integer, default: 0) - Veces usado
- starts_at (date, nullable) - Fecha de inicio
- expires_at (date, nullable) - Fecha de expiración
- is_active (boolean, default: true)
- applicable_categories (json, nullable) - Categorías aplicables
- excluded_products (json, nullable) - Productos excluidos
- created_at, updated_at (timestamps)
- deleted_at (soft deletes)
```

#### 8. **`shipping_zones`** - Zonas de Envío
```sql
- id (bigint, auto-increment)
- name (varchar) - Nombre de la zona
- description (text, nullable) - Descripción
- countries (json, nullable) - Lista de países
- states (json, nullable) - Lista de estados
- cities (json, nullable) - Lista de ciudades
- postal_codes (json, nullable) - Códigos postales
- base_rate (decimal 10,2, default: 0) - Tarifa base
- free_shipping_threshold (decimal 10,2, nullable) - Umbral envío gratis
- estimated_days_min (integer, nullable) - Días mínimos
- estimated_days_max (integer, nullable) - Días máximos
- is_active (boolean, default: true)
- created_at, updated_at (timestamps)
```

#### 9. **`reviews`** - Reseñas de Productos
```sql
- id (bigint, auto-increment)
- user_id (bigint, foreign key) - Usuario
- product_id (bigint, foreign key) - Producto
- order_id (bigint, foreign key, nullable) - Orden relacionada
- rating (integer) - Calificación 1-5
- title (varchar, nullable) - Título de la reseña
- comment (text) - Comentario
- images (json, nullable) - Imágenes de la reseña
- is_verified_purchase (boolean, default: false) - Compra verificada
- is_approved (boolean, default: false) - Aprobada
- is_helpful (boolean, default: false) - Marcada como útil
- helpful_count (integer, default: 0) - Veces marcada útil
- not_helpful_count (integer, default: 0) - Veces marcada no útil
- created_at, updated_at (timestamps)
```

#### 10. **`wishlists`** - Listas de Deseos
```sql
- id (bigint, auto-increment)
- user_id (bigint, foreign key) - Usuario
- product_id (bigint, foreign key) - Producto
- notes (text, nullable) - Notas del usuario
- is_public (boolean, default: false) - Lista pública
- created_at, updated_at (timestamps)
```

#### 11. **`notifications`** - Sistema de Notificaciones
```sql
- id (bigint, auto-increment)
- user_id (bigint, foreign key) - Usuario
- type (varchar) - Tipo de notificación
- title (varchar) - Título
- message (text) - Mensaje
- data (json, nullable) - Datos adicionales
- icon (varchar, nullable) - Icono
- action_url (varchar, nullable) - URL de acción
- action_text (varchar, nullable) - Texto del botón
- read_at (timestamp, nullable) - Fecha de lectura
- is_important (boolean, default: false) - Importante
- created_at, updated_at (timestamps)
```

#### 12. **`tax_rates`** - Tasas de Impuestos
```sql
- id (bigint, auto-increment)
- name (varchar) - Nombre del impuesto
- rate (decimal 5,2) - Porcentaje de impuesto
- country (varchar, nullable) - País
- state (varchar, nullable) - Estado/Provincia
- city (varchar, nullable) - Ciudad
- postal_code (varchar, nullable) - Código postal
- is_compound (boolean, default: false) - Impuesto compuesto
- is_shipping (boolean, default: false) - Aplicar a envío
- priority (integer, default: 1) - Prioridad
- is_active (boolean, default: true)
- created_at, updated_at (timestamps)
```

---

## 🎯 Modelos

### **Características Comunes de los Modelos**

Todos los modelos incluyen:
- ✅ **SoftDeletes** donde corresponde
- ✅ **Relaciones Eloquent** completas
- ✅ **Scopes** para filtros comunes
- ✅ **Accessors/Mutators** para formateo
- ✅ **Métodos de negocio** específicos
- ✅ **Validaciones** y estados

### **Modelos Principales**

#### **Category**
```php
// Relaciones
- products() - HasMany

// Scopes
- scopeActive() - Solo categorías activas
- scopeWithProducts() - Con conteo de productos

// Métodos
- getImageUrlAttribute() - URL de la imagen
- getProductsCountAttribute() - Conteo de productos
```

#### **Product**
```php
// Relaciones
- category() - BelongsTo
- variants() - HasMany
- reviews() - HasMany
- cartItems() - HasMany
- wishlists() - HasMany
- orderItems() - HasMany

// Scopes
- scopeActive() - Solo productos activos
- scopeFeatured() - Productos destacados
- scopeInStock() - Con stock disponible
- scopeByCategory() - Por categoría

// Métodos
- getMainImageAttribute() - Imagen principal
- getDiscountPercentageAttribute() - Porcentaje de descuento
- getAverageRatingAttribute() - Rating promedio
- getReviewsCountAttribute() - Conteo de reseñas
- isInStock() - Verificar stock
- hasDiscount() - Verificar descuento
```

#### **Order**
```php
// Estados
const STATUS_PENDING = 'pending';
const STATUS_PAID = 'paid';
const STATUS_SHIPPED = 'shipped';
const STATUS_DELIVERED = 'delivered';
const STATUS_CANCELLED = 'cancelled';

// Relaciones
- user() - BelongsTo
- items() - HasMany

// Métodos
- getSubtotalAttribute() - Subtotal sin impuestos
- getFormattedTotalAttribute() - Total formateado
- getStatusLabelAttribute() - Etiqueta del estado
- isPending() - Verificar si está pendiente
- isPaid() - Verificar si está pagado
- hasMercadoPagoPayment() - Verificar pago MP
- getMercadoPagoPaymentUrl() - URL de pago MP
```

#### **Coupon**
```php
// Tipos
const TYPE_PERCENTAGE = 'percentage';
const TYPE_FIXED = 'fixed';

// Métodos
- isValid() - Validar cupón
- calculateDiscount($subtotal) - Calcular descuento
- canApplyToProduct($productId) - Verificar producto
- canApplyToCategory($categoryId) - Verificar categoría
- incrementUsage() - Incrementar uso
```

#### **Review**
```php
// Métodos
- getRatingStarsAttribute() - Estrellas de rating
- getRatingLabelAttribute() - Etiqueta del rating
- getImageUrlsAttribute() - URLs de imágenes
- markAsHelpful() - Marcar como útil
- getHelpfulPercentageAttribute() - Porcentaje útil
```

---

## 🔗 Relaciones

### **Diagrama de Relaciones Principales**

```
User
├── orders (HasMany)
├── cartItems (HasMany)
├── reviews (HasMany)
├── wishlists (HasMany)
└── notifications (HasMany)

Category
└── products (HasMany)

Product
├── category (BelongsTo)
├── variants (HasMany)
├── reviews (HasMany)
├── cartItems (HasMany)
├── wishlists (HasMany)
└── orderItems (HasMany)

Order
├── user (BelongsTo)
└── items (HasMany)

OrderItem
├── order (BelongsTo)
└── product (BelongsTo)
```

---

## ⚡ Características Avanzadas

### **MercadoPago Integration**
- ✅ **mp_payment_id** - ID del pago en MercadoPago
- ✅ **mp_preference_id** - ID de la preferencia de pago
- ✅ **getMercadoPagoPaymentUrl()** - Generar URL de pago

### **Sistema de Cupones Inteligente**
- ✅ **Validación por fecha** - Fechas de inicio y expiración
- ✅ **Validación por uso** - Límite de usos
- ✅ **Validación por monto mínimo** - Monto mínimo para aplicar
- ✅ **Restricciones por categoría** - Aplicar solo a categorías específicas
- ✅ **Exclusión de productos** - Excluir productos específicos

### **Zonas de Envío Dinámicas**
- ✅ **Validación por ubicación** - País, estado, ciudad, código postal
- ✅ **Envío gratis** - Umbral para envío gratuito
- ✅ **Estimación de días** - Rango de días de entrega

### **Sistema de Reseñas Verificado**
- ✅ **Verificación de compra** - Solo usuarios que compraron
- ✅ **Sistema de útiles** - Marcar reseñas como útiles
- ✅ **Aprobación manual** - Control de calidad
- ✅ **Imágenes en reseñas** - Soporte para imágenes

### **Notificaciones del Sistema**
- ✅ **Tipos específicos** - Diferentes tipos de notificación
- ✅ **Marcado como leído** - Control de lectura
- ✅ **Notificaciones importantes** - Prioridad alta
- ✅ **Acciones** - URLs y botones de acción

---

## 🚀 Uso

### **Ejecutar Migraciones**
```bash
cd backend
php artisan migrate
```

### **Ejemplos de Uso de Modelos**

#### **Crear un Producto**
```php
$product = Product::create([
    'category_id' => 1,
    'name' => 'Camiseta Premium',
    'slug' => 'camiseta-premium',
    'description' => 'Camiseta de alta calidad...',
    'price' => 29.99,
    'compare_price' => 39.99,
    'stock' => 100,
    'sku' => 'CAM-001',
    'is_active' => true,
    'is_featured' => true,
]);
```

#### **Buscar Productos con Filtros**
```php
$products = Product::active()
    ->inStock()
    ->featured()
    ->with(['category', 'reviews'])
    ->get();
```

#### **Crear una Orden con MercadoPago**
```php
$order = Order::create([
    'user_id' => auth()->id(),
    'order_number' => 'ORD-' . time(),
    'total_amount' => 99.99,
    'mp_preference_id' => 'pref_123456',
    'shipping_address' => [
        'name' => 'Juan Pérez',
        'address' => 'Calle 123',
        'city' => 'Buenos Aires',
        'postal_code' => '1001',
    ],
]);
```

#### **Validar y Aplicar Cupón**
```php
$coupon = Coupon::where('code', 'DESCUENTO20')->first();

if ($coupon && $coupon->isValid()) {
    $discount = $coupon->calculateDiscount($subtotal);
    $coupon->incrementUsage();
}
```

#### **Calcular Envío por Zona**
```php
$shippingZone = ShippingZone::active()
    ->where('countries', 'like', '%AR%')
    ->first();

if ($shippingZone) {
    $shippingCost = $shippingZone->calculateShippingCost($subtotal);
}
```

---

## 📝 Notas Importantes

1. **SoftDeletes**: Los modelos `Category`, `Product`, `Order` y `Coupon` usan soft deletes
2. **JSON Fields**: Varios campos usan JSON para flexibilidad
3. **MercadoPago**: Integración completa con IDs de pago y preferencias
4. **Validaciones**: Todos los modelos incluyen validaciones de negocio
5. **Performance**: Los scopes están optimizados para consultas eficientes

---

## 🔧 Próximos Pasos

1. **Controladores API** - Crear endpoints REST
2. **Seeders** - Datos de prueba
3. **Tests** - Pruebas unitarias y de integración
4. **Documentación API** - Swagger/OpenAPI
5. **Frontend Integration** - Conectar con React 