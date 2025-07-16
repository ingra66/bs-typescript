<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use App\Models\Coupon;
use App\Models\ShippingZone;
use App\Models\TaxRate;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Display a listing of user's orders
     */
    public function index(Request $request): JsonResponse
    {
        $query = Order::where('user_id', Auth::id())
            ->with(['items.product', 'items.product.category']);

        // Filtros
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        // Ordenamiento
        $orderBy = $request->get('order_by', 'created_at');
        $orderDirection = $request->get('order_direction', 'desc');
        $query->orderBy($orderBy, $orderDirection);

        // Paginación
        $perPage = $request->get('per_page', 10);
        $orders = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $orders->items(),
            'pagination' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
            ],
        ]);
    }

    /**
     * Create a new order from cart
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'shipping_address' => 'required|array',
            'shipping_address.name' => 'required|string',
            'shipping_address.address' => 'required|string',
            'shipping_address.city' => 'required|string',
            'shipping_address.state' => 'required|string',
            'shipping_address.postal_code' => 'required|string',
            'shipping_address.country' => 'required|string',
            'shipping_address.phone' => 'nullable|string',
            'billing_address' => 'nullable|array',
            'billing_address.name' => 'required_with:billing_address|string',
            'billing_address.address' => 'required_with:billing_address|string',
            'billing_address.city' => 'required_with:billing_address|string',
            'billing_address.state' => 'required_with:billing_address|string',
            'billing_address.postal_code' => 'required_with:billing_address|string',
            'billing_address.country' => 'required_with:billing_address|string',
            'coupon_code' => 'nullable|string|exists:coupons,code',
            'notes' => 'nullable|string',
        ]);

        // Obtener items del carrito
        $userId = Auth::id();
        \Log::info('Creando orden para usuario: ' . $userId);
        
        $cartItems = CartItem::where('user_id', $userId)
            ->with('product')
            ->get();

        \Log::info('Items en carrito encontrados: ' . $cartItems->count());

        if ($cartItems->isEmpty()) {
            \Log::warning('Carrito vacío para usuario: ' . $userId);
            return response()->json([
                'success' => false,
                'message' => 'El carrito está vacío',
            ], 422);
        }

        // Validar stock
        foreach ($cartItems as $item) {
            if (!$item->product->isInStock() || $item->quantity > $item->product->stock) {
                return response()->json([
                    'success' => false,
                    'message' => "El producto '{$item->product->name}' no está disponible en la cantidad solicitada",
                ], 422);
            }
        }

        try {
            DB::beginTransaction();

            // Calcular subtotal
            $subtotal = $cartItems->sum(function ($item) {
                return $item->product->price * $item->quantity;
            });

            // Aplicar cupón si existe
            $discount = 0;
            $coupon = null;
            if (!empty($validated['coupon_code'])) {
                $coupon = Coupon::where('code', $validated['coupon_code'])->first();
                if ($coupon && $coupon->isValid()) {
                    $discount = $coupon->calculateDiscount($subtotal);
                    $coupon->incrementUsage();
                }
            }

            // Calcular envío
            $shippingAmount = $this->calculateShipping(
                $subtotal,
                $validated['shipping_address']
            );

            // Calcular impuestos
            $taxAmount = $this->calculateTaxes(
                $subtotal - $discount,
                $validated['shipping_address']
            );

            // Calcular total
            $totalAmount = $subtotal - $discount + $shippingAmount + $taxAmount;

            // Crear orden
            $order = Order::create([
                'user_id' => Auth::id(),
                'order_number' => 'ORD-' . time() . '-' . Auth::id(),
                'total_amount' => $totalAmount,
                'tax_amount' => $taxAmount,
                'shipping_amount' => $shippingAmount,
                'shipping_address' => $validated['shipping_address'],
                'billing_address' => $validated['billing_address'] ?? $validated['shipping_address'],
                'notes' => $validated['notes'] ?? null,
            ]);

            // Crear items de la orden
            foreach ($cartItems as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'product_name' => $cartItem->product->name,
                    'product_sku' => $cartItem->product->sku,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $cartItem->product->price,
                    'total_price' => $cartItem->product->price * $cartItem->quantity,
                    'product_data' => [
                        'images' => $cartItem->product->images,
                        'category' => $cartItem->product->category->name,
                    ],
                ]);

                // Actualizar stock
                $cartItem->product->decrement('stock', $cartItem->quantity);
            }

            // Limpiar carrito
            CartItem::where('user_id', Auth::id())->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Orden creada exitosamente',
                'data' => $order->load(['items.product', 'items.product.category']),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la orden',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified order
     */
    public function show(Order $order): JsonResponse
    {
        // Verificar que la orden pertenece al usuario
        if ($order->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado',
            ], 403);
        }

        $order->load(['items.product.category', 'user']);

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    /**
     * Cancel an order
     */
    public function cancel(Order $order): JsonResponse
    {
        // Verificar que la orden pertenece al usuario
        if ($order->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado',
            ], 403);
        }

        if (!$order->canBeCancelled()) {
            return response()->json([
                'success' => false,
                'message' => 'Esta orden no puede ser cancelada',
            ], 422);
        }

        try {
            DB::beginTransaction();

            $order->update(['status' => Order::STATUS_CANCELLED]);

            // Restaurar stock
            foreach ($order->items as $item) {
                $item->product->increment('stock', $item->quantity);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Orden cancelada exitosamente',
                'data' => $order->fresh(),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Error al cancelar la orden',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Calculate shipping cost
     */
    private function calculateShipping(float $subtotal, array $address): float
    {
        $shippingZone = ShippingZone::active()
            ->where(function ($query) use ($address) {
                $query->whereJsonContains('countries', $address['country'])
                      ->orWhereNull('countries');
            })
            ->where(function ($query) use ($address) {
                $query->whereJsonContains('states', $address['state'])
                      ->orWhereNull('states');
            })
            ->where(function ($query) use ($address) {
                $query->whereJsonContains('cities', $address['city'])
                      ->orWhereNull('cities');
            })
            ->first();

        if ($shippingZone) {
            return $shippingZone->calculateShippingCost($subtotal);
        }

        return 0; // Envío gratis por defecto
    }

    /**
     * Calculate taxes
     */
    private function calculateTaxes(float $subtotal, array $address): float
    {
        $taxRates = TaxRate::active()
            ->byLocation(
                $address['country'] ?? null,
                $address['state'] ?? null,
                $address['city'] ?? null,
                $address['postal_code'] ?? null
            )
            ->orderBy('priority')
            ->get();

        $totalTax = 0;
        foreach ($taxRates as $taxRate) {
            $totalTax += $taxRate->calculateTax($subtotal);
        }

        return $totalTax;
    }

    /**
     * Get order statistics
     */
    public function statistics(): JsonResponse
    {
        $userId = Auth::id();

        $stats = [
            'total_orders' => Order::where('user_id', $userId)->count(),
            'pending_orders' => Order::where('user_id', $userId)
                ->where('status', Order::STATUS_PENDING)
                ->count(),
            'total_spent' => Order::where('user_id', $userId)
                ->where('payment_status', Order::PAYMENT_STATUS_PAID)
                ->sum('total_amount'),
            'recent_orders' => Order::where('user_id', $userId)
                ->with(['items.product'])
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * Admin: Display all orders
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $query = Order::with(['user', 'items.product']);

        // Filtros
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Ordenamiento
        $orderBy = $request->get('order_by', 'created_at');
        $orderDirection = $request->get('order_direction', 'desc');
        $query->orderBy($orderBy, $orderDirection);

        // Paginación
        $perPage = $request->get('per_page', 15);
        $orders = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $orders->items(),
            'pagination' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
            ],
        ]);
    }

    /**
     * Admin: Display the specified order
     */
    public function adminShow(Order $order): JsonResponse
    {
        $order->load(['user', 'items.product.category']);

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    /**
     * Admin: Update order status
     */
    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,paid,shipped,delivered,cancelled',
            'tracking_number' => 'nullable|string',
        ]);

        $order->update([
            'status' => $validated['status'],
            'notes' => $order->notes . "\n" . now()->format('Y-m-d H:i:s') . " - Estado actualizado a: {$validated['status']}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Estado de la orden actualizado',
            'data' => $order->fresh(),
        ]);
    }
} 