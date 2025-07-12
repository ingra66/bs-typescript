<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\MercadoPagoController;
use App\Http\Controllers\Api\CouponController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\AuthController;

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
        
        // Lista de deseos
        Route::prefix('wishlist')->group(function () {
            Route::get('/', [WishlistController::class, 'index']);
            Route::post('/add', [WishlistController::class, 'add']);
            Route::put('/{wishlist}', [WishlistController::class, 'update']);
            Route::delete('/{wishlist}', [WishlistController::class, 'remove']);
            Route::get('/summary', [WishlistController::class, 'summary']);
            Route::get('/public', [WishlistController::class, 'publicWishlists']);
            Route::post('/check', [WishlistController::class, 'check']);
            Route::get('/on-sale', [WishlistController::class, 'onSale']);
            Route::get('/back-in-stock', [WishlistController::class, 'backInStock']);
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
            
            // Categorías (admin)
            Route::prefix('admin/categories')->group(function () {
                Route::post('/', [CategoryController::class, 'store']);
                Route::put('/{category}', [CategoryController::class, 'update']);
                Route::delete('/{category}', [CategoryController::class, 'destroy']);
            });
            
            // Productos (admin)
            Route::prefix('admin/products')->group(function () {
                Route::post('/', [ProductController::class, 'store']);
                Route::put('/{product}', [ProductController::class, 'update']);
                Route::delete('/{product}', [ProductController::class, 'destroy']);
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
        });
    });
});

// Webhook de MercadoPago (sin autenticación)
Route::post('/webhook/mercadopago', [MercadoPagoController::class, 'webhook'])
    ->name('api.mercadopago.webhook'); 