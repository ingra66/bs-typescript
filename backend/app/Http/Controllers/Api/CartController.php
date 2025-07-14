<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Display the user's cart
     */
    public function index(): JsonResponse
    {
        $cartItems = CartItem::where('user_id', Auth::id())
            ->with(['product' => function ($query) {
                $query->with(['category', 'variants']);
            }])
            ->get();

        $subtotal = $cartItems->sum(function ($item) {
            return $item->subtotal;
        });

        $totalItems = $cartItems->sum('quantity');

        return response()->json([
            'success' => true,
            'data' => [
                'items' => $cartItems,
                'subtotal' => $subtotal,
                'formatted_subtotal' => '$' . number_format($subtotal, 2),
                'total_items' => $totalItems,
            ],
        ]);
    }

    /**
     * Add item to cart
     */
    public function add(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        // Verificar stock
        if (!$product->isInStock()) {
            return response()->json([
                'success' => false,
                'message' => 'El producto no está disponible en stock',
            ], 422);
        }

        if ($validated['quantity'] > $product->stock) {
            return response()->json([
                'success' => false,
                'message' => 'La cantidad solicitada excede el stock disponible',
            ], 422);
        }

        // Verificar si el producto ya está en el carrito
        $existingItem = CartItem::where('user_id', Auth::id())
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($existingItem) {
            // Actualizar cantidad
            $newQuantity = $existingItem->quantity + $validated['quantity'];
            
            if ($newQuantity > $product->stock) {
                return response()->json([
                    'success' => false,
                    'message' => 'La cantidad total excede el stock disponible',
                ], 422);
            }

            $existingItem->update(['quantity' => $newQuantity]);
            $cartItem = $existingItem;
        } else {
            // Crear nuevo item
            $cartItem = CartItem::create([
                'user_id' => Auth::id(),
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity'],
            ]);
        }

        $cartItem->load(['product.category', 'product.variants']);

        return response()->json([
            'success' => true,
            'message' => 'Producto agregado al carrito',
            'data' => $cartItem,
        ], 201);
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, CartItem $cartItem): JsonResponse
    {
        // Verificar que el item pertenece al usuario
        if ($cartItem->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado',
            ], 403);
        }

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $product = $cartItem->product;

        // Verificar stock
        if ($validated['quantity'] > $product->stock) {
            return response()->json([
                'success' => false,
                'message' => 'La cantidad solicitada excede el stock disponible',
            ], 422);
        }

        $cartItem->update(['quantity' => $validated['quantity']]);
        $cartItem->load(['product.category', 'product.variants']);

        return response()->json([
            'success' => true,
            'message' => 'Cantidad actualizada',
            'data' => $cartItem,
        ]);
    }

    /**
     * Remove item from cart
     */
    public function remove(CartItem $cartItem): JsonResponse
    {
        // Verificar que el item pertenece al usuario
        if ($cartItem->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado',
            ], 403);
        }

        $cartItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Producto removido del carrito',
        ]);
    }

    /**
     * Clear user's cart
     */
    public function clear(): JsonResponse
    {
        CartItem::where('user_id', Auth::id())->delete();

        return response()->json([
            'success' => true,
            'message' => 'Carrito vaciado',
        ]);
    }

    /**
     * Get cart summary
     */
    public function summary(): JsonResponse
    {
        $cartItems = CartItem::where('user_id', Auth::id())
            ->with('product')
            ->get();

        $subtotal = $cartItems->sum(function ($item) {
            return $item->subtotal;
        });

        $totalItems = $cartItems->sum('quantity');

        return response()->json([
            'success' => true,
            'data' => [
                'total_items' => $totalItems,
                'subtotal' => $subtotal,
                'formatted_subtotal' => '$' . number_format($subtotal, 2),
            ],
        ]);
    }

    /**
     * Validate cart items
     */
    public function validate(): JsonResponse
    {
        $cartItems = CartItem::where('user_id', Auth::id())
            ->with('product')
            ->get();

        $errors = [];
        $warnings = [];

        foreach ($cartItems as $item) {
            $product = $item->product;

            // Verificar si el producto está activo
            if (!$product->is_active) {
                $errors[] = "El producto '{$product->name}' ya no está disponible";
                continue;
            }

            // Verificar stock
            if (!$product->isInStock()) {
                $errors[] = "El producto '{$product->name}' no está disponible en stock";
                continue;
            }

            if ($item->quantity > $product->stock) {
                $errors[] = "La cantidad del producto '{$product->name}' excede el stock disponible";
                continue;
            }

            // Advertencias
            if ($product->stock <= 5 && $product->stock > 0) {
                $warnings[] = "Stock bajo en '{$product->name}' ({$product->stock} unidades disponibles)";
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'is_valid' => empty($errors),
                'errors' => $errors,
                'warnings' => $warnings,
            ],
        ]);
    }

    /**
     * Sync local cart with backend
     */
    public function sync(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        // Limpiar carrito actual
        CartItem::where('user_id', Auth::id())->delete();

        $syncedItems = [];

        foreach ($validated['items'] as $item) {
            $product = Product::findOrFail($item['id']);

            // Verificar stock
            if (!$product->isInStock()) {
                continue; // Saltar productos sin stock
            }

            $quantity = min($item['quantity'], $product->stock); // No exceder stock

            if ($quantity > 0) {
                $cartItem = CartItem::create([
                    'user_id' => Auth::id(),
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                ]);

                $cartItem->load(['product' => function ($query) {
                    $query->with(['category', 'variants']);
                }]);

                $syncedItems[] = $cartItem;
            }
        }

        $subtotal = collect($syncedItems)->sum(function ($item) {
            return $item->subtotal;
        });

        $totalItems = collect($syncedItems)->sum('quantity');

        return response()->json([
            'success' => true,
            'message' => 'Carrito sincronizado',
            'data' => [
                'items' => $syncedItems,
                'subtotal' => $subtotal,
                'formatted_subtotal' => '$' . number_format($subtotal, 2),
                'total_items' => $totalItems,
            ],
        ]);
    }
} 