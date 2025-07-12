<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    /**
     * Display the user's wishlist
     */
    public function index(Request $request): JsonResponse
    {
        $query = Wishlist::where('user_id', Auth::id())
            ->with(['product' => function ($query) {
                $query->with(['category', 'variants', 'reviews']);
            }]);

        // Filtros
        if ($request->has('public')) {
            $query->public();
        }

        if ($request->has('private')) {
            $query->private();
        }

        // Ordenamiento
        $orderBy = $request->get('order_by', 'created_at');
        $orderDirection = $request->get('order_direction', 'desc');
        $query->orderBy($orderBy, $orderDirection);

        // Paginación
        $perPage = $request->get('per_page', 12);
        $wishlist = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $wishlist->items(),
            'pagination' => [
                'current_page' => $wishlist->currentPage(),
                'last_page' => $wishlist->lastPage(),
                'per_page' => $wishlist->perPage(),
                'total' => $wishlist->total(),
            ],
        ]);
    }

    /**
     * Add product to wishlist
     */
    public function add(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'notes' => 'nullable|string',
            'is_public' => 'boolean',
        ]);

        // Verificar si el producto ya está en la lista de deseos
        $existingItem = Wishlist::where('user_id', Auth::id())
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($existingItem) {
            return response()->json([
                'success' => false,
                'message' => 'El producto ya está en tu lista de deseos',
            ], 422);
        }

        // Verificar que el producto esté activo
        $product = Product::findOrFail($validated['product_id']);
        if (!$product->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'El producto no está disponible',
            ], 422);
        }

        $wishlist = Wishlist::create([
            'user_id' => Auth::id(),
            'product_id' => $validated['product_id'],
            'notes' => $validated['notes'] ?? null,
            'is_public' => $validated['is_public'] ?? false,
        ]);

        $wishlist->load(['product.category', 'product.variants', 'product.reviews']);

        return response()->json([
            'success' => true,
            'message' => 'Producto agregado a la lista de deseos',
            'data' => $wishlist,
        ], 201);
    }

    /**
     * Remove product from wishlist
     */
    public function remove(Wishlist $wishlist): JsonResponse
    {
        // Verificar que el item pertenece al usuario
        if ($wishlist->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado',
            ], 403);
        }

        $wishlist->delete();

        return response()->json([
            'success' => true,
            'message' => 'Producto removido de la lista de deseos',
        ]);
    }

    /**
     * Update wishlist item
     */
    public function update(Request $request, Wishlist $wishlist): JsonResponse
    {
        // Verificar que el item pertenece al usuario
        if ($wishlist->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado',
            ], 403);
        }

        $validated = $request->validate([
            'notes' => 'nullable|string',
            'is_public' => 'boolean',
        ]);

        $wishlist->update($validated);
        $wishlist->load(['product.category', 'product.variants', 'product.reviews']);

        return response()->json([
            'success' => true,
            'message' => 'Lista de deseos actualizada',
            'data' => $wishlist,
        ]);
    }

    /**
     * Get wishlist summary
     */
    public function summary(): JsonResponse
    {
        $wishlistCount = Wishlist::where('user_id', Auth::id())->count();
        $publicCount = Wishlist::where('user_id', Auth::id())->public()->count();
        $privateCount = Wishlist::where('user_id', Auth::id())->private()->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_items' => $wishlistCount,
                'public_items' => $publicCount,
                'private_items' => $privateCount,
            ],
        ]);
    }

    /**
     * Get public wishlists from other users
     */
    public function publicWishlists(Request $request): JsonResponse
    {
        $query = Wishlist::public()
            ->where('user_id', '!=', Auth::id())
            ->with(['user', 'product.category']);

        // Filtros
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Ordenamiento
        $orderBy = $request->get('order_by', 'created_at');
        $orderDirection = $request->get('order_direction', 'desc');
        $query->orderBy($orderBy, $orderDirection);

        // Paginación
        $perPage = $request->get('per_page', 12);
        $wishlists = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $wishlists->items(),
            'pagination' => [
                'current_page' => $wishlists->currentPage(),
                'last_page' => $wishlists->lastPage(),
                'per_page' => $wishlists->perPage(),
                'total' => $wishlists->total(),
            ],
        ]);
    }

    /**
     * Check if product is in user's wishlist
     */
    public function check(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $wishlistItem = Wishlist::where('user_id', Auth::id())
            ->where('product_id', $validated['product_id'])
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'is_in_wishlist' => !is_null($wishlistItem),
                'wishlist_item' => $wishlistItem,
            ],
        ]);
    }

    /**
     * Get wishlist items that are on sale
     */
    public function onSale(): JsonResponse
    {
        $wishlistItems = Wishlist::where('user_id', Auth::id())
            ->whereHas('product', function ($query) {
                $query->whereNotNull('compare_price')
                      ->whereColumn('price', '<', 'compare_price');
            })
            ->with(['product.category', 'product.variants'])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $wishlistItems,
        ]);
    }

    /**
     * Get wishlist items that are back in stock
     */
    public function backInStock(): JsonResponse
    {
        $wishlistItems = Wishlist::where('user_id', Auth::id())
            ->whereHas('product', function ($query) {
                $query->where('stock', '>', 0);
            })
            ->with(['product.category', 'product.variants'])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $wishlistItems,
        ]);
    }
} 