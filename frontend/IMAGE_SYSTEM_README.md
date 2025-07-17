# Sistema de Imágenes - Frontend

## Descripción

Este sistema proporciona componentes especializados para el manejo de imágenes en el panel de administrador, incluyendo subida con drag & drop, preview optimizado y visualización inteligente.

## Componentes

### 1. ImageUploader

Componente para subir imágenes con drag & drop y preview en tiempo real.

#### Props

```typescript
interface ImageUploaderProps {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
  maxFiles?: number; // Default: 10
  maxSize?: number; // Default: 5MB
  acceptedFormats?: string[]; // Default: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  showPreview?: boolean; // Default: true
  multiple?: boolean; // Default: true
}
```

#### Uso

```tsx
import ImageUploader from '../components/admin/ImageUploader';

const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);

<ImageUploader
  images={imageFiles}
  onImagesChange={setImageFiles}
  maxFiles={10}
  maxSize={5 * 1024 * 1024} // 5MB
  acceptedFormats={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
  showPreview={true}
  multiple={true}
/>
```

#### Características

- ✅ Drag & drop
- ✅ Preview en tiempo real
- ✅ Validación de archivos
- ✅ Barra de progreso
- ✅ Estados de carga
- ✅ Eliminación individual
- ✅ Límites configurables

### 2. ProductImageDisplay

Componente para mostrar imágenes de productos con diferentes tamaños y opciones.

#### Props

```typescript
interface ProductImageDisplayProps {
  images: string[] | ProductImage[];
  productName: string;
  showThumbnails?: boolean; // Default: true
  maxThumbnails?: number; // Default: 3
  size?: 'small' | 'medium' | 'large'; // Default: 'medium'
}
```

#### Uso

```tsx
import ProductImageDisplay from '../components/admin/ProductImageDisplay';

// Para lista de productos
<ProductImageDisplay
  images={product.images}
  productName={product.name}
  showThumbnails={false}
  size="small"
/>

// Para vista detallada
<ProductImageDisplay
  images={product.images}
  productName={product.name}
  showThumbnails={true}
  size="large"
  maxThumbnails={5}
/>
```

#### Características

- ✅ Múltiples tamaños (small, medium, large)
- ✅ Thumbnails opcionales
- ✅ Vista ampliada en modal
- ✅ Fallback a imagen original
- ✅ Badge con cantidad de imágenes
- ✅ Hover effects

## Integración con Backend

### 1. Subida de Imágenes

El backend procesa automáticamente las imágenes y crea versiones optimizadas:

```typescript
// En ProductForm.tsx
const handleSubmit = async (e: React.FormEvent) => {
  const submitData = {
    // ... otros campos
    images: imageFiles.map(img => img.file), // Solo los archivos File
  };
  
  await productService.createProduct(submitData);
};
```

### 2. Visualización de Imágenes

El backend devuelve URLs de imágenes optimizadas:

```typescript
// Respuesta del backend
{
  "id": 1,
  "name": "Producto",
  "images": [
    "products/abc123.jpg",
    "products/def456.jpg"
  ],
  "main_image": "http://domain.com/storage/products/abc123.jpg",
  "thumbnail": "http://domain.com/storage/products/abc123_thumb.jpg",
  "medium_image": "http://domain.com/storage/products/abc123_medium.jpg"
}
```

## Configuración

### Variables de Entorno

```env
# Frontend (.env)
VITE_API_URL=http://localhost:8000/api
VITE_STORAGE_URL=http://localhost:8000/storage
```

### Configuración de API

```typescript
// config/api.ts
export const apiConfig = {
  baseURL: import.meta.env.VITE_API_URL,
  storageURL: import.meta.env.VITE_STORAGE_URL,
};
```

## Mejores Prácticas

### 1. Optimización de Rendimiento

```tsx
// Usar lazy loading
<img 
  src={imageUrl} 
  loading="lazy" 
  alt={productName}
/>

// Usar srcset para responsive
<img 
  src={imageUrl}
  srcset={`
    ${thumbnailUrl} 300w,
    ${mediumUrl} 600w,
    ${largeUrl} 1200w
  `}
  sizes="(max-width: 600px) 300px, 600px"
  alt={productName}
/>
```

### 2. Manejo de Errores

```tsx
// Fallback para imágenes que no cargan
<img 
  src={imageUrl}
  onError={(e) => {
    const target = e.target as HTMLImageElement;
    target.src = '/images/default-product.jpg';
  }}
  alt={productName}
/>
```

### 3. Validación de Archivos

```tsx
const validateFile = (file: File) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (file.size > maxSize) {
    return 'El archivo es demasiado grande';
  }
  
  if (!allowedTypes.includes(file.type)) {
    return 'Formato no soportado';
  }
  
  return null;
};
```

## Estructura de Archivos

```
frontend/src/components/admin/
├── ImageUploader.tsx          # Componente de subida
├── ProductImageDisplay.tsx     # Componente de visualización
└── ProductForm.tsx            # Formulario actualizado

frontend/src/pages/admin/
└── Products.tsx               # Página actualizada
```

## Estados de Imágenes

### ImageFile Interface

```typescript
interface ImageFile {
  file: File;
  preview: string;
  status: 'uploading' | 'success' | 'error' | 'idle';
  progress?: number;
  error?: string;
}
```

### Estados Posibles

- **idle**: Imagen cargada, esperando procesamiento
- **uploading**: Subiendo al servidor
- **success**: Subida exitosa
- **error**: Error en la subida

## Ejemplos de Uso

### 1. Formulario de Producto

```tsx
import ImageUploader from './ImageUploader';

export default function ProductForm() {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);

  return (
    <form>
      {/* ... otros campos */}
      
      <ImageUploader
        images={imageFiles}
        onImagesChange={setImageFiles}
        maxFiles={10}
        maxSize={5 * 1024 * 1024}
      />
      
      {/* ... resto del formulario */}
    </form>
  );
}
```

### 2. Lista de Productos

```tsx
import ProductImageDisplay from './ProductImageDisplay';

export default function ProductsList() {
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <ProductImageDisplay
            images={product.images}
            productName={product.name}
            size="small"
            showThumbnails={false}
          />
          <h3>{product.name}</h3>
        </div>
      ))}
    </div>
  );
}
```

### 3. Vista Detallada

```tsx
export default function ProductDetail({ product }) {
  return (
    <div>
      <ProductImageDisplay
        images={product.images}
        productName={product.name}
        size="large"
        showThumbnails={true}
        maxThumbnails={5}
      />
      
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  );
}
```

## Troubleshooting

### Problemas Comunes

1. **Imágenes no se cargan**
   - Verificar que el backend esté corriendo
   - Verificar la configuración de storage link
   - Revisar permisos de archivos

2. **Drag & drop no funciona**
   - Verificar que react-dropzone esté instalado
   - Revisar la configuración del componente

3. **Preview no se muestra**
   - Verificar que el archivo sea una imagen válida
   - Revisar la configuración de tipos aceptados

### Debug

```tsx
// Agregar logs para debug
const handleImagesChange = (images: ImageFile[]) => {
  console.log('Images changed:', images);
  setImageFiles(images);
};
```

## Próximas Mejoras

- [ ] Soporte para WebP automático
- [ ] Compresión en el frontend
- [ ] Crop de imágenes
- [ ] Filtros de imagen
- [ ] Watermark automático
- [ ] CDN integration 