<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\MercadoPagoConfig;
use MercadoPago\Exceptions\MPApiException;

class MercadoPagoController extends Controller
{
    public function __construct()
    {
        // Configurar MercadoPago
        MercadoPagoConfig::setAccessToken(config('services.mercadopago.access_token'));
        
        // Configurar ambiente (sandbox/production)
        $environment = config('services.mercadopago.environment', 'sandbox');
        MercadoPagoConfig::setEnvironment($environment);
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

        try {
            $client = new PreferenceClient();

            // Crear items para MercadoPago
            $items = [];
            foreach ($order->items as $item) {
                $items[] = [
                    'title' => $item->product_name,
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'currency_id' => 'ARS', // O configurar según país
                ];
            }

            // Agregar envío si existe
            if ($order->shipping_amount > 0) {
                $items[] = [
                    'title' => 'Envío',
                    'quantity' => 1,
                    'unit_price' => (float) $order->shipping_amount,
                    'currency_id' => 'ARS',
                ];
            }

            // Crear preferencia
            $preference = $client->create([
                'items' => $items,
                'external_reference' => $order->order_number,
                'notification_url' => config('services.mercadopago.notification_url'),
                'back_urls' => config('services.mercadopago.back_urls'),
                'auto_return' => 'approved',
                'expires' => true,
                'expiration_date_to' => now()->addHours(24)->toISOString(),
                'payer' => [
                    'name' => $order->shipping_address['name'] ?? 'Cliente',
                    'email' => Auth::user()->email,
                ],
            ]);

            // Actualizar orden con el ID de preferencia
            $order->update([
                'mp_preference_id' => $preference->id,
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'preference_id' => $preference->id,
                    'init_point' => $preference->init_point,
                    'sandbox_init_point' => $preference->sandbox_init_point,
                    'order' => $order,
                ],
            ]);

        } catch (MPApiException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear preferencia de pago',
                'error' => $e->getMessage(),
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
                
                // Obtener información del pago
                $client = new \MercadoPago\Client\Payment\PaymentClient();
                $payment = $client->get($paymentId);

                // Buscar orden por external_reference
                $order = Order::where('order_number', $payment->external_reference)->first();

                if ($order) {
                    $this->processPayment($order, $payment);
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
     * Process payment notification
     */
    private function processPayment(Order $order, $payment): void
    {
        $status = $payment->status;
        $paymentMethod = $payment->payment_method_id ?? 'unknown';

        // Actualizar orden según el estado del pago
        switch ($status) {
            case 'approved':
                $order->update([
                    'payment_status' => Order::PAYMENT_STATUS_PAID,
                    'status' => Order::STATUS_PAID,
                    'mp_payment_id' => $payment->id,
                    'payment_method' => $paymentMethod,
                ]);

                // Crear notificación
                $this->createPaymentNotification($order, 'Pago recibido exitosamente');
                break;

            case 'pending':
                $order->update([
                    'payment_status' => Order::PAYMENT_STATUS_PENDING,
                    'mp_payment_id' => $payment->id,
                    'payment_method' => $paymentMethod,
                ]);

                $this->createPaymentNotification($order, 'Pago pendiente de confirmación');
                break;

            case 'rejected':
            case 'cancelled':
                $order->update([
                    'payment_status' => Order::PAYMENT_STATUS_FAILED,
                    'mp_payment_id' => $payment->id,
                    'payment_method' => $paymentMethod,
                ]);

                $this->createPaymentNotification($order, 'Pago rechazado o cancelado');
                break;
        }
    }

    /**
     * Create payment notification
     */
    private function createPaymentNotification(Order $order, string $message): void
    {
        // Aquí puedes crear una notificación para el usuario
        // usando el modelo Notification que creamos
        \App\Models\Notification::create([
            'user_id' => $order->user_id,
            'type' => 'payment_received',
            'title' => 'Actualización de Pago',
            'message' => $message,
            'data' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'amount' => $order->total_amount,
            ],
            'action_url' => config('app.frontend_url') . '/orders/' . $order->id,
            'action_text' => 'Ver Orden',
        ]);
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

        try {
            $client = new \MercadoPago\Client\Payment\PaymentClient();
            $payment = $client->get($order->mp_payment_id);

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

        } catch (MPApiException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estado del pago',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get available payment methods
     */
    public function getPaymentMethods(): JsonResponse
    {
        try {
            $client = new \MercadoPago\Client\PaymentMethod\PaymentMethodClient();
            $paymentMethods = $client->list();

            return response()->json([
                'success' => true,
                'data' => $paymentMethods,
            ]);

        } catch (MPApiException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener métodos de pago',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
} 