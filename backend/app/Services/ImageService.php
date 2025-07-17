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
        // Generar nombre único
        $filename = $this->generateUniqueFilename($image);
        $originalPath = $this->basePath . '/' . $filename;
        
        // Guardar imagen original
        $image->storeAs($this->basePath, $filename, $this->disk);
        
        // Crear versiones optimizadas
        $this->createOptimizedVersions($originalPath);
        
        return $originalPath;
    }

    /**
     * Crear versiones optimizadas de una imagen
     */
    private function createOptimizedVersions(string $originalPath): void
    {
        $originalFullPath = Storage::disk($this->disk)->path($originalPath);
        
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
            
            // Guardar versión optimizada
            Storage::disk($this->disk)->put($optimizedPath, $image->encode());
            
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
        
        if (Storage::disk($this->disk)->exists($optimizedPath)) {
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
        if (!Storage::disk($this->disk)->exists($originalPath)) {
            return asset('images/default-product.jpg');
        }
        
        $originalFullPath = Storage::disk($this->disk)->path($originalPath);
        $optimizedPath = $this->getOptimizedPath($originalPath, $size);
        
        try {
            $image = $this->imageManager->read($originalFullPath);
            $dimensions = $this->sizes[$size] ?? [600, 600];
            
            if ($size === 'thumbnail') {
                $image->cover($dimensions[0], $dimensions[1]);
            } else {
                $image->scaleDown($dimensions[0], $dimensions[1]);
            }
            
            $image->toJpeg(85);
            Storage::disk($this->disk)->put($optimizedPath, $image->encode());
            
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
        
        // Verificar que no exista
        while (Storage::disk($this->disk)->exists($this->basePath . '/' . $filename)) {
            $filename = Str::random(40) . '.' . $extension;
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
        if (Storage::disk($this->disk)->exists($originalPath)) {
            Storage::disk($this->disk)->delete($originalPath);
        }
        
        // Eliminar versiones optimizadas
        foreach (array_keys($this->sizes) as $size) {
            $optimizedPath = $this->getOptimizedPath($originalPath, $size);
            if (Storage::disk($this->disk)->exists($optimizedPath)) {
                Storage::disk($this->disk)->delete($optimizedPath);
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