<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Display a listing of user's notifications
     */
    public function index(Request $request): JsonResponse
    {
        $query = Notification::where('user_id', Auth::id());

        // Filtros
        if ($request->has('unread')) {
            $query->unread();
        }

        if ($request->has('read')) {
            $query->read();
        }

        if ($request->has('important')) {
            $query->important();
        }

        if ($request->has('type')) {
            $query->byType($request->type);
        }

        // Ordenamiento
        $orderBy = $request->get('order_by', 'created_at');
        $orderDirection = $request->get('order_direction', 'desc');
        $query->orderBy($orderBy, $orderDirection);

        // Paginación
        $perPage = $request->get('per_page', 20);
        $notifications = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $notifications->items(),
            'pagination' => [
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
            ],
        ]);
    }

    /**
     * Display unread notifications
     */
    public function unread(): JsonResponse
    {
        $notifications = Notification::where('user_id', Auth::id())
            ->unread()
            ->orderBy('created_at', 'desc')
            ->get();

        $unreadCount = $notifications->count();
        $importantCount = $notifications->where('is_important', true)->count();

        return response()->json([
            'success' => true,
            'data' => [
                'notifications' => $notifications,
                'unread_count' => $unreadCount,
                'important_count' => $importantCount,
            ],
        ]);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(Notification $notification): JsonResponse
    {
        // Verificar que la notificación pertenece al usuario
        if ($notification->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado',
            ], 403);
        }

        $notification->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Notificación marcada como leída',
            'data' => $notification->fresh(),
        ]);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(): JsonResponse
    {
        Notification::where('user_id', Auth::id())
            ->unread()
            ->update(['read_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'Todas las notificaciones marcadas como leídas',
        ]);
    }

    /**
     * Mark notification as unread
     */
    public function markAsUnread(Notification $notification): JsonResponse
    {
        // Verificar que la notificación pertenece al usuario
        if ($notification->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado',
            ], 403);
        }

        $notification->markAsUnread();

        return response()->json([
            'success' => true,
            'message' => 'Notificación marcada como no leída',
            'data' => $notification->fresh(),
        ]);
    }

    /**
     * Delete notification
     */
    public function destroy(Notification $notification): JsonResponse
    {
        // Verificar que la notificación pertenece al usuario
        if ($notification->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado',
            ], 403);
        }

        $notification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notificación eliminada',
        ]);
    }

    /**
     * Get notification statistics
     */
    public function statistics(): JsonResponse
    {
        $userId = Auth::id();

        $stats = [
            'total_notifications' => Notification::where('user_id', $userId)->count(),
            'unread_count' => Notification::where('user_id', $userId)->unread()->count(),
            'important_count' => Notification::where('user_id', $userId)->important()->count(),
            'recent_notifications' => Notification::where('user_id', $userId)
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
     * Get notifications by type
     */
    public function byType(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|string',
        ]);

        $notifications = Notification::where('user_id', Auth::id())
            ->byType($validated['type'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $notifications->items(),
            'pagination' => [
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
            ],
        ]);
    }

    /**
     * Get notification types
     */
    public function types(): JsonResponse
    {
        $types = [
            Notification::TYPE_ORDER_STATUS => 'Estado de Pedido',
            Notification::TYPE_PAYMENT_RECEIVED => 'Pago Recibido',
            Notification::TYPE_STOCK_ALERT => 'Alerta de Stock',
            Notification::TYPE_REVIEW_APPROVED => 'Reseña Aprobada',
            Notification::TYPE_COUPON_EXPIRING => 'Cupón por Vencer',
            Notification::TYPE_SHIPPING_UPDATE => 'Actualización de Envío',
        ];

        return response()->json([
            'success' => true,
            'data' => $types,
        ]);
    }

    /**
     * Create a test notification (for development)
     */
    public function createTest(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'title' => 'required|string',
            'message' => 'required|string',
            'is_important' => 'boolean',
        ]);

        $notification = Notification::create([
            'user_id' => Auth::id(),
            'type' => $validated['type'],
            'title' => $validated['title'],
            'message' => $validated['message'],
            'is_important' => $validated['is_important'] ?? false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Notificación de prueba creada',
            'data' => $notification,
        ], 201);
    }

    /**
     * Clear all notifications
     */
    public function clear(): JsonResponse
    {
        Notification::where('user_id', Auth::id())->delete();

        return response()->json([
            'success' => true,
            'message' => 'Todas las notificaciones eliminadas',
        ]);
    }

    /**
     * Clear read notifications
     */
    public function clearRead(): JsonResponse
    {
        Notification::where('user_id', Auth::id())
            ->read()
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notificaciones leídas eliminadas',
        ]);
    }
} 