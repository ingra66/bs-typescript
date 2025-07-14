<?php

namespace App\Services;

use App\Models\Order;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\Client\Payment\PaymentClient;
use MercadoPago\MercadoPagoConfig;
use MercadoPago\Exceptions\MPApiException;
use Illuminate\Support\Facades\Log;

class MercadoPagoService
{
    private $preferenceClient;
    private $paymentClient;

    public function __construct()
    {
        // Configurar MercadoPago
        MercadoPagoConfig::setAccessToken(config('services.mercadopago.access_token'));
        MercadoPagoConfig::setEnvironment(config('services.mercadopago.environment', 'sandbox'));
        
        $this->preferenceClient = new PreferenceClient();
        $this->paymentClient = new PaymentClient();
    }

    /**
     * Crear preferencia de pago
     */
    public function createPreference(Order $order): array
    {
        try {
            // Crear items para MercadoPago
            $items = [];
            foreach ($order->items as $item) {
                $items[] = [
                    'title' => $item->product_name,
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'currency_id' => 'ARS',
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
            $preference = $this->preferenceClient->create([
                'items' => $items,
                'external_reference' => $order->order_number,
                'notification_url' => config('services.mercadopago.notification_url'),
                'back_urls' => config('services.mercadopago.back_urls'),
                'auto_return' => 'approved',
                'expires' => true,
                'expiration_date_to' => now()->addHours(24)->toISOString(),
                'payer' => [
                    'name' => $order->shipping_address['name'] ?? 'Cliente',
                    'email' => $order->user->email,
                ],
            ]);

            // Actualizar orden con el ID de preferencia
            $order->update([
                'mp_preference_id' => $preference->id,
            ]);

            return [
                'success' => true,
                'preference_id' => $preference->id,
                'init_point' => $preference->init_point,
                'sandbox_init_point' => $preference->sandbox_init_point,
            ];

        } catch (MPApiException $e) {
            Log::error('MercadoPago Preference Error: ' . $e->getMessage(), [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'error' => 'Error al crear preferencia de pago: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Obtener información de un pago
     */
    public function getPayment(string $paymentId): ?array
    {
        try {
            $payment = $this->paymentClient->get($paymentId);
            
            return [
                'success' => true,
                'payment' => $payment,
            ];

        } catch (MPApiException $e) {
            Log::error('MercadoPago Payment Error: ' . $e->getMessage(), [
                'payment_id' => $paymentId,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'error' => 'Error al obtener información del pago: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Procesar notificación de pago
     */
    public function processPaymentNotification(string $paymentId): array
    {
        $paymentInfo = $this->getPayment($paymentId);
        
        if (!$paymentInfo['success']) {
            return $paymentInfo;
        }

        $payment = $paymentInfo['payment'];
        
        // Buscar orden por external_reference
        $order = Order::where('order_number', $payment->external_reference)->first();

        if (!$order) {
            return [
                'success' => false,
                'error' => 'Orden no encontrada para el pago: ' . $paymentId,
            ];
        }

        return $this->updateOrderPaymentStatus($order, $payment);
    }

    /**
     * Actualizar estado de pago de la orden
     */
    private function updateOrderPaymentStatus(Order $order, $payment): array
    {
        $status = $payment->status;
        $paymentMethod = $payment->payment_method_id ?? 'unknown';

        try {
            // Actualizar orden según el estado del pago
            switch ($status) {
                case 'approved':
                    $order->update([
                        'payment_status' => Order::PAYMENT_STATUS_PAID,
                        'status' => Order::STATUS_PAID,
                        'mp_payment_id' => $payment->id,
                        'payment_method' => $paymentMethod,
                    ]);

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

            return [
                'success' => true,
                'order_id' => $order->id,
                'payment_status' => $status,
                'order_status' => $order->status,
            ];

        } catch (\Exception $e) {
            Log::error('Error updating order payment status: ' . $e->getMessage(), [
                'order_id' => $order->id,
                'payment_id' => $payment->id,
                'status' => $status,
            ]);

            return [
                'success' => false,
                'error' => 'Error al actualizar estado de la orden: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Crear notificación de pago
     */
    private function createPaymentNotification(Order $order, string $message): void
    {
        try {
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
                'action_url' => config('services.mercadopago.back_urls.success') . '?order_id=' . $order->id,
                'action_text' => 'Ver Orden',
            ]);
        } catch (\Exception $e) {
            Log::error('Error creating payment notification: ' . $e->getMessage());
        }
    }

    /**
     * Obtener métodos de pago disponibles
     */
    public function getPaymentMethods(): array
    {
        try {
            $client = new \MercadoPago\Client\PaymentMethod\PaymentMethodClient();
            $paymentMethods = $client->list();

            return [
                'success' => true,
                'data' => $paymentMethods,
            ];

        } catch (MPApiException $e) {
            Log::error('MercadoPago Payment Methods Error: ' . $e->getMessage());

            return [
                'success' => false,
                'error' => 'Error al obtener métodos de pago: ' . $e->getMessage(),
            ];
        }
    }
} 