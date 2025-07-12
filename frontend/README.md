# Frontend - MiTienda

Este es el frontend de la aplicación MiTienda, construido con React, TypeScript, Tailwind CSS y ShadCN/UI.

## 🚀 Características

- **React 19** con TypeScript
- **Tailwind CSS** para estilos
- **ShadCN/UI** para componentes
- **Lucide React** para iconos
- **Vite** como bundler
- **Estructura modular** con componentes reutilizables

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── ui/              # Componentes base de ShadCN/UI
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── layout/          # Componentes de layout
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── home/            # Componentes específicos de Home
│   │   └── Hero.tsx
│   ├── products/        # Componentes de productos
│   │   ├── ProductCard.tsx
│   │   └── ProductGrid.tsx
│   └── categories/      # Componentes de categorías
│       └── CategoryCard.tsx
├── pages/               # Páginas de la aplicación
│   └── Home.tsx
├── lib/                 # Utilidades
│   └── utils.ts
└── App.tsx             # Componente principal
```

## 🛠️ Instalación y Ejecución

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# Navegar al directorio frontend
cd frontend

# Instalar dependencias
npm install
```

### Desarrollo

```bash
# Ejecutar en modo desarrollo
npm run dev
```

El servidor se ejecutará en `http://localhost:5173`

### Build

```bash
# Construir para producción
npm run build

# Preview del build
npm run preview
```

## 🎨 Componentes Creados

### Layout Components

- **Header**: Navegación principal con logo, menú, búsqueda y acciones de usuario
- **Footer**: Pie de página con enlaces, información de contacto y redes sociales

### Home Components

- **Hero**: Sección principal con call-to-action y estadísticas
- **ProductGrid**: Grilla de productos con estados de carga y vacío
- **ProductCard**: Tarjeta individual de producto con:
  - Imagen con hover effects
  - Información de precio y descuento
  - Rating y reviews
  - Botones de carrito y wishlist
  - Estado de stock

### UI Components

- **Button**: Botón reutilizable con variantes (default, outline, ghost, etc.)
- **Card**: Contenedor de tarjeta con header, content y footer

## 🔧 Configuración

### TypeScript
- Path aliases configurados (`@/*` apunta a `src/*`)
- Configuración estricta habilitada

### Tailwind CSS
- Variables CSS personalizadas para temas
- Configuración de colores y bordes redondeados
- Soporte para modo oscuro

### ShadCN/UI
- Componentes base instalados
- Sistema de variantes con class-variance-authority
- Utilidades con clsx y tailwind-merge

## 📱 Responsive Design

Todos los componentes están diseñados para ser completamente responsivos:

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: sm, md, lg, xl
- **Grid System**: Grids adaptativos para productos y categorías
- **Flexible Layouts**: Headers y footers que se adaptan

## 🎯 Funcionalidades Implementadas

### Home Page
- ✅ Header con navegación y carrito
- ✅ Hero section con call-to-action
- ✅ Grid de categorías con hover effects
- ✅ Productos destacados con loading states
- ✅ Ofertas especiales con descuentos
- ✅ Footer completo con enlaces

### Interactividad
- ✅ Estados de hover en todos los elementos
- ✅ Loading states para productos
- ✅ Contador de carrito funcional
- ✅ Handlers para todas las acciones (console.log por ahora)

### Estilos
- ✅ Diseño moderno y limpio
- ✅ Gradientes y efectos visuales
- ✅ Animaciones suaves
- ✅ Iconos de Lucide React
- ✅ Colores consistentes

## 🔄 Próximos Pasos

1. **Integración con Backend**: Conectar con las APIs de Laravel
2. **Routing**: Implementar React Router para navegación
3. **State Management**: Agregar Zustand o Redux
4. **Autenticación**: Implementar login/registro
5. **Carrito**: Funcionalidad completa del carrito
6. **Filtros**: Búsqueda y filtros de productos
7. **Detalle de Producto**: Página individual de producto
8. **Checkout**: Proceso de compra

## 🎨 Personalización

### Colores
Los colores se pueden personalizar en `tailwind.config.js` y `src/index.css`

### Componentes
Todos los componentes son reutilizables y se pueden modificar fácilmente

### Datos
Los datos de ejemplo están en `src/pages/Home.tsx` y se pueden reemplazar con datos reales del backend

## 📝 Notas

- Los handlers actualmente solo hacen `console.log` - se conectarán con el backend
- Las imágenes usan Unsplash como placeholder
- El diseño es completamente responsive
- Todos los componentes tienen TypeScript tipado
