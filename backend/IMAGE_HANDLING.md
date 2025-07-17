# Sistema de Manejo de Imágenes - BeltSpot

## Descripción General

Este sistema proporciona un manejo avanzado de imágenes para productos, incluyendo optimización automática, múltiples tamaños, y gestión eficiente de archivos.

## Características Principales

### ✅ Optimización Automática
- Compresión inteligente de imágenes
- Múltiples formatos soportados (JPEG, PNG, GIF, WebP)
- Eliminación de metadatos innecesarios
- Calidad configurable por formato

### ✅ Múltiples Tamaños
- **Thumbnail**: 300x300px (cuadrado)
- **Small**: 400x400px
- **Medium**: 600x600px
- **Large**: 1200x1200px
- **XLarge**: 1920x1920px

### ✅ Gestión Inteligente
- Nombres únicos para evitar conflictos
- Eliminación automática de versiones al borrar
- Cache de imágenes optimizadas
- Soporte para CDN

## Instalación

### 1. Instalar Intervention Image

```bash
composer require intervention/image
```

### 2. Publicar configuración (opcional)

```bash
php artisan vendor:publish --provider="Intervention\Image\ImageServiceProviderLaravelRecent"
```

### 3. Crear enlace simbólico

```bash
php artisan storage:link
```

## Configuración

### Variables de Entorno

Agrega estas variables a tu archivo `.env`:

```env
# Configuración de imágenes
IMAGE_DISK=public
IMAGE_BASE_PATH=products
IMAGE_OPTIMIZATION_ENABLED=true
IMAGE_CACHE_ENABLED=true
IMAGE_STRIP_METADATA=true
IMAGE_PROGRESSIVE_JPEG=true

# CDN (opcional)
IMAGE_CDN_ENABLED=false
IMAGE_CDN_URL=

# Watermark (opcional)
IMAGE_WATERMARK_ENABLED=false
IMAGE_WATERMARK_PATH=watermarks/logo.png
```

## Uso

### En el Modelo Product

```php
// Obtener imagen principal
$product->main_image; // URL de la imagen original

// Obtener thumbnail
$product->thumbnail; // URL de la versión 300x300

// Obtener imagen mediana
$product->medium_image; // URL de la versión 600x600

// Obtener todas las versiones
$product->all_images; // Array con todas las URLs
```

### En el Controlador

```php
use App\Services\ImageService;

class ProductController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function store(Request $request)
    {
        // Procesar imágenes automáticamente
        if ($request->hasFile('images')) {
            $validated['images'] = $this->imageService->processProductImages($request->file('images'));
        }
    }
}
```

### En el Frontend

```javascript
// Ejemplo de uso en React
const ProductCard = ({ product }) => {
    return (
        <div>
            <img 
                src={product.thumbnail} 
                alt={product.name}
                loading="lazy"
            />
        </div>
    );
};
```

## Comandos Artisan

### Optimizar Imágenes Existentes

```bash
# Optimizar todas las imágenes
php artisan images:optimize --all

# Optimizar un producto específico
php artisan images:optimize --product-id=1
```

## API Endpoints

### Subir Imágenes

```http
POST /api/products
Content-Type: multipart/form-data

{
    "name": "Producto",
    "price": 99.99,
    "images": [file1, file2, file3]
}
```

### Respuesta

```json
{
    "success": true,
    "data": {
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
}
```

## Estructura de Archivos

```
storage/app/public/products/
├── abc123.jpg              # Original
├── abc123_thumb.jpg        # 300x300
├── abc123_small.jpg        # 400x400
├── abc123_medium.jpg       # 600x600
├── abc123_large.jpg        # 1200x1200
└── abc123_xlarge.jpg       # 1920x1920
```

## Optimización de Rendimiento

### 1. Lazy Loading

```html
<img src="product.jpg" loading="lazy" alt="Producto">
```

### 2. Responsive Images

```html
<img 
    src="product_medium.jpg"
    srcset="
        product_thumb.jpg 300w,
        product_small.jpg 400w,
        product_medium.jpg 600w,
        product_large.jpg 1200w
    "
    sizes="(max-width: 600px) 300px, (max-width: 1200px) 600px, 1200px"
    alt="Producto"
>
```

### 3. WebP Support

```html
<picture>
    <source srcset="product.webp" type="image/webp">
    <img src="product.jpg" alt="Producto">
</picture>
```

## Configuración Avanzada

### Personalizar Tamaños

Edita `config/images.php`:

```php
'sizes' => [
    'custom' => [
        'width' => 800,
        'height' => 600,
        'fit' => false,
    ],
],
```

### Agregar Watermark

```php
// En ImageService
private function addWatermark($image)
{
    if (config('images.watermark.enabled')) {
        $watermark = Image::make(config('images.watermark.image'));
        $image->insert($watermark, config('images.watermark.position'));
    }
}
```

## Monitoreo y Mantenimiento

### Verificar Espacio en Disco

```bash
du -sh storage/app/public/products/
```

### Limpiar Imágenes Huérfanas

```bash
# Crear comando personalizado
php artisan make:command CleanOrphanImages
```

### Backup de Imágenes

```bash
# Backup automático
rsync -av storage/app/public/products/ backup/products/
```

## Troubleshooting

### Error: "GD Library not available"

```bash
# Ubuntu/Debian
sudo apt-get install php-gd

# CentOS/RHEL
sudo yum install php-gd

# macOS
brew install php@8.1
```

### Error: "Storage link not created"

```bash
php artisan storage:link
```

### Imágenes no se cargan

1. Verificar permisos: `chmod -R 755 storage/`
2. Verificar enlace simbólico: `ls -la public/storage`
3. Verificar configuración de disco en `config/filesystems.php`

## Mejores Prácticas

1. **Siempre usar lazy loading** para imágenes
2. **Optimizar antes de subir** cuando sea posible
3. **Usar formatos modernos** como WebP
4. **Implementar cache** para imágenes frecuentemente accedidas
5. **Monitorear el uso de espacio** en disco
6. **Hacer backups regulares** de las imágenes
7. **Usar CDN** para producción

## Soporte

Para problemas o preguntas sobre el sistema de imágenes:

1. Revisar logs: `tail -f storage/logs/laravel.log`
2. Verificar configuración: `php artisan config:cache`
3. Limpiar cache: `php artisan cache:clear` 