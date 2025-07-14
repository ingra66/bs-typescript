# Configuración de Mercado Pago

## Variables de Entorno

Agrega las siguientes variables a tu archivo `.env`:

```env
# MercadoPago Configuration
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MERCADOPAGO_ENVIRONMENT=sandbox
MERCADOPAGO_WEBHOOK_URL=http://localhost:8000/api/v1/webhook/mercadopago
MERCADOPAGO_NOTIFICATION_URL=http://localhost:8000/api/v1/webhook/mercadopago
APP_FRONTEND_URL=http://localhost:5173
```

## Configuración de Mercado Pago

### 1. Crear cuenta en Mercado Pago
- Ve a [Mercado Pago Developers](https://www.mercadopago.com.ar/developers)
- Crea una cuenta de desarrollador
- Accede al panel de desarrolladores

### 2. Obtener credenciales de prueba
- En el panel de desarrolladores, ve a "Credenciales"
- Copia el `Access Token` de prueba
- Copia la `Public Key` de prueba

### 3. Configurar webhooks (opcional para desarrollo local)
- En el panel de desarrolladores, ve a "Notificaciones"
- Configura la URL del webhook: `http://localhost:8000/api/v1/webhook/mercadopago`

### 4. Para producción
- Cambia `MERCADOPAGO_ENVIRONMENT=production`
- Usa las credenciales de producción en lugar de las de prueba
- Configura las URLs de producción en `APP_FRONTEND_URL`

## Instalación del SDK

El SDK de Mercado Pago ya está incluido en el `composer.json`:

```bash
composer require mercadopago/dx-php
```

## Endpoints disponibles

### Frontend
- `POST /api/v1/orders` - Crear orden
- `POST /api/v1/mercadopago/create-preference` - Crear preferencia de pago
- `GET /api/v1/mercadopago/orders/{order}/payment-status` - Verificar estado del pago

### Webhooks (sin autenticación)
- `POST /api/v1/webhook/mercadopago` - Recibir notificaciones de Mercado Pago

## Flujo de pago

1. **Usuario completa checkout** → Se crea orden en el backend
2. **Se crea preferencia** → Se genera URL de pago de Mercado Pago
3. **Usuario es redirigido** → A Mercado Pago para completar el pago
4. **Mercado Pago notifica** → Al webhook sobre el resultado del pago
5. **Usuario es redirigido** → A la página de éxito/fallo/pendiente

## URLs de retorno

- **Éxito**: `http://localhost:5173/payment/success`
- **Fallido**: `http://localhost:5173/payment/failure`
- **Pendiente**: `http://localhost:5173/payment/pending`

## Testing

### Tarjetas de prueba

**Visa**
- Número: 4509 9535 6623 3704
- Fecha: 11/25
- CVV: 123

**Mastercard**
- Número: 5031 4332 1540 6351
- Fecha: 11/25
- CVV: 123

### Estados de prueba

- **Aprobado**: Usa cualquier tarjeta válida
- **Pendiente**: Usa tarjeta con fecha vencida
- **Rechazado**: Usa tarjeta con CVV incorrecto

## Notas importantes

1. **Sandbox vs Production**: En sandbox, los pagos no son reales
2. **Webhooks**: En desarrollo local, usa ngrok para recibir webhooks
3. **URLs**: Asegúrate de que las URLs de retorno estén configuradas correctamente
4. **Tokens**: Nunca compartas tus tokens de acceso en código público
5. **Logs**: Revisa los logs de Laravel para debuggear problemas

## Troubleshooting

### Error: "Invalid access token"
- Verifica que el `MERCADOPAGO_ACCESS_TOKEN` sea correcto
- Asegúrate de usar tokens de sandbox para desarrollo

### Error: "Webhook not received"
- En desarrollo local, usa ngrok: `ngrok http 8000`
- Actualiza la URL del webhook en Mercado Pago

### Error: "Preference creation failed"
- Verifica que todos los campos requeridos estén presentes
- Revisa los logs de Laravel para más detalles

### Error: "Payment not found"
- Verifica que el `payment_id` sea correcto
- Asegúrate de que el pago exista en Mercado Pago 