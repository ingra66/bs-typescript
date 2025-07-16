<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of users for admin
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $query = User::query();

        // Filtros
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('is_admin')) {
            $query->where('is_admin', $request->boolean('is_admin'));
        }

        if ($request->has('email_verified')) {
            if ($request->boolean('email_verified')) {
                $query->whereNotNull('email_verified_at');
            } else {
                $query->whereNull('email_verified_at');
            }
        }

        // Ordenamiento
        $orderBy = $request->get('order_by', 'created_at');
        $orderDirection = $request->get('order_direction', 'desc');
        $query->orderBy($orderBy, $orderDirection);

        // Paginación
        $perPage = $request->get('per_page', 10);
        $users = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $users->items(),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    /**
     * Display the specified user for admin
     */
    public function adminShow(User $user): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $user,
        ]);
    }

    /**
     * Store a newly created user
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'is_admin' => 'boolean',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'is_admin' => $validated['is_admin'] ?? false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Usuario creado exitosamente',
            'data' => $user,
        ], 201);
    }

    /**
     * Update the specified user
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'password' => 'sometimes|required|string|min:8|confirmed',
            'is_admin' => 'sometimes|boolean',
        ]);

        $updateData = [];
        
        if (isset($validated['name'])) {
            $updateData['name'] = $validated['name'];
        }
        
        if (isset($validated['email'])) {
            $updateData['email'] = $validated['email'];
        }
        
        if (isset($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }
        
        if (isset($validated['is_admin'])) {
            $updateData['is_admin'] = $validated['is_admin'];
        }

        $user->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Usuario actualizado exitosamente',
            'data' => $user->fresh(),
        ]);
    }

    /**
     * Remove the specified user
     */
    public function destroy(User $user): JsonResponse
    {
        // Verificar que no se elimine a sí mismo
        if ($user->id === auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'No puedes eliminar tu propia cuenta',
            ], 422);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Usuario eliminado exitosamente',
        ]);
    }

    /**
     * Get user statistics
     */
    public function getUserStatistics(User $user): JsonResponse
    {
        try {
            $orders = Order::where('user_id', $user->id);

            $totalOrders = $orders->count();
            $totalSpent = $orders->sum('total_amount');
            $averageOrderValue = $totalOrders > 0 ? $totalSpent / $totalOrders : 0;
            $lastOrder = $orders->latest()->first();
            $lastOrderDate = $lastOrder && $lastOrder->created_at ? $lastOrder->created_at : null;

            // Query limpio para evitar ONLY_FULL_GROUP_BY
            $ordersByStatus = Order::where('user_id', $user->id)
                ->selectRaw('status, count(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status')
                ->toArray();

            \Log::info('Estadísticas usuario', [
                'user_id' => $user->id,
                'totalOrders' => $totalOrders,
                'totalSpent' => $totalSpent,
                'averageOrderValue' => $averageOrderValue,
                'lastOrder' => $lastOrder,
                'lastOrderDate' => $lastOrderDate,
                'ordersByStatus' => $ordersByStatus,
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'total_orders' => $totalOrders,
                    'total_spent' => $totalSpent,
                    'average_order_value' => $averageOrderValue,
                    'last_order_date' => $lastOrderDate,
                    'last_order' => $lastOrder ? [
                        'order_number' => $lastOrder->order_number ?? '',
                        'status' => $lastOrder->status ?? '',
                    ] : null,
                    'orders_by_status' => $ordersByStatus ?? [],
                ],
            ]);
        } catch (\Throwable $e) {
            \Log::error('Error en getUserStatistics', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get general users statistics
     */
    public function getUsersStatistics(): JsonResponse
    {
        $totalUsers = User::count();
        $newUsersThisMonth = User::whereMonth('created_at', now()->month)->count();
        $verifiedUsers = User::whereNotNull('email_verified_at')->count();
        $adminUsers = User::where('is_admin', true)->count();
        $usersWithOrders = User::whereHas('orders')->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => $totalUsers,
                'new_users_this_month' => $newUsersThisMonth,
                'verified_users' => $verifiedUsers,
                'admin_users' => $adminUsers,
                'users_with_orders' => $usersWithOrders,
            ],
        ]);
    }
} 