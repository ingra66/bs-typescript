<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CouponController extends Controller
{
    /**
     * Validate a coupon code
     */
    public function validate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string',
            'subtotal' => 'required|numeric|min:0',
        ]);

        $coupon = Coupon::where('code', $validated['code'])->first();

        if (!$coupon) {
            return response()->json([
                'success' => false,
                'message' => 'Cupón no encontrado',
            ], 404);
        }

        if (!$coupon->isValid()) {
            return response()->json([
                'success' => false,
                'message' => 'Cupón no válido o expirado',
            ], 422);
        }

        if ($validated['subtotal'] < $coupon->minimum_amount) {
            return response()->json([
                'success' => false,
                'message' => "Monto mínimo requerido: $" . number_format($coupon->minimum_amount, 2),
            ], 422);
        }

        $discount = $coupon->calculateDiscount($validated['subtotal']);

        return response()->json([
            'success' => true,
            'data' => [
                'coupon' => $coupon,
                'discount' => $discount,
                'formatted_discount' => '$' . number_format($discount, 2),
                'final_amount' => $validated['subtotal'] - $discount,
                'formatted_final_amount' => '$' . number_format($validated['subtotal'] - $discount, 2),
            ],
        ]);
    }

    /**
     * Display a listing of coupons (admin)
     */
    public function index(Request $request): JsonResponse
    {
        $query = Coupon::query();

        if ($request->has('active')) {
            $query->active();
        }

        if ($request->has('valid')) {
            $query->valid();
        }

        $coupons = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $coupons->items(),
            'pagination' => [
                'current_page' => $coupons->currentPage(),
                'last_page' => $coupons->lastPage(),
                'per_page' => $coupons->perPage(),
                'total' => $coupons->total(),
            ],
        ]);
    }

    /**
     * Store a newly created coupon (admin)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:coupons,code',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'minimum_amount' => 'nullable|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:starts_at',
            'is_active' => 'boolean',
            'applicable_categories' => 'nullable|array',
            'excluded_products' => 'nullable|array',
        ]);

        $coupon = Coupon::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cupón creado exitosamente',
            'data' => $coupon,
        ], 201);
    }

    /**
     * Display the specified coupon (admin)
     */
    public function show(Coupon $coupon): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $coupon,
        ]);
    }

    /**
     * Update the specified coupon (admin)
     */
    public function update(Request $request, Coupon $coupon): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'sometimes|required|string|unique:coupons,code,' . $coupon->id,
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|required|in:percentage,fixed',
            'value' => 'sometimes|required|numeric|min:0',
            'minimum_amount' => 'nullable|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:starts_at',
            'is_active' => 'boolean',
            'applicable_categories' => 'nullable|array',
            'excluded_products' => 'nullable|array',
        ]);

        $coupon->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cupón actualizado exitosamente',
            'data' => $coupon->fresh(),
        ]);
    }

    /**
     * Remove the specified coupon (admin)
     */
    public function destroy(Coupon $coupon): JsonResponse
    {
        $coupon->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cupón eliminado exitosamente',
        ]);
    }
} 