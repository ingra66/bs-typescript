# Comandos de Desarrollo - Frontend

## Comandos Principales

### Desarrollo
```bash
# Iniciar servidor de desarrollo
npm run dev

# Build sin verificación de tipos
npm run build:no-check

# Build sin linting
npm run build:no-lint

# Preview del build
npm run preview
```

### Linting y Limpieza
```bash
# Lint con errores
npm run lint

# Lint con auto-fix
npm run lint:fix

# Limpiar imports no utilizados
npm run clean
```

## Solución de Problemas

### 1. Errores de Build
```bash
# Si hay errores de TypeScript
npm run build:no-check

# Si hay errores de linting
npm run build:no-lint
```

### 2. Errores de Conexión
```bash
# Limpiar cache
rm -rf node_modules/.vite
npm run dev
```

### 3. Errores de Dependencias
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## Configuración de Desarrollo

### Variables de Entorno
```env
# .env
VITE_API_URL=http://localhost:8000/api
VITE_STORAGE_URL=http://localhost:8000/storage
```

### TypeScript Config
```json
// tsconfig.app.json
{
  "compilerOptions": {
    "noUnusedLocals": false,
    "noUnusedParameters": false
  }
}
```

### ESLint Config
```js
// .eslintrc.cjs
{
  "rules": {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

## Workflow de Desarrollo

### 1. Iniciar Proyecto
```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
php artisan serve
```

### 2. Desarrollo Diario
```bash
# Antes de commit
npm run lint:fix
npm run build:no-check
```

### 3. Build para Producción
```bash
npm run build:no-lint
```

## Troubleshooting

### Error: "Cannot find module"
```bash
npm install
npm run dev
```

### Error: "Port already in use"
```bash
# Cambiar puerto en vite.config.ts
server: {
  port: 5174
}
```

### Error: "ESLint errors"
```bash
npm run lint:fix
```

### Error: "TypeScript errors"
```bash
npm run build:no-check
```

## Comandos Útiles

### Verificar Estado
```bash
# Verificar dependencias
npm list --depth=0

# Verificar TypeScript
npx tsc --noEmit

# Verificar ESLint
npx eslint src --ext .ts,.tsx
```

### Limpieza
```bash
# Limpiar cache
npm run clean

# Limpiar build
rm -rf dist

# Limpiar node_modules
rm -rf node_modules package-lock.json
npm install
```

## Notas Importantes

1. **Usar `npm run build:no-check`** para desarrollo
2. **Usar `npm run build:no-lint`** para producción
3. **Los warnings no impiden el build**
4. **Los errores críticos sí impiden el build**
5. **Siempre verificar antes de commit**

## Contacto

Para problemas específicos:
1. Revisar logs de error
2. Verificar configuración
3. Reinstalar dependencias si es necesario 