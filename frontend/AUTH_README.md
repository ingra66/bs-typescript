# Sistema de Autenticación - BeltSpot

Este documento describe el sistema de autenticación implementado en el frontend de BeltSpot.

## Características

- ✅ Login y registro de usuarios
- ✅ Protección de rutas
- ✅ Persistencia de sesión con localStorage
- ✅ Validación de formularios
- ✅ Notificaciones con toast
- ✅ Interfaz responsive
- ✅ Integración con API REST de Laravel

## Usuarios de Prueba

El sistema incluye usuarios de prueba predefinidos:

### Administrador
- **Email:** admin@beltspot.com
- **Contraseña:** password
- **Rol:** Administrador

### Usuario Normal
- **Email:** user@beltspot.com
- **Contraseña:** password
- **Rol:** Usuario

## Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Ejecutar el servidor de desarrollo:**
```bash
npm run dev
```

## Estructura del Sistema

### Componentes de Autenticación

- `LoginForm.tsx` - Formulario de inicio de sesión
- `RegisterForm.tsx` - Formulario de registro
- `UserProfile.tsx` - Perfil del usuario
- `ProtectedRoute.tsx` - Protección de rutas
- `AuthInitializer.tsx` - Inicialización del estado de auth

### Servicios

- `authService.ts` - Servicio para llamadas a la API
- `api.ts` - Configuración de axios con interceptores

### Estado Global

- `authStore.ts` - Store de Zustand para manejo de estado
- `types/auth.ts` - Tipos TypeScript para autenticación

## Rutas

- `/login` - Página de inicio de sesión
- `/register` - Página de registro
- `/profile` - Perfil del usuario (protegida)

## API Endpoints

El sistema se conecta a los siguientes endpoints del backend:

- `POST /api/v1/login` - Inicio de sesión
- `POST /api/v1/register` - Registro de usuario
- `POST /api/v1/logout` - Cerrar sesión
- `GET /api/v1/user` - Obtener usuario actual

## Funcionalidades

### Login
- Validación de campos en tiempo real
- Mostrar/ocultar contraseña
- Manejo de errores de la API
- Redirección automática después del login

### Registro
- Validación completa de formulario
- Confirmación de contraseña
- Validación de fortaleza de contraseña
- Verificación de email único

### Perfil de Usuario
- Información personal del usuario
- Estado de la cuenta
- Botón de cerrar sesión
- Diseño responsive

### Protección de Rutas
- Redirección automática a login si no está autenticado
- Protección de rutas de administrador
- Persistencia de la ubicación para redirección post-login

## Estado de Autenticación

El sistema maneja el estado de autenticación de forma global usando Zustand:

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

## Persistencia

- Token almacenado en localStorage
- Información del usuario en localStorage
- Verificación automática de token al cargar la app
- Limpieza automática de datos inválidos

## Notificaciones

El sistema usa react-hot-toast para mostrar notificaciones:
- Éxito en login/registro
- Errores de validación
- Errores de la API
- Confirmación de logout

## Estilos

Los componentes usan Tailwind CSS con un tema oscuro que coincide con el diseño de BeltSpot:
- Gradientes azules para el fondo
- Efectos de glassmorphism
- Animaciones suaves
- Diseño responsive

## Seguridad

- Tokens JWT para autenticación
- Interceptores de axios para manejo automático de tokens
- Validación de formularios en frontend y backend
- Limpieza automática de tokens expirados

## Desarrollo

Para agregar nuevas funcionalidades:

1. **Nuevas rutas protegidas:** Usar el componente `ProtectedRoute`
2. **Nuevos endpoints:** Agregar métodos en `authService.ts`
3. **Nuevos tipos:** Extender `types/auth.ts`
4. **Nuevos componentes:** Seguir la estructura existente

## Troubleshooting

### Problemas Comunes

1. **Error de CORS:** Verificar que el backend esté configurado correctamente
2. **Token no válido:** El sistema limpia automáticamente tokens expirados
3. **Errores de validación:** Revisar los mensajes en el formulario

### Debug

- Revisar la consola del navegador para errores
- Verificar el localStorage para el estado de autenticación
- Comprobar las llamadas a la API en la pestaña Network 