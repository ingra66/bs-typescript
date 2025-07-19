<?php

namespace App\Services;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class ImageService
{
    private $disk = 'public';
    private $basePath = 'products';
    private $imageManager;
    
    // Configuraciones de tamaños
    private $sizes = [
        'thumbnail' => [300, 300],
        'medium' => [600, 600],
        'large' => [1200, 1200],
    ];

    public function __construct()
    {
        $this->imageManager = new ImageManager(new Driver());
    }

    /**
     * Procesar y guardar imágenes de productos
     */
    public function processProductImages(array $images): array
    {
        $processedImages = [];
        
        foreach ($images as $image) {
            if ($image instanceof UploadedFile) {
                $processedImages[] = $this->processImage($image);
            }
        }
        
        return $processedImages;
    }

    /**
     * Procesar una imagen individual
     */
    public function processImage(UploadedFile $image): string
    {
        // Debug: Log image details
        \Log::info('Processing image', [
            'original_name' => $image->getClientOriginalName(),
            'size' => $image->getSize(),
            'mime_type' => $image->getMimeType(),
            'is_valid' => $image->isValid(),
        ]);

        // Verificar que el archivo sea válido
        if (!$image->isValid() || $image->getSize() <= 0) {
            \Log::error('Invalid image file provided');
            throw new \Exception('El archivo de imagen no es válido');
        }

        try {
            // Generar nombre único
            $filename = $this->generateUniqueFilename($image);
            $originalPath = $this->basePath . '/' . $filename;
            
            // Método alternativo: usar move() en lugar de storeAs()
            $destinationPath = storage_path('app/public/' . $this->basePath);
            
            // Crear directorio si no existe
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
                \Log::info('Created products directory: ' . $destinationPath);
            }
            
            $fullPath = $destinationPath . '/' . $filename;
            
            \Log::info('Attempting to move file', [
                'filename' => $filename,
                'destinationPath' => $destinationPath,
                'fullPath' => $fullPath,
            ]);
            
            // Mover archivo usando move()
            if ($image->move($destinationPath, $filename)) {
                \Log::info('Image moved successfully: ' . $originalPath);
                
                // Crear versiones optimizadas
                $this->createOptimizedVersions($originalPath);
                
                return $originalPath;
            } else {
                \Log::error('Failed to move image file');
                throw new \Exception('Error al mover la imagen');
            }
        } catch (\Exception $e) {
            \Log::error('Error processing image: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Crear versiones optimizadas de una imagen
     */
    private function createOptimizedVersions(string $originalPath): void
    {
        $originalFullPath = storage_path('app/public/' . $originalPath);
        
        if (!file_exists($originalFullPath)) {
            \Log::error('Original image not found: ' . $originalFullPath);
            return;
        }
        
        foreach ($this->sizes as $size => $dimensions) {
            $this->createOptimizedVersion($originalFullPath, $originalPath, $size, $dimensions);
        }
    }

    /**
     * Crear una versión optimizada específica
     */
    private function createOptimizedVersion(string $originalFullPath, string $originalPath, string $size, array $dimensions): void
    {
        try {
            $image = $this->imageManager->read($originalFullPath);
            
            // Aplicar transformaciones según el tamaño
            switch ($size) {
                case 'thumbnail':
                    $image->cover($dimensions[0], $dimensions[1]);
                    break;
                    
                case 'medium':
                case 'large':
                    $image->scaleDown($dimensions[0], $dimensions[1]);
                    break;
            }
            
            // Optimizar calidad
            $image->toJpeg(85);
            
            // Generar nombre del archivo optimizado
            $optimizedPath = $this->getOptimizedPath($originalPath, $size);
            
            // Método alternativo: usar putFileAs() o write directo
            $optimizedFullPath = storage_path('app/public/' . $optimizedPath);
            $optimizedDir = dirname($optimizedFullPath);
            
            // Crear directorio si no existe
            if (!file_exists($optimizedDir)) {
                mkdir($optimizedDir, 0755, true);
            }
            
            // Guardar versión optimizada directamente
            file_put_contents($optimizedFullPath, $image->encode());
            
            \Log::info('Optimized version created: ' . $optimizedPath);
            
        } catch (\Exception $e) {
            \Log::error("Error creating optimized version {$size}: " . $e->getMessage());
        }
    }

    /**
     * Obtener URL de imagen optimizada
     */
    public function getOptimizedUrl(string $originalPath, string $size = 'medium'): string
    {
        $optimizedPath = $this->getOptimizedPath($originalPath, $size);
        $optimizedFullPath = storage_path('app/public/' . $optimizedPath);
        
        if (file_exists($optimizedFullPath)) {
            return asset('storage/' . $optimizedPath);
        }
        
        // Si no existe la versión optimizada, crear en tiempo real
        return $this->createOptimizedUrlOnDemand($originalPath, $size);
    }

    /**
     * Crear URL optimizada bajo demanda
     */
    private function createOptimizedUrlOnDemand(string $originalPath, string $size): string
    {
        $originalFullPath = storage_path('app/public/' . $originalPath);
        
        if (!file_exists($originalFullPath)) {
            return asset('images/default-product.jpg');
        }
        
        $optimizedPath = $this->getOptimizedPath($originalPath, $size);
        $optimizedFullPath = storage_path('app/public/' . $optimizedPath);
        
        try {
            $image = $this->imageManager->read($originalFullPath);
            $dimensions = $this->sizes[$size] ?? [600, 600];
            
            if ($size === 'thumbnail') {
                $image->cover($dimensions[0], $dimensions[1]);
            } else {
                $image->scaleDown($dimensions[0], $dimensions[1]);
            }
            
            $image->toJpeg(85);
            
            // Crear directorio si no existe
            $optimizedDir = dirname($optimizedFullPath);
            if (!file_exists($optimizedDir)) {
                mkdir($optimizedDir, 0755, true);
            }
            
            // Guardar versión optimizada directamente
            file_put_contents($optimizedFullPath, $image->encode());
            
            return asset('storage/' . $optimizedPath);
            
        } catch (\Exception $e) {
            \Log::error("Error creating optimized URL: " . $e->getMessage());
            return asset('images/default-product.jpg');
        }
    }

    /**
     * Generar nombre único para archivo
     */
    private function generateUniqueFilename(UploadedFile $image): string
    {
        $extension = $image->getClientOriginalExtension();
        $filename = Str::random(40) . '.' . $extension;
        
        // Verificar que no exista usando método alternativo
        $fullPath = storage_path('app/public/' . $this->basePath . '/' . $filename);
        while (file_exists($fullPath)) {
            $filename = Str::random(40) . '.' . $extension;
            $fullPath = storage_path('app/public/' . $this->basePath . '/' . $filename);
        }
        
        return $filename;
    }

    /**
     * Obtener ruta de archivo optimizado
     */
    private function getOptimizedPath(string $originalPath, string $size): string
    {
        $pathInfo = pathinfo($originalPath);
        return $pathInfo['dirname'] . '/' . $pathInfo['filename'] . '_' . $size . '.jpg';
    }

    /**
     * Eliminar todas las versiones de una imagen
     */
    public function deleteImage(string $originalPath): void
    {
        // Eliminar imagen original
        $originalFullPath = storage_path('app/public/' . $originalPath);
        if (file_exists($originalFullPath)) {
            unlink($originalFullPath);
            \Log::info('Deleted original image: ' . $originalPath);
        }
        
        // Eliminar versiones optimizadas
        foreach (array_keys($this->sizes) as $size) {
            $optimizedPath = $this->getOptimizedPath($originalPath, $size);
            $optimizedFullPath = storage_path('app/public/' . $optimizedPath);
            
            if (file_exists($optimizedFullPath)) {
                unlink($optimizedFullPath);
                \Log::info('Deleted optimized image: ' . $optimizedPath);
            }
        }
    }

    /**
     * Obtener todas las URLs de una imagen
     */
    public function getAllImageUrls(string $originalPath): array
    {
        $urls = [
            'original' => asset('storage/' . $originalPath),
        ];
        
        foreach (array_keys($this->sizes) as $size) {
            $urls[$size] = $this->getOptimizedUrl($originalPath, $size);
        }
        
        return $urls;
    }

    /**
     * Optimizar imagen existente
     */
    public function optimizeExistingImage(string $originalPath): bool
    {
        if (!Storage::disk($this->disk)->exists($originalPath)) {
            return false;
        }
        
        try {
            $originalFullPath = Storage::disk($this->disk)->path($originalPath);
            $image = $this->imageManager->read($originalFullPath);
            
            // Optimizar calidad
            $image->toJpeg(85);
            
            // Guardar versión optimizada
            Storage::disk($this->disk)->put($originalPath, $image->encode());
            
            // Crear versiones optimizadas
            $this->createOptimizedVersions($originalPath);
            
            return true;
        } catch (\Exception $e) {
            \Log::error("Error optimizing existing image: " . $e->getMessage());
            return false;
        }
    }
} 