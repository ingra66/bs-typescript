# Verificación de Conectividad con el Backend

Este documento describe cómo verificar que el frontend esté consumiendo correctamente el backend de Laravel.

## 🔍 Herramientas de Verificación

### 1. Tester de API
Accede a `/debug/api` en el frontend para ejecutar pruebas automáticas de conectividad.

### 2. Indicador de Estado
El header muestra un indicador de conexión que verifica automáticamente el estado del backend.

## 🚀 Pasos para Verificar

### 1. Verificar que el Backend esté Corriendo

```bash
# En el directorio backend
cd backend

# Instalar dependencias si no están instaladas
composer install

# Ejecutar migraciones
php artisan migrate

# Ejecutar seeders
php artisan db:seed

# Iniciar el servidor
php artisan serve
```

### 2. Verificar Endpoints Públicos

Los siguientes endpoints deben responder correctamente:

- `GET /api/v1/categories` - Lista de categorías
- `GET /api/v1/products` - Lista de productos
- `GET /api/v1/categories/navigation` - Navegación de categorías

### 3. Verificar Autenticación

Los endpoints de autenticación deben funcionar:

- `POST /api/v1/login` - Inicio de sesión
- `POST /api/v1/register` - Registro
- `POST /api/v1/logout` - Cerrar sesión
- `GET /api/v1/user` - Obtener usuario actual

## 🔧 Configuración de CORS

El backend debe tener CORS configurado correctamente:

```php
// config/cors.php
'supports_credentials' => true,
'allowed_origins' => ['*'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

## 🧪 Pruebas Automáticas

### Usando el Tester de API

1. Navega a `http://localhost:5173/debug/api`
2. Haz clic en "Ejecutar Pruebas"
3. Revisa los resultados:

- ✅ **Salud del Backend**: Verifica conectividad básica
- ✅ **Endpoints Públicos**: Prueba categorías y productos
- ✅ **Prueba de Autenticación**: Login, obtener usuario, logout
- ✅ **Conexión de API**: Prueba completa con axios

### Usando la Consola del Navegador

Abre las herramientas de desarrollador y ejecuta:

```javascript
// Probar conectividad básica
fetch('http://localhost:8000/api/v1/categories')
  .then(res => res.json())
  .then(data => console.log('✅ Backend responde:', data))
  .catch(err => console.error('❌ Error:', err));

// Probar autenticación
fetch('http://localhost:8000/api/v1/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@beltspot.com',
    password: 'password'
  })
})
.then(res => res.json())
.then(data => console.log('✅ Login exitoso:', data))
.catch(err => console.error('❌ Error de login:', err));
```

## 🐛 Solución de Problemas

### Error: "Backend no responde"

**Causas posibles:**
1. El servidor Laravel no está corriendo
2. Puerto 8000 ocupado
3. Problemas de firewall

**Soluciones:**
```bash
# Verificar si el puerto está ocupado
netstat -an | grep 8000

# Cambiar puerto si es necesario
php artisan serve --port=8001

# Verificar logs de Laravel
tail -f storage/logs/laravel.log
```

### Error: "CORS policy"

**Causas posibles:**
1. CORS mal configurado
2. Headers incorrectos

**Soluciones:**
```bash
# Limpiar caché de configuración
php artisan config:clear
php artisan cache:clear

# Verificar configuración de CORS
php artisan config:show cors
```

### Error: "Unauthorized"

**Causas posibles:**
1. Token inválido
2. Middleware de autenticación
3. Usuario no existe

**Soluciones:**
```bash
# Verificar usuarios en la base de datos
php artisan tinker
>>> App\Models\User::all();

# Ejecutar seeders
php artisan db:seed --class=UserSeeder
```

## 📊 Monitoreo en Tiempo Real

### Indicador de Estado
El header muestra automáticamente:
- 🟢 **Online**: Backend responde correctamente
- 🔴 **Offline**: Backend no responde
- ⚪ **Conectando...**: Verificando estado

### Logs de Desarrollo
Revisa la consola del navegador para:
- Errores de red
- Respuestas de la API
- Problemas de autenticación

## 🔄 Verificación Continua

El sistema verifica automáticamente:
- Cada 30 segundos el estado del backend
- Al cargar la aplicación
- Antes de operaciones críticas

## 📝 Checklist de Verificación

- [ ] Servidor Laravel corriendo en puerto 8000
- [ ] Base de datos configurada y migrada
- [ ] Seeders ejecutados
- [ ] CORS configurado correctamente
- [ ] Endpoints públicos responden
- [ ] Autenticación funciona
- [ ] Usuarios de prueba disponibles
- [ ] Frontend conecta correctamente

## 🆘 Comandos de Emergencia

```bash
# Reiniciar todo el stack
cd backend && php artisan serve &
cd frontend && npm run dev &

# Verificar estado completo
curl -X GET http://localhost:8000/api/v1/categories
curl -X POST http://localhost:8000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@beltspot.com","password":"password"}'
```

## 📞 Soporte

Si persisten los problemas:

1. Revisa los logs de Laravel: `storage/logs/laravel.log`
2. Verifica la consola del navegador
3. Usa el tester de API en `/debug/api`
4. Comprueba la configuración de red y firewall 