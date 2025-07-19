<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    /**
     * Listar todos los productos en la wishlist del usuario autenticado.
     */
    public function index(): JsonResponse
    {
        $wishlist = Wishlist::with('product')
            ->where('user_id', Auth::id())
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product' => $item->product,
                    'notes' => $item->notes,
                    'is_public' => $item->is_public,
                    'created_at' => $item->created_at,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $wishlist,
            'message' => 'Wishlist obtenida exitosamente',
        ]);
    }

    /**
     * Agregar un producto a la wishlist del usuario autenticado.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'notes' => 'nullable|string|max:500',
            'is_public' => 'boolean',
        ]);

        // Verificar si el producto ya está en la wishlist
        $existingWishlist = Wishlist::where('user_id', Auth::id())
            ->where('product_id', $request->product_id)
            ->first();

        if ($existingWishlist) {
            return response()->json([
                'success' => false,
                'message' => 'El producto ya está en tu wishlist',
            ], 400);
        }

        $wishlist = Wishlist::create([
            'user_id' => Auth::id(),
            'product_id' => $request->product_id,
            'notes' => $request->notes,
            'is_public' => $request->is_public ?? false,
        ]);

        $wishlist->load('product');

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $wishlist->id,
                'product' => $wishlist->product,
                'notes' => $wishlist->notes,
                'is_public' => $wishlist->is_public,
                'created_at' => $wishlist->created_at,
            ],
            'message' => 'Producto agregado a wishlist exitosamente',
        ], 201);
    }

    /**
     * Eliminar un producto de la wishlist del usuario autenticado.
     */
    public function destroy(int $productId): JsonResponse
    {
        $wishlist = Wishlist::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->first();

        if (!$wishlist) {
            return response()->json([
                'success' => false,
                'message' => 'Producto no encontrado en tu wishlist',
            ], 404);
        }

        $wishlist->delete();

        return response()->json([
            'success' => true,
            'message' => 'Producto eliminado de wishlist exitosamente',
        ]);
    }

    /**
     * Verificar si un producto está en la wishlist del usuario autenticado.
     */
    public function check(int $productId): JsonResponse
    {
        $isInWishlist = Wishlist::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->exists();

        return response()->json([
            'success' => true,
            'data' => [
                'is_in_wishlist' => $isInWishlist,
            ],
        ]);
    }
} 