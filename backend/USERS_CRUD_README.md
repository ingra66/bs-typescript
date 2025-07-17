# CRUD de Usuarios - Documentación Completa

## 📋 Descripción General

El sistema de administración de usuarios proporciona un CRUD completo con validaciones robustas, logging de auditoría, protección contra eliminación de usuarios críticos y herramientas de mantenimiento.

## 🏗️ Arquitectura

### Backend
- **Controlador**: `AdminUserController.php` - Controlador específico para administración
- **Modelo**: `User.php` - Modelo con relaciones y validaciones
- **Middleware**: `AdminMiddleware.php` - Protección de rutas para administradores
- **Comando**: `CleanupUsersCommand.php` - Herramienta de limpieza y mantenimiento

### Frontend
- **Servicio**: `userService.ts` - Cliente API con manejo de errores
- **Página**: `Customers.tsx` - Interfaz de administración completa
- **Tipos**: Interfaces TypeScript para type safety

## 🔐 Seguridad

### Protecciones Implementadas

1. **Middleware de Admin**
   - Verifica autenticación
   - Valida permisos de administrador
   - Retorna errores apropiados (401/403)

2. **Validaciones de Eliminación**
   - Previene eliminación del propio usuario
   - Protege contra eliminación del último admin
   - Verifica órdenes asociadas antes de eliminar

3. **Logging de Auditoría**
   - Registra todas las operaciones CRUD
   - Incluye ID del admin y cambios realizados
   - Facilita auditoría y debugging

## 📊 Funcionalidades

### 1. Listado de Usuarios
```php
GET /api/v1/admin/users
```

**Parámetros de consulta:**
- `search`: Búsqueda por nombre o email
- `is_admin`: Filtrar por tipo de usuario
- `email_verified`: Filtrar por verificación de email
- `order_by`: Campo de ordenamiento
- `order_direction`: Dirección (asc/desc)
- `per_page`: Elementos por página
- `page`: Número de página

**Respuesta:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 50
  }
}
```

### 2. Crear Usuario
```php
POST /api/v1/admin/users
```

**Validaciones:**
- Nombre requerido (máx 255 caracteres)
- Email único y válido
- Contraseña mínima 8 caracteres
- Confirmación de contraseña

**Ejemplo:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "is_admin": false
}
```

### 3. Actualizar Usuario
```php
PUT /api/v1/admin/users/{id}
```

**Características:**
- Actualización parcial (solo campos enviados)
- Validación de email único (excluyendo el usuario actual)
- Contraseña opcional (solo si se envía)
- Logging de cambios realizados

### 4. Eliminar Usuario
```php
DELETE /api/v1/admin/users/{id}
```

**Protecciones:**
- No permite eliminar al propio usuario
- Previene eliminación del último administrador
- Verifica órdenes asociadas
- Proporciona información detallada de errores

### 5. Estadísticas de Usuario
```php
GET /api/v1/admin/users/{id}/statistics
```

**Datos incluidos:**
- Total de órdenes
- Monto total gastado
- Promedio por orden
- Última orden
- Órdenes por estado

### 6. Estadísticas Generales
```php
GET /api/v1/admin/users/statistics
```

**Métricas:**
- Total de usuarios
- Nuevos usuarios este mes
- Usuarios con email verificado
- Usuarios administradores
- Usuarios con órdenes

## 🛠️ Herramientas de Mantenimiento

### Comando de Limpieza
```bash
# Modo dry-run (solo verificar)
php artisan users:cleanup --dry-run

# Aplicar limpieza
php artisan users:cleanup
```

**Funciones del comando:**
1. Elimina usuarios sin email
2. Resuelve usuarios duplicados (mantiene el más reciente)
3. Elimina órdenes huérfanas
4. Verifica integridad de datos
5. Genera estadísticas finales

## 🎨 Frontend

### Características de la Interfaz

1. **Dashboard con Estadísticas**
   - Cards con métricas principales
   - Actualización automática

2. **Filtros Avanzados**
   - Búsqueda por nombre/email
   - Filtro por tipo de usuario
   - Filtro por verificación de email

3. **Tabla Interactiva**
   - Ordenamiento por columnas
   - Paginación
   - Acciones por usuario

4. **Formularios Validados**
   - Validación en tiempo real
   - Mensajes de error específicos
   - Confirmación de contraseñas

5. **Modales de Acción**
   - Crear usuario
   - Editar usuario
   - Ver estadísticas
   - Confirmar eliminación

### Estados de Carga
- Loading spinners
- Botones deshabilitados durante operaciones
- Feedback visual inmediato

### Manejo de Errores
- Mensajes específicos por tipo de error
- Snackbars para notificaciones
- Validación de formularios
- Reintentos automáticos

## 🔧 Configuración

### Variables de Entorno
```env
# Configuración de logging
LOG_CHANNEL=daily
LOG_LEVEL=info

# Configuración de paginación
DEFAULT_PAGINATION=10
MAX_PAGINATION=100
```

### Middleware
El middleware `admin` debe estar registrado en `bootstrap/app.php`:
```php
'admin' => \App\Http\Middleware\AdminMiddleware::class,
```

## 📝 Logs de Auditoría

### Eventos Registrados
- Creación de usuarios
- Actualización de usuarios
- Eliminación de usuarios
- Acceso a estadísticas
- Errores de validación
- Intentos de eliminación protegida

### Formato de Logs
```php
Log::info('Admin user created', [
    'admin_id' => auth()->id(),
    'user_id' => $user->id,
    'user_email' => $user->email,
    'is_admin' => $user->is_admin,
]);
```

## 🚀 Mejoras Implementadas

### Backend
1. ✅ Controlador específico para admin
2. ✅ Validaciones robustas
3. ✅ Protección contra eliminación crítica
4. ✅ Logging completo de auditoría
5. ✅ Manejo de errores detallado
6. ✅ Comando de limpieza y mantenimiento
7. ✅ Estadísticas avanzadas

### Frontend
1. ✅ Interfaz moderna y responsive
2. ✅ Validación en tiempo real
3. ✅ Manejo de errores mejorado
4. ✅ Feedback visual inmediato
5. ✅ Filtros y búsqueda avanzados
6. ✅ Estadísticas visuales
7. ✅ Confirmaciones de seguridad

## 🔍 Troubleshooting

### Problemas Comunes

1. **Error 403 - Acceso Denegado**
   - Verificar que el usuario sea admin
   - Revisar middleware de autenticación

2. **Error al eliminar usuario**
   - Verificar órdenes asociadas
   - Confirmar que no es el último admin

3. **Problemas de validación**
   - Revisar formato de email
   - Verificar longitud de contraseña
   - Confirmar que las contraseñas coinciden

### Comandos Útiles
```bash
# Verificar usuarios
php artisan tinker
>>> App\Models\User::count()

# Limpiar datos
php artisan users:cleanup --dry-run

# Ver logs
tail -f storage/logs/laravel.log
```

## 📈 Métricas de Rendimiento

### Optimizaciones Implementadas
- Consultas optimizadas con eager loading
- Paginación eficiente
- Índices en base de datos
- Caché de estadísticas

### Monitoreo
- Logs de rendimiento
- Métricas de uso
- Alertas de errores
- Auditoría de acciones

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024  
**Mantenido por**: Equipo de Desarrollo 