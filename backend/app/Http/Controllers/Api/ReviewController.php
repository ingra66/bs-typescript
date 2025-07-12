<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Product;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Display a listing of reviews for a product
     */
    public function index(Product $product, Request $request): JsonResponse
    {
        $query = $product->reviews()->with('user');

        // Filtros
        if ($request->has('rating')) {
            $query->byRating($request->rating);
        }

        if ($request->has('verified')) {
            $query->verified();
        }

        // Solo reseñas aprobadas para usuarios normales
        if (!Auth::user() || !Auth::user()->is_admin) {
            $query->approved();
        }

        // Ordenamiento
        $orderBy = $request->get('order_by', 'created_at');
        $orderDirection = $request->get('order_direction', 'desc');
        $query->orderBy($orderBy, $orderDirection);

        // Paginación
        $perPage = $request->get('per_page', 10);
        $reviews = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $reviews->items(),
            'pagination' => [
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'per_page' => $reviews->perPage(),
                'total' => $reviews->total(),
            ],
        ]);
    }

    /**
     * Display the specified review
     */
    public function show(Review $review): JsonResponse
    {
        $review->load(['user', 'product', 'order']);

        return response()->json([
            'success' => true,
            'data' => $review,
        ]);
    }

    /**
     * Store a newly created review
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'order_id' => 'nullable|exists:orders,id',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'required|string|min:10',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Verificar si el usuario ya reseñó este producto
        $existingReview = Review::where('user_id', Auth::id())
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($existingReview) {
            return response()->json([
                'success' => false,
                'message' => 'Ya has reseñado este producto',
            ], 422);
        }

        // Verificar si es una compra verificada
        $isVerifiedPurchase = false;
        if ($validated['order_id']) {
            $order = Order::where('id', $validated['order_id'])
                ->where('user_id', Auth::id())
                ->where('status', Order::STATUS_DELIVERED)
                ->first();

            if ($order) {
                $isVerifiedPurchase = true;
            }
        }

        // Manejar imágenes
        $images = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $images[] = $image->store('reviews', 'public');
            }
        }

        $review = Review::create([
            'user_id' => Auth::id(),
            'product_id' => $validated['product_id'],
            'order_id' => $validated['order_id'],
            'rating' => $validated['rating'],
            'title' => $validated['title'],
            'comment' => $validated['comment'],
            'images' => $images,
            'is_verified_purchase' => $isVerifiedPurchase,
            'is_approved' => false, // Requiere aprobación por defecto
        ]);

        $review->load(['user', 'product']);

        return response()->json([
            'success' => true,
            'message' => 'Reseña creada exitosamente. Será revisada antes de ser publicada.',
            'data' => $review,
        ], 201);
    }

    /**
     * Update the specified review
     */
    public function update(Request $request, Review $review): JsonResponse
    {
        // Verificar que la reseña pertenece al usuario
        if ($review->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado',
            ], 403);
        }

        $validated = $request->validate([
            'rating' => 'sometimes|required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'sometimes|required|string|min:10',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Manejar imágenes
        if ($request->hasFile('images')) {
            // Eliminar imágenes anteriores si existen
            if ($review->images) {
                foreach ($review->images as $image) {
                    \Storage::disk('public')->delete($image);
                }
            }
            
            $images = [];
            foreach ($request->file('images') as $image) {
                $images[] = $image->store('reviews', 'public');
            }
            $validated['images'] = $images;
        }

        $review->update($validated);
        $review->load(['user', 'product']);

        return response()->json([
            'success' => true,
            'message' => 'Reseña actualizada exitosamente',
            'data' => $review,
        ]);
    }

    /**
     * Remove the specified review
     */
    public function destroy(Review $review): JsonResponse
    {
        // Verificar que la reseña pertenece al usuario
        if ($review->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado',
            ], 403);
        }

        // Eliminar imágenes si existen
        if ($review->images) {
            foreach ($review->images as $image) {
                \Storage::disk('public')->delete($image);
            }
        }

        $review->delete();

        return response()->json([
            'success' => true,
            'message' => 'Reseña eliminada exitosamente',
        ]);
    }

    /**
     * Mark review as helpful
     */
    public function markHelpful(Review $review): JsonResponse
    {
        $review->markAsHelpful();

        return response()->json([
            'success' => true,
            'message' => 'Reseña marcada como útil',
            'data' => [
                'helpful_count' => $review->helpful_count,
                'helpful_percentage' => $review->helpful_percentage,
            ],
        ]);
    }

    /**
     * Mark review as not helpful
     */
    public function markNotHelpful(Review $review): JsonResponse
    {
        $review->markAsNotHelpful();

        return response()->json([
            'success' => true,
            'message' => 'Reseña marcada como no útil',
            'data' => [
                'not_helpful_count' => $review->not_helpful_count,
                'helpful_percentage' => $review->helpful_percentage,
            ],
        ]);
    }

    /**
     * Admin: Display all reviews
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $query = Review::with(['user', 'product']);

        // Filtros
        if ($request->has('approved')) {
            $query->where('is_approved', $request->approved);
        }

        if ($request->has('verified')) {
            $query->where('is_verified_purchase', $request->verified);
        }

        if ($request->has('rating')) {
            $query->byRating($request->rating);
        }

        // Ordenamiento
        $orderBy = $request->get('order_by', 'created_at');
        $orderDirection = $request->get('order_direction', 'desc');
        $query->orderBy($orderBy, $orderDirection);

        // Paginación
        $perPage = $request->get('per_page', 15);
        $reviews = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $reviews->items(),
            'pagination' => [
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'per_page' => $reviews->perPage(),
                'total' => $reviews->total(),
            ],
        ]);
    }

    /**
     * Admin: Approve review
     */
    public function approve(Review $review): JsonResponse
    {
        $review->update(['is_approved' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Reseña aprobada exitosamente',
            'data' => $review->fresh(),
        ]);
    }

    /**
     * Admin: Reject review
     */
    public function reject(Review $review): JsonResponse
    {
        $review->update(['is_approved' => false]);

        return response()->json([
            'success' => true,
            'message' => 'Reseña rechazada',
            'data' => $review->fresh(),
        ]);
    }
} 