<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\MercadoPagoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class MercadoPagoController extends Controller
{
    private $mercadoPagoService;

    public function __construct(MercadoPagoService $mercadoPagoService)
    {
        $this->mercadoPagoService = $mercadoPagoService;
    }

    /**
     * Create payment preference for an order
     */
    public function createPreference(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
        ]);

        $order = Order::where('id', $validated['order_id'])
            ->where('user_id', Auth::id())
            ->with(['items.product'])
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Orden no encontrada',
            ], 404);
        }

        if ($order->payment_status === Order::PAYMENT_STATUS_PAID) {
            return response()->json([
                'success' => false,
                'message' => 'La orden ya ha sido pagada',
            ], 422);
        }

        $result = $this->mercadoPagoService->createPreference($order);

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'data' => [
                    'preference_id' => $result['preference_id'],
                    'init_point' => $result['init_point'],
                    'sandbox_init_point' => $result['sandbox_init_point'],
                    'order' => $order,
                ],
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear preferencia de pago',
                'error' => $result['error'],
            ], 500);
        }
    }

    /**
     * Webhook para recibir notificaciones de MercadoPago
     */
    public function webhook(Request $request): JsonResponse
    {
        try {
            $type = $request->input('type');
            $data = $request->input('data');

            if ($type === 'payment') {
                $paymentId = $data['id'];
                $result = $this->mercadoPagoService->processPaymentNotification($paymentId);
                
                if (!$result['success']) {
                    \Log::error('MercadoPago Webhook Error: ' . $result['error']);
                }
            }

            return response()->json(['success' => true]);

        } catch (\Exception $e) {
            \Log::error('MercadoPago Webhook Error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }



    /**
     * Get payment status
     */
    public function getPaymentStatus(Order $order): JsonResponse
    {
        if ($order->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado',
            ], 403);
        }

        if (!$order->mp_payment_id) {
            return response()->json([
                'success' => false,
                'message' => 'No hay pago asociado a esta orden',
            ], 404);
        }

        $result = $this->mercadoPagoService->getPayment($order->mp_payment_id);

        if ($result['success']) {
            $payment = $result['payment'];
            return response()->json([
                'success' => true,
                'data' => [
                    'payment_status' => $payment->status,
                    'payment_method' => $payment->payment_method_id,
                    'transaction_amount' => $payment->transaction_amount,
                    'order_status' => $order->status,
                    'order_payment_status' => $order->payment_status,
                ],
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estado del pago',
                'error' => $result['error'],
            ], 500);
        }
    }

    /**
     * Get available payment methods
     */
    public function getPaymentMethods(): JsonResponse
    {
        $result = $this->mercadoPagoService->getPaymentMethods();

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'data' => $result['data'],
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener métodos de pago',
                'error' => $result['error'],
            ], 500);
        }
    }
} 