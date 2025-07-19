<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use App\Models\Wishlist; // Added this import for Wishlist model

class AdminUserController extends Controller
{
    /**
     * Display a listing of users for admin
     */
    public function index(Request $request): JsonResponse
    {
        try {
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

            Log::info('Admin users list accessed', [
                'admin_id' => auth()->id(),
                'filters' => $request->only(['search', 'is_admin', 'email_verified']),
                'total_users' => $users->total(),
            ]);

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
        } catch (\Exception $e) {
            Log::error('Error in admin users index', [
                'admin_id' => auth()->id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al cargar usuarios',
            ], 500);
        }
    }

    /**
     * Display the specified user for admin
     */
    public function show(User $user): JsonResponse
    {
        try {
            Log::info('Admin user details accessed', [
                'admin_id' => auth()->id(),
                'user_id' => $user->id,
            ]);

            return response()->json([
                'success' => true,
                'data' => $user,
            ]);
        } catch (\Exception $e) {
            Log::error('Error in admin user show', [
                'admin_id' => auth()->id(),
                'user_id' => $user->id ?? null,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al cargar usuario',
            ], 500);
        }
    }

    /**
     * Store a newly created user
     */
    public function store(Request $request): JsonResponse
    {
        try {
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

            Log::info('Admin user created', [
                'admin_id' => auth()->id(),
                'user_id' => $user->id,
                'user_email' => $user->email,
                'is_admin' => $user->is_admin,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Usuario creado exitosamente',
                'data' => $user,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Validation error in admin user creation', [
                'admin_id' => auth()->id(),
                'errors' => $e->errors(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error in admin user creation', [
                'admin_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al crear usuario',
            ], 500);
        }
    }

    /**
     * Update the specified user
     */
    public function update(Request $request, User $user): JsonResponse
    {
        try {
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
            $changes = [];
            
            if (isset($validated['name']) && $validated['name'] !== $user->name) {
                $updateData['name'] = $validated['name'];
                $changes['name'] = ['old' => $user->name, 'new' => $validated['name']];
            }
            
            if (isset($validated['email']) && $validated['email'] !== $user->email) {
                $updateData['email'] = $validated['email'];
                $changes['email'] = ['old' => $user->email, 'new' => $validated['email']];
            }
            
            if (isset($validated['password'])) {
                $updateData['password'] = Hash::make($validated['password']);
                $changes['password'] = 'updated';
            }
            
            if (isset($validated['is_admin']) && $validated['is_admin'] !== $user->is_admin) {
                $updateData['is_admin'] = $validated['is_admin'];
                $changes['is_admin'] = ['old' => $user->is_admin, 'new' => $validated['is_admin']];
            }

            if (!empty($updateData)) {
                $user->update($updateData);

                Log::info('Admin user updated', [
                    'admin_id' => auth()->id(),
                    'user_id' => $user->id,
                    'changes' => $changes,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Usuario actualizado exitosamente',
                'data' => $user->fresh(),
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Validation error in admin user update', [
                'admin_id' => auth()->id(),
                'user_id' => $user->id,
                'errors' => $e->errors(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error in admin user update', [
                'admin_id' => auth()->id(),
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar usuario',
            ], 500);
        }
    }

    /**
     * Remove the specified user
     */
    public function destroy(User $user): JsonResponse
    {
        try {
            // Verificar que no se elimine a sí mismo
            if ($user->id === auth()->id()) {
                Log::warning('Admin attempted to delete own account', [
                    'admin_id' => auth()->id(),
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'No puedes eliminar tu propia cuenta',
                ], 422);
            }

            // Verificar que no se elimine el último admin
            if ($user->is_admin) {
                $adminCount = User::where('is_admin', true)->count();
                if ($adminCount <= 1) {
                    Log::warning('Admin attempted to delete last admin', [
                        'admin_id' => auth()->id(),
                        'target_user_id' => $user->id,
                    ]);

                    return response()->json([
                        'success' => false,
                        'message' => 'No se puede eliminar el último administrador',
                    ], 422);
                }
            }

            // Verificar si el usuario tiene órdenes
            $orderCount = $user->orders()->count();
            if ($orderCount > 0) {
                Log::warning('Admin attempted to delete user with orders', [
                    'admin_id' => auth()->id(),
                    'user_id' => $user->id,
                    'order_count' => $orderCount,
                ]);

                return response()->json([
                    'success' => false,
                    'message' => "No se puede eliminar el usuario porque tiene {$orderCount} órdenes asociadas",
                    'data' => [
                        'order_count' => $orderCount,
                        'orders' => $user->orders()->select('id', 'order_number', 'status')->get()
                    ]
                ], 422);
            }

            $userData = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => $user->is_admin,
            ];

            $user->delete();

            Log::info('Admin user deleted', [
                'admin_id' => auth()->id(),
                'deleted_user' => $userData,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Usuario eliminado exitosamente',
            ]);
        } catch (\Exception $e) {
            Log::error('Error in admin user deletion', [
                'admin_id' => auth()->id(),
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar usuario',
            ], 500);
        }
    }

    /**
     * Get user statistics
     */
    public function getUserStatistics(User $user): JsonResponse
    {
        try {
            $orders = Order::where('user_id', $user->id);

            $totalOrders = (int) $orders->count();
            $totalSpent = (float) $orders->sum('total_amount');
            $averageOrderValue = $totalOrders > 0 ? (float) ($totalSpent / $totalOrders) : 0.0;
            $lastOrder = $orders->latest()->first();
            $lastOrderDate = $lastOrder && $lastOrder->created_at ? $lastOrder->created_at : null;

            // Query limpio para evitar ONLY_FULL_GROUP_BY
            $ordersByStatus = Order::where('user_id', $user->id)
                ->selectRaw('status, count(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status')
                ->toArray();

            Log::info('Admin accessed user statistics', [
                'admin_id' => auth()->id(),
                'user_id' => $user->id,
                'total_orders' => $totalOrders,
                'total_spent' => $totalSpent,
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
        } catch (\Exception $e) {
            Log::error('Error in admin user statistics', [
                'admin_id' => auth()->id(),
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas del usuario',
            ], 500);
        }
    }

    /**
     * Get general users statistics
     */
    public function getUsersStatistics(): JsonResponse
    {
        try {
            $totalUsers = User::count();
            $newUsersThisMonth = User::whereMonth('created_at', now()->month)->count();
            $verifiedUsers = User::whereNotNull('email_verified_at')->count();
            $adminUsers = User::where('is_admin', true)->count();
            $usersWithOrders = User::whereHas('orders')->count();

            Log::info('Admin accessed general user statistics', [
                'admin_id' => auth()->id(),
                'total_users' => $totalUsers,
                'new_users_this_month' => $newUsersThisMonth,
            ]);

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
        } catch (\Exception $e) {
            Log::error('Error in admin general user statistics', [
                'admin_id' => auth()->id(),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas generales',
            ], 500);
        }
    }

    /**
     * Obtener la wishlist de un usuario específico
     */
    public function getUserWishlist($userId)
    {
        try {
            Log::info('Admin accessing user wishlist', [
                'admin_id' => auth()->id(),
                'user_id' => $userId,
            ]);

            $user = User::findOrFail($userId);
            
            $wishlistItems = Wishlist::with(['product.category'])
                ->where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->get();

            Log::info('Wishlist items found', [
                'admin_id' => auth()->id(),
                'user_id' => $userId,
                'wishlist_count' => $wishlistItems->count(),
                'wishlist_items' => $wishlistItems->map(function($item) {
                    return [
                        'id' => $item->id,
                        'product_id' => $item->product_id,
                        'product_name' => $item->product->name ?? 'N/A',
                        'notes' => $item->notes,
                    ];
                }),
            ]);

            return response()->json([
                'success' => true,
                'data' => $wishlistItems,
                'message' => 'Wishlist obtenida correctamente'
            ]);
        } catch (\Exception $e) {
            Log::error('Error in admin user wishlist', [
                'admin_id' => auth()->id(),
                'user_id' => $userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener wishlist: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Debug endpoint para probar wishlist
     */
    public function debugWishlistTest()
    {
        try {
            // Verificar si hay datos de wishlist
            $totalWishlistItems = Wishlist::count();
            $usersWithWishlist = Wishlist::distinct('user_id')->count();
            $productsInWishlist = Wishlist::distinct('product_id')->count();

            // Obtener algunos ejemplos
            $sampleWishlist = Wishlist::with(['user', 'product'])
                ->take(5)
                ->get()
                ->map(function($item) {
                    return [
                        'id' => $item->id,
                        'user_id' => $item->user_id,
                        'user_name' => $item->user->name ?? 'N/A',
                        'product_id' => $item->product_id,
                        'product_name' => $item->product->name ?? 'N/A',
                        'notes' => $item->notes,
                        'created_at' => $item->created_at,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => [
                    'total_wishlist_items' => $totalWishlistItems,
                    'users_with_wishlist' => $usersWithWishlist,
                    'products_in_wishlist' => $productsInWishlist,
                    'sample_wishlist' => $sampleWishlist,
                ],
                'message' => 'Debug de wishlist completado'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error en debug: ' . $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
} 