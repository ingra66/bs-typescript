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
        $accessToken = config('services.mercadopago.access_token');
        
        if (!$accessToken) {
            Log::error('MercadoPago access token no configurado');
            throw new \Exception('MercadoPago access token no configurado');
        }
        
        Log::info('Configurando MercadoPago con token:', ['token_length' => strlen($accessToken)]);
        MercadoPagoConfig::setAccessToken($accessToken);
        
        $this->preferenceClient = new PreferenceClient();
        $this->paymentClient = new PaymentClient();
    }

    /**
     * Crear preferencia de pago
     */
    public function createPreference(Order $order): array
    {
        try {
            Log::info('Creando preferencia de MercadoPago para orden:', [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'total_amount' => $order->total_amount,
                'items_count' => $order->items->count(),
            ]);
            
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
            
            Log::info('Items creados para MercadoPago:', ['items' => $items]);

            // Agregar envío si existe
            if ($order->shipping_amount > 0) {
                $items[] = [
                    'title' => 'Envío',
                    'quantity' => 1,
                    'unit_price' => (float) $order->shipping_amount,
                    'currency_id' => 'ARS',
                ];
            }

            // Preparar datos de preferencia
            $preferenceData = [
                'items' => $items,
                'external_reference' => $order->order_number,
                'auto_return' => 'approved',
                'expires' => true,
                'expiration_date_to' => now()->addHours(24)->toISOString(),
            ];
            
            // Agregar payer solo si tenemos la información
            if (isset($order->user->email)) {
                $preferenceData['payer'] = [
                    'name' => $order->shipping_address['name'] ?? 'Cliente',
                    'email' => $order->user->email,
                ];
            }
            
            // Agregar URLs de notificación y retorno
            $notificationUrl = config('services.mercadopago.notification_url');
            if ($notificationUrl && filter_var($notificationUrl, FILTER_VALIDATE_URL)) {
                $preferenceData['notification_url'] = $notificationUrl;
            }
            
            // Siempre incluir back_urls para evitar el error de auto_return
            // Para desarrollo, usar URLs de MercadoPago que siempre funcionan
            $environment = config('services.mercadopago.environment', 'sandbox');
            
            if ($environment === 'sandbox') {
                // En desarrollo/sandbox, usar URLs de MercadoPago
                $preferenceData['back_urls'] = [
                    'success' => 'https://www.mercadopago.com.ar',
                    'failure' => 'https://www.mercadopago.com.ar',
                    'pending' => 'https://www.mercadopago.com.ar',
                ];
            } else {
                // En producción, usar las URLs configuradas
                $backUrls = config('services.mercadopago.back_urls');
                if ($backUrls && is_array($backUrls)) {
                    $validBackUrls = [];
                    foreach ($backUrls as $key => $url) {
                        if (filter_var($url, FILTER_VALIDATE_URL)) {
                            $validBackUrls[$key] = $url;
                        }
                    }
                    if (!empty($validBackUrls)) {
                        $preferenceData['back_urls'] = $validBackUrls;
                    } else {
                        // Fallback a URLs de MercadoPago
                        $preferenceData['back_urls'] = [
                            'success' => 'https://www.mercadopago.com.ar',
                            'failure' => 'https://www.mercadopago.com.ar',
                            'pending' => 'https://www.mercadopago.com.ar',
                        ];
                    }
                } else {
                    $preferenceData['back_urls'] = [
                        'success' => 'https://www.mercadopago.com.ar',
                        'failure' => 'https://www.mercadopago.com.ar',
                        'pending' => 'https://www.mercadopago.com.ar',
                    ];
                }
            }
            
            Log::info('Datos de preferencia preparados:', ['preference_data' => $preferenceData]);
            
            // Log adicional para debug
            Log::info('Datos de orden para debug:', [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'total_amount' => $order->total_amount,
                'user_email' => $order->user->email ?? 'no email',
                'shipping_address' => $order->shipping_address,
                'items_count' => $order->items->count(),
            ]);
            
            // Crear preferencia
            Log::info('Llamando a MercadoPago API...');
            $preference = $this->preferenceClient->create($preferenceData);
            Log::info('Preferencia creada exitosamente:', ['preference_id' => $preference->id]);

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
            // Capturar más detalles del error usando los métodos correctos de MPResponse
            $apiResponse = $e->getApiResponse();
            $statusCode = $apiResponse ? $apiResponse->getStatusCode() : 'unknown';
            
            // Intentar obtener el contenido de la respuesta de diferentes maneras
            $responseContent = 'no content';
            if ($apiResponse) {
                try {
                    // Intentar diferentes métodos para obtener el contenido
                    if (method_exists($apiResponse, 'getContent')) {
                        $responseContent = $apiResponse->getContent();
                    } elseif (method_exists($apiResponse, 'getBody')) {
                        $responseContent = $apiResponse->getBody();
                    } elseif (method_exists($apiResponse, 'getResponse')) {
                        $responseContent = $apiResponse->getResponse();
                    } else {
                        // Si no hay método específico, convertir a array
                        $responseContent = (array) $apiResponse;
                    }
                } catch (\Exception $contentError) {
                    $responseContent = 'Error getting content: ' . $contentError->getMessage();
                }
            }
            
            Log::error('MercadoPago Preference Error: ' . $e->getMessage(), [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
                'error_code' => $statusCode,
                'response_content' => $responseContent,
                'api_response_class' => $apiResponse ? get_class($apiResponse) : 'null',
                'api_response_methods' => $apiResponse ? get_class_methods($apiResponse) : [],
            ]);

            return [
                'success' => false,
                'error' => 'Error al crear preferencia de pago: ' . $e->getMessage(),
                'details' => [
                    'code' => $statusCode,
                    'response_content' => $responseContent,
                    'api_response_class' => $apiResponse ? get_class($apiResponse) : 'null',
                    'api_response_methods' => $apiResponse ? get_class_methods($apiResponse) : [],
                ],
            ];
        } catch (\Exception $e) {
            Log::error('Error general al crear preferencia: ' . $e->getMessage(), [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'error' => 'Error general al crear preferencia de pago: ' . $e->getMessage(),
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