# Solución de Problemas de Build

## Problemas Comunes

### 1. Errores de TypeScript

#### Error: "React is declared but its value is never read"

**Solución:**
```bash
# Limpiar imports no utilizados
npm run clean

# O manualmente en cada archivo:
# Cambiar:
import React, { useState } from 'react';
# Por:
import { useState } from 'react';
```

#### Error: "No overload matches this call" en Grid

**Solución:**
```tsx
// Cambiar:
<Grid item xs={12} sm={6} md={4}>
// Por:
<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2 }}>
```

#### Error: "color='white' is not assignable"

**Solución:**
```tsx
// Cambiar:
<Icon color="white" />
// Por:
<Icon sx={{ color: 'white' }} />
```

### 2. Errores de Conexión

#### Error: "net::ERR_CONNECTION_REFUSED"

**Soluciones:**

1. **Verificar que el servidor esté corriendo:**
```bash
# Frontend
npm run dev

# Backend
php artisan serve
```

2. **Verificar puertos:**
```bash
# Frontend (puerto 5173)
http://localhost:5173

# Backend (puerto 8000)
http://localhost:8000
```

3. **Limpiar cache:**
```bash
# Frontend
npm run build:no-check
rm -rf node_modules/.vite

# Backend
php artisan cache:clear
php artisan config:clear
```

### 3. Errores de Dependencias

#### Error: "Cannot find module"

**Solución:**
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# O instalar dependencia específica
npm install react-dropzone
```

## Scripts Útiles

### Build sin verificación de tipos
```bash
npm run build:no-check
```

### Limpiar imports no utilizados
```bash
npm run clean
```

### Lint con configuración permisiva
```bash
npm run lint -- --fix
```

## Configuración de TypeScript

### tsconfig.app.json
```json
{
  "compilerOptions": {
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "strict": true
  }
}
```

## Comandos de Desarrollo

### Iniciar desarrollo
```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
php artisan serve
```

### Build para producción
```bash
# Frontend
npm run build:no-check

# Backend
php artisan config:cache
php artisan route:cache
```

## Troubleshooting Avanzado

### 1. Problemas de Hot Reload

```bash
# Limpiar cache de Vite
rm -rf node_modules/.vite
npm run dev
```

### 2. Problemas de MUI

```bash
# Reinstalar MUI
npm uninstall @mui/material @emotion/react @emotion/styled
npm install @mui/material @emotion/react @emotion/styled
```

### 3. Problemas de React Dropzone

```bash
# Reinstalar react-dropzone
npm uninstall react-dropzone
npm install react-dropzone
```

## Verificación de Configuración

### 1. Verificar Vite Config
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
})
```

### 2. Verificar API Config
```typescript
// src/config/api.ts
export const apiConfig = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  storageURL: import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage',
};
```

### 3. Verificar Variables de Entorno
```env
# .env
VITE_API_URL=http://localhost:8000/api
VITE_STORAGE_URL=http://localhost:8000/storage
```

## Logs de Debug

### Frontend
```bash
# Ver logs detallados
npm run dev -- --debug

# Ver build detallado
npm run build -- --debug
```

### Backend
```bash
# Ver logs de Laravel
tail -f storage/logs/laravel.log

# Ver logs de desarrollo
php artisan serve --verbose
```

## Contacto

Si los problemas persisten:

1. Verificar que todas las dependencias estén instaladas
2. Verificar que los puertos no estén ocupados
3. Verificar la configuración de red
4. Revisar logs de error específicos 