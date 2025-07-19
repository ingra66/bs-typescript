<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\AdminCategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\MercadoPagoController;
use App\Http\Controllers\Api\CouponController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\FooterController;
use App\Http\Controllers\Api\AdminUserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Rutas públicas
Route::prefix('v1')->group(function () {
    
    // Rutas de autenticación
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
    });
    
    // Categorías
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/navigation', [CategoryController::class, 'navigation']);
    Route::get('/categories/{category}', [CategoryController::class, 'show']);
    
    // Productos
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/featured', [ProductController::class, 'featured']);
    Route::get('/products/search', [ProductController::class, 'search']);
    Route::get('/products/{product}', [ProductController::class, 'show']);
    Route::get('/categories/{category}/products', [ProductController::class, 'byCategory']);
    
    // Cupones
    Route::post('/coupons/validate', [CouponController::class, 'validate']);
    
    // Reseñas
    Route::get('/products/{product}/reviews', [ReviewController::class, 'index']);
    Route::get('/reviews/{review}', [ReviewController::class, 'show']);
    
    // MercadoPago
    Route::get('/mercadopago/payment-methods', [MercadoPagoController::class, 'getPaymentMethods']);
    
    // Footer
    Route::get('/footer', [FooterController::class, 'index']);
    Route::get('/contact-info', [FooterController::class, 'contactInfo']);
    Route::get('/legal-pages', [FooterController::class, 'legalPages']);
    Route::post('/newsletter/subscribe', [FooterController::class, 'subscribeNewsletter']);
    
    // Debug endpoint temporal (sin autenticación)
    Route::get('/debug/cart-public', function () {
        return response()->json([
            'success' => true,
            'message' => 'Endpoint público para debug',
            'data' => [
                'message' => 'Este endpoint no requiere autenticación',
                'timestamp' => now(),
            ],
        ]);
    });

    // Debug endpoint para MercadoPago
    Route::get('/debug/mercadopago-config', function () {
        try {
            // Verificar configuración
            $accessToken = config('services.mercadopago.access_token');
            $publicKey = config('services.mercadopago.public_key');
            $environment = config('services.mercadopago.environment');
            
            return response()->json([
                'success' => true,
                'data' => [
                    'access_token_present' => !empty($accessToken),
                    'access_token_length' => strlen($accessToken),
                    'public_key_present' => !empty($publicKey),
                    'environment' => $environment,
                    'timestamp' => now(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    });

    // Debug endpoint para crear preferencia sin orden
    Route::post('/debug/create-preference', function (Request $request) {
        try {
            $mercadopagoService = new \App\Services\MercadoPagoService();
            
            // Crear una orden de prueba con los datos recibidos
            $order = new \App\Models\Order();
            $order->id = 999;
            $order->order_number = 'TEST-' . time();
            $order->total_amount = 0;
            $order->shipping_address = ['name' => 'Test User'];
            $order->user = (object)['email' => 'test@example.com'];
            
            // Calcular total y crear items
            $items = collect($request->input('items', []));
            $total = 0;
            $orderItems = collect();
            
            foreach ($items as $item) {
                $total += $item['quantity'] * $item['unit_price'];
                $orderItems->push((object)[
                    'product_name' => $item['title'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                ]);
            }
            
            $order->total_amount = $total;
            $order->items = $orderItems;
            
            $result = $mercadopagoService->createPreference($order);
            
            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    });

    // Debug endpoint para verificar URLs de MercadoPago
    Route::get('/debug/mercadopago-urls', function () {
        return response()->json([
            'success' => true,
            'data' => [
                'notification_url' => config('services.mercadopago.notification_url'),
                'back_urls' => config('services.mercadopago.back_urls'),
                'app_frontend_url' => env('APP_FRONTEND_URL'),
                'app_url' => env('APP_URL'),
            ],
        ]);
    });

    // Debug endpoint para probar preferencia con datos específicos
    Route::post('/debug/test-preference', function (Request $request) {
        try {
            $mercadopagoService = new \App\Services\MercadoPagoService();
            
            // Crear una orden de prueba con datos mínimos
            $order = new \App\Models\Order();
            $order->id = 999;
            $order->order_number = 'TEST-' . time();
            $order->total_amount = 100.00;
            $order->shipping_address = ['name' => 'Test User'];
            $order->user = (object)['email' => 'test@example.com'];
            $order->items = collect([
                (object)[
                    'product_name' => 'Producto Test',
                    'quantity' => 1,
                    'unit_price' => 100.00,
                ]
            ]);
            
            $result = $mercadopagoService->createPreference($order);
            
            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    });

    // Debug endpoint para probar preferencia con GET (para navegador)
    Route::get('/debug/test-preference', function () {
        try {
            $mercadopagoService = new \App\Services\MercadoPagoService();
            
            // Crear una orden de prueba con datos mínimos
            $order = new \App\Models\Order();
            $order->id = 999;
            $order->order_number = 'TEST-' . time();
            $order->total_amount = 100.00;
            $order->shipping_address = ['name' => 'Test User'];
            $order->user = (object)['email' => 'test@example.com'];
            $order->items = collect([
                (object)[
                    'product_name' => 'Producto Test',
                    'quantity' => 1,
                    'unit_price' => 100.00,
                ]
            ]);
            
            $result = $mercadopagoService->createPreference($order);
            
            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    });

    // Debug endpoint para ver logs de MercadoPago
    Route::get('/debug/mercadopago-logs', function () {
        try {
            // Leer los últimos logs de Laravel
            $logFile = storage_path('logs/laravel.log');
            $logs = [];
            
            if (file_exists($logFile)) {
                $lines = file($logFile);
                $recentLines = array_slice($lines, -50); // Últimas 50 líneas
                
                foreach ($recentLines as $line) {
                    if (str_contains($line, 'MercadoPago') || str_contains($line, 'mercadopago')) {
                        $logs[] = trim($line);
                    }
                }
            }
            
            return response()->json([
                'success' => true,
                'data' => [
                    'logs' => $logs,
                    'log_file_exists' => file_exists($logFile),
                    'log_file_size' => file_exists($logFile) ? filesize($logFile) : 0,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    });

    // Debug endpoint para inspeccionar MPResponse
    Route::get('/debug/mpresponse-info', function () {
        try {
            // Intentar crear una preferencia que falle para inspeccionar MPResponse
            $mercadopagoService = new \App\Services\MercadoPagoService();
            
            // Crear una orden de prueba con datos inválidos para forzar un error
            $order = new \App\Models\Order();
            $order->id = 999;
            $order->order_number = 'TEST-' . time();
            $order->total_amount = -1; // Valor inválido para forzar error
            $order->shipping_address = ['name' => 'Test User'];
            $order->user = (object)['email' => 'test@example.com'];
            $order->items = collect([
                (object)[
                    'product_name' => 'Producto Test',
                    'quantity' => 0, // Cantidad inválida
                    'unit_price' => -1, // Precio inválido
                ]
            ]);
            
            $result = $mercadopagoService->createPreference($order);
            
            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    });

    // Debug endpoint para ver datos que se envían a MercadoPago
    Route::get('/debug/mercadopago-data', function () {
        try {
            $mercadopagoService = new \App\Services\MercadoPagoService();
            
            // Crear una orden de prueba con datos válidos
            $order = new \App\Models\Order();
            $order->id = 999;
            $order->order_number = 'TEST-' . time();
            $order->total_amount = 100.00;
            $order->shipping_address = ['name' => 'Test User'];
            $order->user = (object)['email' => 'test@example.com'];
            $order->items = collect([
                (object)[
                    'product_name' => 'Producto Test',
                    'quantity' => 1,
                    'unit_price' => 100.00,
                ]
            ]);
            
            // Simular la preparación de datos sin crear la preferencia
            $items = [];
            foreach ($order->items as $item) {
                $items[] = [
                    'title' => $item->product_name,
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'currency_id' => 'ARS',
                ];
            }
            
            $preferenceData = [
                'items' => $items,
                'external_reference' => $order->order_number,
                'auto_return' => 'approved',
                'expires' => true,
                'expiration_date_to' => now()->addHours(24)->toISOString(),
            ];
            
            // Agregar payer
            if (isset($order->user->email)) {
                $preferenceData['payer'] = [
                    'name' => $order->shipping_address['name'] ?? 'Cliente',
                    'email' => $order->user->email,
                ];
            }
            
            // Agregar URLs
            $notificationUrl = config('services.mercadopago.notification_url');
            if ($notificationUrl && filter_var($notificationUrl, FILTER_VALIDATE_URL)) {
                $preferenceData['notification_url'] = $notificationUrl;
            }
            
            $backUrls = config('services.mercadopago.back_urls');
            if ($backUrls && is_array($backUrls)) {
                $validBackUrls = [];
                foreach ($backUrls as $key => $url) {
                    if (filter_var($url, FILTER_VALIDATE_URL)) {
                        $validBackUrls[$key] = $url;
                    }
                }
                if (empty($validBackUrls)) {
                    $validBackUrls = [
                        'success' => 'http://localhost:3000/payment/success',
                        'failure' => 'http://localhost:3000/payment/failure',
                        'pending' => 'http://localhost:3000/payment/pending',
                    ];
                }
                $preferenceData['back_urls'] = $validBackUrls;
            } else {
                $preferenceData['back_urls'] = [
                    'success' => 'http://localhost:3000/payment/success',
                    'failure' => 'http://localhost:3000/payment/failure',
                    'pending' => 'http://localhost:3000/payment/pending',
                ];
            }
            
            return response()->json([
                'success' => true,
                'data' => [
                    'preference_data' => $preferenceData,
                    'config' => [
                        'notification_url' => config('services.mercadopago.notification_url'),
                        'back_urls' => config('services.mercadopago.back_urls'),
                        'environment' => config('services.mercadopago.environment'),
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    });

    // Debug endpoint para probar sin auto_return
    Route::get('/debug/test-preference-no-auto-return', function () {
        try {
            $mercadopagoService = new \App\Services\MercadoPagoService();
            
            // Crear una orden de prueba con datos mínimos
            $order = new \App\Models\Order();
            $order->id = 999;
            $order->order_number = 'TEST-' . time();
            $order->total_amount = 100.00;
            $order->shipping_address = ['name' => 'Test User'];
            $order->user = (object)['email' => 'test@example.com'];
            $order->items = collect([
                (object)[
                    'product_name' => 'Producto Test',
                    'quantity' => 1,
                    'unit_price' => 100.00,
                ]
            ]);
            
            // Crear preferencia sin auto_return para probar
            $items = [];
            foreach ($order->items as $item) {
                $items[] = [
                    'title' => $item->product_name,
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'currency_id' => 'ARS',
                ];
            }
            
            $preferenceData = [
                'items' => $items,
                'external_reference' => $order->order_number,
                'expires' => true,
                'expiration_date_to' => now()->addHours(24)->toISOString(),
                'back_urls' => [
                    'success' => 'https://www.mercadopago.com.ar',
                    'failure' => 'https://www.mercadopago.com.ar',
                    'pending' => 'https://www.mercadopago.com.ar',
                ],
            ];
            
            // Agregar payer
            $preferenceData['payer'] = [
                'name' => $order->shipping_address['name'] ?? 'Cliente',
                'email' => $order->user->email,
            ];
            
            // Crear preferencia directamente usando el método público
            $result = $mercadopagoService->createPreference($order);
            
            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    });

    // Debug endpoint para probar con URLs correctas
    Route::get('/debug/test-preference-final', function () {
        try {
            $mercadopagoService = new \App\Services\MercadoPagoService();
            
            // Crear una orden de prueba con datos mínimos
            $order = new \App\Models\Order();
            $order->id = 999;
            $order->order_number = 'TEST-' . time();
            $order->total_amount = 100.00;
            $order->shipping_address = ['name' => 'Test User'];
            $order->user = (object)['email' => 'test@example.com'];
            $order->items = collect([
                (object)[
                    'product_name' => 'Producto Test',
                    'quantity' => 1,
                    'unit_price' => 100.00,
                ]
            ]);
            
            $result = $mercadopagoService->createPreference($order);
            
            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    });

    // Debug endpoint para verificar variables de entorno
    Route::get('/debug/env-check', function () {
        return response()->json([
            'success' => true,
            'data' => [
                'app_frontend_url' => env('APP_FRONTEND_URL'),
                'mercadopago_back_urls_success' => env('MERCADOPAGO_BACK_URLS_SUCCESS'),
                'mercadopago_back_urls_failure' => env('MERCADOPAGO_BACK_URLS_FAILURE'),
                'mercadopago_back_urls_pending' => env('MERCADOPAGO_BACK_URLS_PENDING'),
                'config_back_urls' => config('services.mercadopago.back_urls'),
                'environment' => config('services.mercadopago.environment'),
                'all_env_vars' => [
                    'APP_FRONTEND_URL' => env('APP_FRONTEND_URL'),
                    'MERCADOPAGO_BACK_URLS_SUCCESS' => env('MERCADOPAGO_BACK_URLS_SUCCESS'),
                    'MERCADOPAGO_BACK_URLS_FAILURE' => env('MERCADOPAGO_BACK_URLS_FAILURE'),
                    'MERCADOPAGO_BACK_URLS_PENDING' => env('MERCADOPAGO_BACK_URLS_PENDING'),
                ],
            ],
        ]);
    });

    // Debug endpoint para ver qué URLs se usan en la preferencia
    Route::get('/debug/preference-urls', function () {
        try {
            $mercadopagoService = new \App\Services\MercadoPagoService();
            
            // Crear una orden de prueba
            $order = new \App\Models\Order();
            $order->id = 999;
            $order->order_number = 'TEST-' . time();
            $order->total_amount = 100.00;
            $order->shipping_address = ['name' => 'Test User'];
            $order->user = (object)['email' => 'test@example.com'];
            $order->items = collect([
                (object)[
                    'product_name' => 'Producto Test',
                    'quantity' => 1,
                    'unit_price' => 100.00,
                ]
            ]);
            
            // Simular la preparación de datos
            $items = [];
            foreach ($order->items as $item) {
                $items[] = [
                    'title' => $item->product_name,
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'currency_id' => 'ARS',
                ];
            }
            
            $preferenceData = [
                'items' => $items,
                'external_reference' => $order->order_number,
                'auto_return' => 'approved',
                'expires' => true,
                'expiration_date_to' => now()->addHours(24)->toISOString(),
            ];
            
            // Agregar payer
            $preferenceData['payer'] = [
                'name' => $order->shipping_address['name'] ?? 'Cliente',
                'email' => $order->user->email,
            ];
            
            // Agregar URLs según la lógica del servicio
            $environment = config('services.mercadopago.environment', 'sandbox');
            
            if ($environment === 'sandbox') {
                $preferenceData['back_urls'] = [
                    'success' => 'https://www.mercadopago.com.ar',
                    'failure' => 'https://www.mercadopago.com.ar',
                    'pending' => 'https://www.mercadopago.com.ar',
                ];
            } else {
                $backUrls = config('services.mercadopago.back_urls');
                if ($backUrls && is_array($backUrls)) {
                    $validBackUrls = [];
                    foreach ($backUrls as $key => $url) {
                        if (filter_var($url, FILTER_VALIDATE_URL)) {
                            $validBackUrls[$key] = $url;
                        }
                    }
                    if (!empty($validBackUrls)) {
                        $preferenceData['back_urls'] = $validBackUrls;
                    } else {
                        $preferenceData['back_urls'] = [
                            'success' => 'https://www.mercadopago.com.ar',
                            'failure' => 'https://www.mercadopago.com.ar',
                            'pending' => 'https://www.mercadopago.com.ar',
                        ];
                    }
                } else {
                    $preferenceData['back_urls'] = [
                        'success' => 'https://www.mercadopago.com.ar',
                        'failure' => 'https://www.mercadopago.com.ar',
                        'pending' => 'https://www.mercadopago.com.ar',
                    ];
                }
            }
            
            return response()->json([
                'success' => true,
                'data' => [
                    'environment' => $environment,
                    'preference_data' => $preferenceData,
                    'back_urls_used' => $preferenceData['back_urls'],
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    });

    // Debug endpoint para probar MercadoPago sin orden
    Route::get('/debug/mercadopago-test', function () {
        try {
            $mercadopagoService = new \App\Services\MercadoPagoService();
            
            // Crear una orden de prueba
            $order = new \App\Models\Order();
            $order->id = 999;
            $order->order_number = 'TEST-' . time();
            $order->total_amount = 100.00;
            $order->shipping_address = ['name' => 'Test User'];
            $order->user = (object)['email' => 'test@example.com'];
            $order->items = collect([
                (object)[
                    'product_name' => 'Producto de prueba',
                    'quantity' => 1,
                    'unit_price' => 100.00,
                ]
            ]);
            
            $result = $mercadopagoService->createPreference($order);
            
            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    });
    
    // Rutas protegidas
    Route::middleware('auth:sanctum')->group(function () {
        
        // Carrito
        Route::prefix('cart')->group(function () {
            Route::get('/', [CartController::class, 'index']);
            Route::post('/add', [CartController::class, 'add']);
            Route::put('/{cartItem}', [CartController::class, 'update']);
            Route::delete('/{cartItem}', [CartController::class, 'remove']);
            Route::delete('/', [CartController::class, 'clear']);
            Route::get('/summary', [CartController::class, 'summary']);
            Route::post('/validate', [CartController::class, 'validate']);
            Route::post('/sync', [CartController::class, 'sync']);
        });

        // Debug endpoint (con autenticación)
        Route::get('/debug/cart', function () {
            $userId = Auth::id();
            $cartItems = \App\Models\CartItem::where('user_id', $userId)
                ->with('product')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'user_id' => $userId,
                    'cart_items_count' => $cartItems->count(),
                    'cart_items' => $cartItems->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'product_id' => $item->product_id,
                            'product_name' => $item->product->name ?? 'N/A',
                            'quantity' => $item->quantity,
                            'created_at' => $item->created_at,
                        ];
                    }),
                ],
            ]);
        });
        
        // Órdenes
        Route::prefix('orders')->group(function () {
            Route::get('/', [OrderController::class, 'index']);
            Route::post('/', [OrderController::class, 'store']);
            Route::get('/statistics', [OrderController::class, 'statistics']);
            Route::get('/{order}', [OrderController::class, 'show']);
            Route::post('/{order}/cancel', [OrderController::class, 'cancel']);
        });
        
        // MercadoPago (protegido)
        Route::prefix('mercadopago')->group(function () {
            Route::post('/create-preference', [MercadoPagoController::class, 'createPreference']);
            Route::get('/orders/{order}/payment-status', [MercadoPagoController::class, 'getPaymentStatus']);
        });
        
        // Reseñas (protegido)
        Route::prefix('reviews')->group(function () {
            Route::post('/', [ReviewController::class, 'store']);
            Route::put('/{review}', [ReviewController::class, 'update']);
            Route::delete('/{review}', [ReviewController::class, 'destroy']);
            Route::post('/{review}/helpful', [ReviewController::class, 'markHelpful']);
            Route::post('/{review}/not-helpful', [ReviewController::class, 'markNotHelpful']);
        });
        
        // Wishlist (favoritos)
        Route::prefix('wishlist')->group(function () {
            Route::get('/', [WishlistController::class, 'index']);
            Route::post('/', [WishlistController::class, 'store']);
            Route::delete('/{product}', [WishlistController::class, 'destroy']);
            Route::get('/check/{product}', [WishlistController::class, 'check']);
        });
        
        // Notificaciones
        Route::prefix('notifications')->group(function () {
            Route::get('/', [NotificationController::class, 'index']);
            Route::get('/unread', [NotificationController::class, 'unread']);
            Route::get('/statistics', [NotificationController::class, 'statistics']);
            Route::get('/types', [NotificationController::class, 'types']);
            Route::get('/by-type', [NotificationController::class, 'byType']);
            Route::post('/{notification}/read', [NotificationController::class, 'markAsRead']);
            Route::post('/{notification}/unread', [NotificationController::class, 'markAsUnread']);
            Route::post('/read-all', [NotificationController::class, 'markAllAsRead']);
            Route::delete('/{notification}', [NotificationController::class, 'destroy']);
            Route::delete('/', [NotificationController::class, 'clear']);
            Route::delete('/read', [NotificationController::class, 'clearRead']);
            Route::post('/test', [NotificationController::class, 'createTest']);
        });
        
        // Admin routes (solo para administradores)
        Route::middleware('admin')->group(function () {
            
            // Debug endpoint para probar subida de imágenes
            Route::post('/debug/upload-test', function (Request $request) {
                try {
                    $data = $request->all();
                    $files = $request->allFiles();
                    
                    return response()->json([
                        'success' => true,
                        'message' => 'Debug de subida de archivos',
                        'data' => [
                            'request_data' => $data,
                            'files' => $files,
                            'has_images' => $request->hasFile('images'),
                            'images_count' => $request->hasFile('images') ? count($request->file('images')) : 0,
                            'content_type' => $request->header('Content-Type'),
                            'user' => Auth::user(),
                        ],
                    ]);
                } catch (\Exception $e) {
                    return response()->json([
                        'success' => false,
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString(),
                    ], 500);
                }
            });
            
            // Categorías (admin)
            Route::prefix('admin/categories')->group(function () {
                Route::get('/', [AdminCategoryController::class, 'index']);
                Route::post('/', [AdminCategoryController::class, 'store']);
                Route::get('/for-select', [AdminCategoryController::class, 'forSelect']);
                Route::get('/statistics', [AdminCategoryController::class, 'statistics']);
                Route::get('/{category}', [AdminCategoryController::class, 'show']);
                Route::put('/{category}', [AdminCategoryController::class, 'update']);
                Route::delete('/{category}', [AdminCategoryController::class, 'destroy']);
                Route::post('/{category}/toggle-status', [AdminCategoryController::class, 'toggleStatus']);
                Route::post('/{category}/upload-image', [AdminCategoryController::class, 'uploadImage']);
            });
            
            // Productos (admin)
            Route::prefix('admin/products')->group(function () {
                Route::post('/', [ProductController::class, 'store']);
                Route::put('/{id}', [ProductController::class, 'update']);
                Route::delete('/{id}', [ProductController::class, 'destroy']);
            });
            
            // Cupones (admin)
            Route::prefix('admin/coupons')->group(function () {
                Route::get('/', [CouponController::class, 'index']);
                Route::post('/', [CouponController::class, 'store']);
                Route::get('/{coupon}', [CouponController::class, 'show']);
                Route::put('/{coupon}', [CouponController::class, 'update']);
                Route::delete('/{coupon}', [CouponController::class, 'destroy']);
            });
            
            // Órdenes (admin)
            Route::prefix('admin/orders')->group(function () {
                Route::get('/', [OrderController::class, 'adminIndex']);
                Route::get('/{order}', [OrderController::class, 'adminShow']);
                Route::put('/{order}/status', [OrderController::class, 'updateStatus']);
            });
            
            // Reseñas (admin)
            Route::prefix('admin/reviews')->group(function () {
                Route::get('/', [ReviewController::class, 'adminIndex']);
                Route::put('/{review}/approve', [ReviewController::class, 'approve']);
                Route::put('/{review}/reject', [ReviewController::class, 'reject']);
            });
            
            // Usuarios (admin)
            Route::prefix('admin/users')->group(function () {
                Route::get('/', [AdminUserController::class, 'index']);
                Route::get('/statistics', [AdminUserController::class, 'getUsersStatistics']);
                Route::post('/', [AdminUserController::class, 'store']);
                Route::get('/{user}', [AdminUserController::class, 'show']);
                Route::put('/{user}', [AdminUserController::class, 'update']);
                Route::delete('/{user}', [AdminUserController::class, 'destroy']);
                Route::get('/{user}/statistics', [AdminUserController::class, 'getUserStatistics']);
                Route::get('/{user}/wishlist', [AdminUserController::class, 'getUserWishlist']);
                Route::get('/debug/wishlist-test', [AdminUserController::class, 'debugWishlistTest']);
            });
        });
    });
});

// Webhook de MercadoPago (sin autenticación)
Route::post('/webhook/mercadopago', [MercadoPagoController::class, 'webhook'])
    ->name('api.mercadopago.webhook'); 