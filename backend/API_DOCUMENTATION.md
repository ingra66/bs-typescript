# API REST Documentation - BeltSpot Ecommerce

## 📋 Índice
- [Autenticación](#autenticación)
- [Categorías](#categorías)
- [Productos](#productos)
- [Carrito](#carrito)
- [Órdenes](#órdenes)
- [Cupones](#cupones)
- [Reseñas](#reseñas)
- [Lista de Deseos](#lista-de-deseos)
- [Notificaciones](#notificaciones)
- [MercadoPago](#mercadopago)
- [Seeders](#seeders)

---

## 🔐 Autenticación

### Base URL
```
http://localhost:8000/api/v1
```

### Headers para rutas protegidas
```
Authorization: Bearer {token}
Content-Type: application/json
```

### Endpoints de Autenticación

#### 1. Registro de Usuario
```http
POST /register
```

**Body:**
```json
{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "password_confirmation": "password123"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Usuario registrado correctamente",
    "data": {
        "user": {
            "id": 1,
            "name": "Juan Pérez",
            "email": "juan@example.com",
            "is_admin": false
        },
        "token": "1|abc123..."
    }
}
```

#### 2. Login
```http
POST /login
```

**Body:**
```json
{
    "email": "juan@example.com",
    "password": "password123"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Login exitoso",
    "data": {
        "user": {
            "id": 1,
            "name": "Juan Pérez",
            "email": "juan@example.com"
        },
        "token": "1|abc123..."
    }
}
```

#### 3. Logout
```http
POST /logout
```
*Requiere autenticación*

**Response:**
```json
{
    "success": true,
    "message": "Logout exitoso"
}
```

#### 4. Obtener Usuario Autenticado
```http
GET /user
```
*Requiere autenticación*

**Response:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Juan Pérez",
        "email": "juan@example.com",
        "is_admin": false
    }
}
```

---

## 📂 Categorías

### Endpoints Públicos

#### 1. Listar Categorías
```http
GET /categories
```

**Query Parameters:**
- `active` (boolean): Solo categorías activas
- `with_products` (boolean): Incluir productos
- `order_by` (string): Campo de ordenamiento
- `order_direction` (string): asc/desc
- `per_page` (integer): Elementos por página

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Cinturones de Cuero",
            "description": "Cinturones de cuero genuino de alta calidad",
            "slug": "cinturones-cuero",
            "is_active": true
        }
    ],
    "pagination": {
        "current_page": 1,
        "last_page": 1,
        "per_page": 15,
        "total": 6
    }
}
```

#### 2. Obtener Categoría
```http
GET /categories/{id}
```

#### 3. Navegación de Categorías
```http
GET /categories/navigation
```

### Endpoints Administrativos
*Requieren autenticación y rol de admin*

#### 1. Crear Categoría
```http
POST /admin/categories
```

#### 2. Actualizar Categoría
```http
PUT /admin/categories/{id}
```

#### 3. Eliminar Categoría
```http
DELETE /admin/categories/{id}
```

---

## 🛍️ Productos

### Endpoints Públicos

#### 1. Listar Productos
```http
GET /products
```

**Query Parameters:**
- `active` (boolean): Solo productos activos
- `featured` (boolean): Solo productos destacados
- `in_stock` (boolean): Solo productos en stock
- `category_id` (integer): Filtrar por categoría
- `search` (string): Búsqueda por nombre/descripción
- `min_price` (numeric): Precio mínimo
- `max_price` (numeric): Precio máximo
- `order_by` (string): Campo de ordenamiento
- `per_page` (integer): Elementos por página

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Cinturón de Cuero Marrón Clásico",
            "description": "Cinturón de cuero genuino marrón...",
            "sku": "BELT-001",
            "price": 29.99,
            "stock": 50,
            "is_active": true,
            "is_featured": true,
            "images": ["belt-1.jpg", "belt-1-2.jpg"],
            "category": {
                "id": 1,
                "name": "Cinturones de Cuero"
            }
        }
    ],
    "pagination": {
        "current_page": 1,
        "last_page": 1,
        "per_page": 12,
        "total": 25
    }
}
```

#### 2. Productos Destacados
```http
GET /products/featured
```

#### 3. Búsqueda de Productos
```http
GET /products/search?q=cinturon
```

#### 4. Obtener Producto
```http
GET /products/{id}
```

#### 5. Productos por Categoría
```http
GET /categories/{category}/products
```

### Endpoints Administrativos

#### 1. Crear Producto
```http
POST /admin/products
```

**Body:**
```json
{
    "name": "Nuevo Cinturón",
    "description": "Descripción del producto",
    "sku": "BELT-NEW",
    "price": 29.99,
    "stock": 50,
    "category_id": 1,
    "is_active": true,
    "is_featured": false,
    "images": ["image1.jpg", "image2.jpg"]
}
```

#### 2. Actualizar Producto
```http
PUT /admin/products/{id}
```

#### 3. Eliminar Producto
```http
DELETE /admin/products/{id}
```

---

## 🛒 Carrito

*Todos los endpoints requieren autenticación*

#### 1. Ver Carrito
```http
GET /cart
```

**Response:**
```json
{
    "success": true,
    "data": {
        "items": [
            {
                "id": 1,
                "product_id": 1,
                "quantity": 2,
                "subtotal": 59.98,
                "product": {
                    "name": "Cinturón de Cuero Marrón",
                    "price": 29.99
                }
            }
        ],
        "subtotal": 59.98,
        "formatted_subtotal": "$59.98",
        "total_items": 2
    }
}
```

#### 2. Agregar al Carrito
```http
POST /cart/add
```

**Body:**
```json
{
    "product_id": 1,
    "quantity": 2
}
```

#### 3. Actualizar Cantidad
```http
PUT /cart/{cartItem}
```

**Body:**
```json
{
    "quantity": 3
}
```

#### 4. Remover del Carrito
```http
DELETE /cart/{cartItem}
```

#### 5. Vaciar Carrito
```http
DELETE /cart
```

#### 6. Resumen del Carrito
```http
GET /cart/summary
```

#### 7. Validar Carrito
```http
POST /cart/validate
```

---

## 📦 Órdenes

*Todos los endpoints requieren autenticación*

#### 1. Listar Órdenes
```http
GET /orders
```

**Query Parameters:**
- `status` (string): Filtrar por estado
- `payment_status` (string): Filtrar por estado de pago
- `order_by` (string): Campo de ordenamiento
- `per_page` (integer): Elementos por página

#### 2. Crear Orden
```http
POST /orders
```

**Body:**
```json
{
    "shipping_address": {
        "name": "Juan Pérez",
        "address": "Av. Corrientes 123",
        "city": "Buenos Aires",
        "state": "Buenos Aires",
        "postal_code": "1000",
        "country": "Argentina",
        "phone": "+54 11 1234-5678"
    },
    "billing_address": {
        "name": "Juan Pérez",
        "address": "Av. Corrientes 123",
        "city": "Buenos Aires",
        "state": "Buenos Aires",
        "postal_code": "1000",
        "country": "Argentina"
    },
    "coupon_code": "WELCOME10",
    "notes": "Entregar en horario de oficina"
}
```

#### 3. Obtener Orden
```http
GET /orders/{id}
```

#### 4. Cancelar Orden
```http
POST /orders/{id}/cancel
```

#### 5. Estadísticas de Órdenes
```http
GET /orders/statistics
```

### Endpoints Administrativos

#### 1. Listar Todas las Órdenes
```http
GET /admin/orders
```

#### 2. Ver Orden (Admin)
```http
GET /admin/orders/{id}
```

#### 3. Actualizar Estado
```http
PUT /admin/orders/{id}/status
```

**Body:**
```json
{
    "status": "shipped",
    "tracking_number": "ABC123456789"
}
```

---

## 🎫 Cupones

### Endpoints Públicos

#### 1. Validar Cupón
```http
POST /coupons/validate
```

**Body:**
```json
{
    "code": "WELCOME10",
    "subtotal": 100.00
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "coupon": {
            "code": "WELCOME10",
            "name": "Descuento de Bienvenida",
            "type": "percentage",
            "value": 10
        },
        "discount": 10.00,
        "formatted_discount": "$10.00",
        "final_amount": 90.00,
        "formatted_final_amount": "$90.00"
    }
}
```

### Endpoints Administrativos

#### 1. Listar Cupones
```http
GET /admin/coupons
```

#### 2. Crear Cupón
```http
POST /admin/coupons
```

**Body:**
```json
{
    "code": "SUMMER20",
    "name": "Oferta de Verano",
    "description": "20% de descuento",
    "type": "percentage",
    "value": 20,
    "minimum_amount": 50.00,
    "max_uses": 100,
    "starts_at": "2024-01-01",
    "expires_at": "2024-12-31",
    "is_active": true
}
```

#### 3. Ver Cupón
```http
GET /admin/coupons/{id}
```

#### 4. Actualizar Cupón
```http
PUT /admin/coupons/{id}
```

#### 5. Eliminar Cupón
```http
DELETE /admin/coupons/{id}
```

---

## ⭐ Reseñas

### Endpoints Públicos

#### 1. Listar Reseñas de Producto
```http
GET /products/{product}/reviews
```

**Query Parameters:**
- `rating` (integer): Filtrar por calificación
- `verified` (boolean): Solo reseñas verificadas
- `order_by` (string): Campo de ordenamiento
- `per_page` (integer): Elementos por página

#### 2. Ver Reseña
```http
GET /reviews/{id}
```

### Endpoints Protegidos

#### 1. Crear Reseña
```http
POST /reviews
```

**Body:**
```json
{
    "product_id": 1,
    "order_id": 1,
    "rating": 5,
    "title": "Excelente producto",
    "comment": "Muy buena calidad, envío rápido",
    "is_verified": true
}
```

#### 2. Actualizar Reseña
```http
PUT /reviews/{id}
```

#### 3. Eliminar Reseña
```http
DELETE /reviews/{id}
```

#### 4. Marcar como Útil
```http
POST /reviews/{id}/helpful
```

#### 5. Marcar como No Útil
```http
POST /reviews/{id}/not-helpful
```

### Endpoints Administrativos

#### 1. Listar Todas las Reseñas
```http
GET /admin/reviews
```

#### 2. Aprobar Reseña
```http
PUT /admin/reviews/{id}/approve
```

#### 3. Rechazar Reseña
```http
PUT /admin/reviews/{id}/reject
```

---

## ❤️ Lista de Deseos

*Todos los endpoints requieren autenticación*

#### 1. Ver Lista de Deseos
```http
GET /wishlist
```

#### 2. Agregar a Lista de Deseos
```http
POST /wishlist/add
```

**Body:**
```json
{
    "product_id": 1,
    "notes": "Para regalo de cumpleaños",
    "is_public": false
}
```

#### 3. Actualizar Item
```http
PUT /wishlist/{id}
```

#### 4. Remover de Lista de Deseos
```http
DELETE /wishlist/{id}
```

#### 5. Resumen de Lista de Deseos
```http
GET /wishlist/summary
```

#### 6. Listas Públicas
```http
GET /wishlist/public
```

#### 7. Verificar en Lista de Deseos
```http
POST /wishlist/check
```

**Body:**
```json
{
    "product_id": 1
}
```

#### 8. Productos en Oferta de Lista
```http
GET /wishlist/on-sale
```

#### 9. Productos de Vuelta en Stock
```http
GET /wishlist/back-in-stock
```

---

## 🔔 Notificaciones

*Todos los endpoints requieren autenticación*

#### 1. Listar Notificaciones
```http
GET /notifications
```

**Query Parameters:**
- `unread` (boolean): Solo no leídas
- `read` (boolean): Solo leídas
- `important` (boolean): Solo importantes
- `type` (string): Filtrar por tipo
- `order_by` (string): Campo de ordenamiento
- `per_page` (integer): Elementos por página

#### 2. Notificaciones No Leídas
```http
GET /notifications/unread
```

#### 3. Marcar como Leída
```http
POST /notifications/{id}/read
```

#### 4. Marcar Todas como Leídas
```http
POST /notifications/read-all
```

#### 5. Marcar como No Leída
```http
POST /notifications/{id}/unread
```

#### 6. Eliminar Notificación
```http
DELETE /notifications/{id}
```

#### 7. Vaciar Notificaciones
```http
DELETE /notifications
```

#### 8. Estadísticas
```http
GET /notifications/statistics
```

#### 9. Tipos de Notificación
```http
GET /notifications/types
```

#### 10. Por Tipo
```http
GET /notifications/by-type?type=order_status
```

#### 11. Crear Notificación de Prueba
```http
POST /notifications/test
```

**Body:**
```json
{
    "type": "order_status",
    "title": "Orden Enviada",
    "message": "Tu orden #123 ha sido enviada",
    "is_important": true
}
```

#### 12. Eliminar Leídas
```http
DELETE /notifications/read
```

---

## 💳 MercadoPago

### Endpoints Públicos

#### 1. Métodos de Pago
```http
GET /mercadopago/payment-methods
```

### Endpoints Protegidos

#### 1. Crear Preferencia de Pago
```http
POST /mercadopago/create-preference
```

**Body:**
```json
{
    "order_id": 1
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "preference_id": "1234567890",
        "init_point": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=1234567890"
    }
}
```

#### 2. Estado de Pago
```http
GET /mercadopago/orders/{order}/payment-status
```

### Webhook (Sin Autenticación)

#### 1. Webhook de MercadoPago
```http
POST /webhook/mercadopago
```

---

## 🌱 Seeders

### Comando para Ejecutar Seeders
```bash
php artisan db:seed
```

### Seeders Disponibles

#### 1. UserSeeder
- **Admin:** `admin@beltspot.com` / `password`
- **Usuario:** `user@beltspot.com` / `password`
- **8 usuarios adicionales** generados con factory

#### 2. CategorySeeder
Categorías creadas:
- Cinturones de Cuero
- Cinturones de Tela
- Cinturones Formales
- Hebillas
- Accesorios
- Ofertas

#### 3. ProductSeeder
**Productos específicos:**
- Cinturón de Cuero Marrón Clásico ($29.99)
- Cinturón de Cuero Negro Elegante ($34.99)
- Cinturón Deportivo Azul ($19.99)
- Hebilla Decorativa Plateada ($12.99)
- Cinturón de Cuero Marrón Vintage ($39.99)
- Cinturón Formal Gris ($44.99)
- Cinturón Deportivo Rojo ($15.99)
- Organizador de Cinturones ($24.99)
- Cinturón de Cuero Negro Básico ($24.99)
- Hebilla Dorada Decorativa ($18.99)

**+ 15 productos adicionales** generados con factory

#### 4. CouponSeeder
Cupones creados:
- **WELCOME10:** 10% descuento (mín. $50)
- **FREESHIP:** $15 descuento envío (mín. $100)
- **SUMMER20:** 20% descuento (mín. $30)
- **FLASH25:** 25% descuento (mín. $75)
- **LOYALTY15:** 15% descuento (mín. $60)

#### 5. ShippingZoneSeeder
Zonas de envío:
- **Zona Local:** $5 (1-2 días)
- **Zona Nacional:** $12 (3-5 días)
- **Zona Sur:** $18 (5-7 días)
- **Zona Norte:** $20 (7-10 días)
- **Envío Express:** $25 (24 horas)

#### 6. TaxRateSeeder
Tasas de impuestos:
- **IVA 21%:** Estándar
- **IVA 10.5%:** Reducido
- **IVA 27%:** Aumentado
- **Impuesto Provincial 3%:** Buenos Aires
- **Impuesto Municipal 1%:** CABA

---

## 🔧 Códigos de Estado HTTP

- `200` - OK
- `201` - Creado
- `400` - Bad Request
- `401` - No autorizado
- `403` - Prohibido
- `404` - No encontrado
- `422` - Error de validación
- `500` - Error interno del servidor

---

## 📝 Notas Importantes

1. **Autenticación:** Usa el token Bearer en el header `Authorization`
2. **Paginación:** Todos los endpoints de listado soportan paginación
3. **Filtros:** La mayoría de endpoints soportan filtros por query parameters
4. **Validación:** Todos los endpoints validan los datos de entrada
5. **Respuestas:** Todas las respuestas siguen el formato `{success, message, data}`
6. **Admin:** Algunos endpoints requieren rol de administrador

---

## 🚀 Próximos Pasos

1. **Ejecutar seeders:** `php artisan db:seed`
2. **Probar endpoints** con Postman o similar
3. **Configurar frontend** para consumir la API
4. **Implementar tests** para los endpoints
5. **Configurar CORS** si es necesario
6. **Documentar con Swagger** para mejor visualización 