# Configuración de Pagos y Órdenes - BeltSpot

## Descripción

Este documento describe la implementación completa de las funcionalidades de órdenes y pagos con MercadoPago en el frontend de BeltSpot.

## Funcionalidades Implementadas

### 1. Servicios de API

#### `orderService.ts`
- `getOrders()` - Obtener lista de órdenes del usuario
- `getOrder(id)` - Obtener detalles de una orden específica
- `createOrder(data)` - Crear una nueva orden
- `cancelOrder(id)` - Cancelar una orden
- `getOrderStatistics()` - Obtener estadísticas de órdenes

#### `mercadopagoService.ts`
- `getPaymentMethods()` - Obtener métodos de pago disponibles
- `createPreference(orderId)` - Crear preferencia de pago
- `getPaymentStatus(orderId)` - Obtener estado del pago
- `redirectToPayment(url)` - Redirigir a MercadoPago
- `processPaymentResponse(params)` - Procesar respuesta de pago

### 2. Componentes

#### Órdenes
- `OrderList.tsx` - Lista de órdenes con filtros y paginación
- `OrderDetail.tsx` - Detalles completos de una orden

#### Pagos
- `PaymentMethods.tsx` - Selección de métodos de pago
- `PaymentProcessor.tsx` - Procesamiento de pagos

### 3. Páginas

#### Órdenes
- `/orders` - Lista de órdenes del usuario
- `/orders/:orderId` - Detalles de una orden específica

#### Pagos
- `/checkout` - Proceso de checkout con pago
- `/payment/success` - Página de pago exitoso
- `/payment/failure` - Página de pago fallido
- `/payment/pending` - Página de pago pendiente

## Configuración Requerida

### Variables de Entorno

Crear un archivo `.env` en el directorio `frontend/` con las siguientes variables:

```env
# Configuración de la API
VITE_API_URL=http://localhost:8000/api/v1

# Configuración de MercadoPago (para desarrollo)
VITE_MERCADOPAGO_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Configuración de la aplicación
VITE_APP_NAME=BeltSpot
VITE_APP_VERSION=1.0.0

# Configuración de desarrollo
VITE_DEBUG=true
```

### Configuración del Backend

Asegúrate de que el backend tenga configurado:

1. **MercadoPago** en `backend/.env`:
```env
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MERCADOPAGO_WEBHOOK_URL=http://localhost:8000/api/webhook/mercadopago
```

2. **Base de datos** con las tablas necesarias:
- `orders`
- `order_items`
- `cart_items`
- `products`
- `users`

## Flujo de Pago

1. **Usuario agrega productos al carrito**
2. **Va al checkout** (`/checkout`)
3. **Completa información de envío**
4. **Se crea la orden** en el backend
5. **Se crea preferencia de pago** en MercadoPago
6. **Usuario es redirigido** a MercadoPago
7. **Usuario completa el pago** en MercadoPago
8. **MercadoPago redirige** al usuario según el resultado:
   - `/payment/success` - Pago exitoso
   - `/payment/failure` - Pago fallido
   - `/payment/pending` - Pago pendiente

## Webhooks

El backend debe configurar el webhook de MercadoPago en:
```
POST /api/webhook/mercadopago
```

Este endpoint procesa las notificaciones de MercadoPago y actualiza el estado de las órdenes automáticamente.

## Estados de Órdenes

### Estados de Orden
- `pending` - Pendiente
- `processing` - En proceso
- `shipped` - Enviado
- `delivered` - Entregado
- `cancelled` - Cancelado

### Estados de Pago
- `pending` - Pendiente
- `paid` - Pagado
- `failed` - Fallido
- `refunded` - Reembolsado

## Funcionalidades de Usuario

### Lista de Órdenes (`/orders`)
- Ver todas las órdenes del usuario
- Filtrar por estado de orden y pago
- Ordenar por fecha
- Paginación
- Acceso a detalles de cada orden

### Detalles de Orden (`/orders/:orderId`)
- Información completa de la orden
- Lista de productos
- Dirección de envío
- Resumen de costos
- Estado actual
- Opción de cancelar (si es posible)

### Checkout (`/checkout`)
- Formulario de dirección de envío
- Resumen de productos
- Procesamiento de pago con MercadoPago
- Validación de formulario
- Manejo de errores

## Características Técnicas

### TypeScript
- Tipos completos para todas las interfaces
- Validación de tipos en tiempo de compilación
- Interfaces para órdenes, pagos y respuestas de API

### React
- Componentes funcionales con hooks
- Manejo de estado con useState y useEffect
- Navegación con React Router
- Integración con stores de estado

### Tailwind CSS
- Diseño responsive
- Tema oscuro consistente
- Componentes reutilizables
- Animaciones y transiciones

### API REST
- Comunicación con backend Laravel
- Manejo de errores HTTP
- Interceptores para autenticación
- Timeouts y reintentos

## Pruebas

### Datos de Prueba para MercadoPago

Para pruebas, usa estas tarjetas de prueba:

**Tarjetas de Crédito:**
- Visa: 4509 9535 6623 3704
- Mastercard: 5031 4332 1540 6351

**Tarjetas de Débito:**
- Visa: 4509 9535 6623 3704
- Mastercard: 5031 4332 1540 6351

**Datos de prueba:**
- CVV: 123
- Fecha: Cualquier fecha futura
- Nombre: Cualquier nombre

## Notas Importantes

1. **Solo para desarrollo**: Las tarjetas de prueba solo funcionan en modo sandbox
2. **Webhooks**: Asegúrate de que el webhook esté configurado correctamente
3. **CORS**: El backend debe permitir requests desde el frontend
4. **Autenticación**: Todas las rutas de órdenes requieren autenticación
5. **Validación**: Los formularios tienen validación del lado cliente y servidor

## Solución de Problemas

### Error 401 (No autorizado)
- Verifica que el usuario esté autenticado
- Revisa el token de autenticación

### Error 422 (Validación)
- Revisa los datos enviados al backend
- Verifica que todos los campos requeridos estén completos

### Error de MercadoPago
- Verifica las credenciales de MercadoPago
- Asegúrate de estar en modo sandbox para pruebas
- Revisa los logs del backend para más detalles

### Webhook no funciona
- Verifica la URL del webhook en MercadoPago
- Asegúrate de que el endpoint esté accesible públicamente
- Revisa los logs del backend para errores 