<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Configuración de Imágenes
    |--------------------------------------------------------------------------
    |
    | Aquí puedes configurar las opciones para el manejo de imágenes
    | en tu aplicación.
    |
    */

    'disk' => env('IMAGE_DISK', 'public'),
    
    'base_path' => env('IMAGE_BASE_PATH', 'products'),
    
    /*
    |--------------------------------------------------------------------------
    | Tamaños de Imágenes
    |--------------------------------------------------------------------------
    |
    | Define los diferentes tamaños que se generarán automáticamente
    | para cada imagen subida.
    |
    */
    'sizes' => [
        'thumbnail' => [
            'width' => 300,
            'height' => 300,
            'fit' => true, // Usar fit en lugar de resize
        ],
        'small' => [
            'width' => 400,
            'height' => 400,
            'fit' => false,
        ],
        'medium' => [
            'width' => 600,
            'height' => 600,
            'fit' => false,
        ],
        'large' => [
            'width' => 1200,
            'height' => 1200,
            'fit' => false,
        ],
        'xlarge' => [
            'width' => 1920,
            'height' => 1920,
            'fit' => false,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Calidad de Compresión
    |--------------------------------------------------------------------------
    |
    | Define la calidad de compresión para las imágenes optimizadas.
    | Valores entre 0 y 100, donde 100 es la mejor calidad.
    |
    */
    'quality' => [
        'jpeg' => 85,
        'png' => 8, // 0-9, donde 9 es la mejor compresión
        'webp' => 85,
    ],

    /*
    |--------------------------------------------------------------------------
    | Formatos Soportados
    |--------------------------------------------------------------------------
    |
    | Define los formatos de imagen que se pueden procesar.
    |
    */
    'allowed_formats' => [
        'jpeg',
        'jpg',
        'png',
        'gif',
        'webp',
    ],

    /*
    |--------------------------------------------------------------------------
    | Tamaño Máximo de Archivo
    |--------------------------------------------------------------------------
    |
    | Tamaño máximo en bytes para las imágenes subidas.
    |
    */
    'max_file_size' => 5 * 1024 * 1024, // 5MB

    /*
    |--------------------------------------------------------------------------
    | Configuración de Watermark
    |--------------------------------------------------------------------------
    |
    | Configuración para agregar marcas de agua a las imágenes.
    |
    */
    'watermark' => [
        'enabled' => env('IMAGE_WATERMARK_ENABLED', false),
        'image' => env('IMAGE_WATERMARK_PATH', 'watermarks/logo.png'),
        'position' => 'bottom-right', // top-left, top-right, bottom-left, bottom-right, center
        'opacity' => 0.3, // 0.0 a 1.0
    ],

    /*
    |--------------------------------------------------------------------------
    | Configuración de Cache
    |--------------------------------------------------------------------------
    |
    | Configuración para el cache de imágenes optimizadas.
    |
    */
    'cache' => [
        'enabled' => env('IMAGE_CACHE_ENABLED', true),
        'ttl' => env('IMAGE_CACHE_TTL', 86400), // 24 horas en segundos
    ],

    /*
    |--------------------------------------------------------------------------
    | Configuración de CDN
    |--------------------------------------------------------------------------
    |
    | Configuración para usar CDN en las URLs de imágenes.
    |
    */
    'cdn' => [
        'enabled' => env('IMAGE_CDN_ENABLED', false),
        'url' => env('IMAGE_CDN_URL'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Configuración de Optimización
    |--------------------------------------------------------------------------
    |
    | Configuración para la optimización automática de imágenes.
    |
    */
    'optimization' => [
        'enabled' => env('IMAGE_OPTIMIZATION_ENABLED', true),
        'strip_metadata' => env('IMAGE_STRIP_METADATA', true),
        'progressive_jpeg' => env('IMAGE_PROGRESSIVE_JPEG', true),
    ],
]; 