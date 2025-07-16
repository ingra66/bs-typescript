# Configuración de MercadoPago - Backend

## Variables de Entorno Requeridas

Crea un archivo `.env` en el directorio `backend/` con las siguientes variables:

```env
# MercadoPago Configuration
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MERCADOPAGO_ENVIRONMENT=sandbox
MERCADOPAGO_WEBHOOK_URL=http://localhost:8000/api/webhook/mercadopago
MERCADOPAGO_NOTIFICATION_URL=http://localhost:8000/api/webhook/mercadopago

# URLs del Frontend
APP_FRONTEND_URL=http://localhost:5173
```

## Obtener Credenciales de MercadoPago

1. Ve a [MercadoPago Developers](https://www.mercadopago.com.ar/developers)
2. Crea una cuenta o inicia sesión
3. Ve a "Tus integraciones"
4. Crea una nueva aplicación
5. Copia las credenciales de prueba (TEST)

## Credenciales de Prueba

Para desarrollo, usa estas credenciales de prueba:

```env
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## Verificar Configuración

1. Asegúrate de que el archivo `.env` existe en `backend/`
2. Ejecuta `php artisan config:cache` para limpiar la caché
3. Verifica que las variables estén disponibles con `php artisan tinker`:
   ```php
   config('services.mercadopago.access_token')
   ```

## Solución de Problemas

### Error 500 en create-preference
- Verifica que las credenciales de MercadoPago estén correctas
- Asegúrate de que el archivo `.env` esté en el directorio correcto
- Ejecuta `php artisan config:clear` para limpiar la caché

### Error de conexión
- Verifica que el backend esté corriendo en `http://localhost:8000`
- Asegúrate de que CORS esté configurado correctamente

### Error de autenticación
- Verifica que el usuario esté autenticado
- Revisa que el token de autenticación sea válido 