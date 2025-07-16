import api from './api';

export interface PaymentMethod {
  id: string;
  name: string;
  payment_type_id: string;
  thumbnail: string;
  secure_thumbnail: string;
}

export interface PaymentMethodsResponse {
  success: boolean;
  data: PaymentMethod[];
}

export interface CreatePreferenceRequest {
  order_id: number;
}

export interface CreatePreferenceResponse {
  success: boolean;
  data: {
    preference_id: string;
    init_point: string;
    sandbox_init_point: string;
    order: any;
  };
}

export interface PaymentStatusResponse {
  success: boolean;
  data: {
    payment_status: string;
    payment_method: string;
    transaction_amount: number;
    order_status: string;
    order_payment_status: string;
  };
}

class MercadoPagoService {
  /**
   * Obtener métodos de pago disponibles
   */
  async getPaymentMethods(): Promise<PaymentMethodsResponse> {
    const response = await api.get('/mercadopago/payment-methods');
    return response.data;
  }

  /**
   * Crear preferencia de pago para una orden
   */
  async createPreference(orderId: number): Promise<CreatePreferenceResponse> {
    const response = await api.post('/mercadopago/create-preference', {
      order_id: orderId,
    });
    return response.data;
  }

  /**
   * Obtener estado del pago de una orden
   */
  async getPaymentStatus(orderId: number): Promise<PaymentStatusResponse> {
    const response = await api.get(`/mercadopago/orders/${orderId}/payment-status`);
    return response.data;
  }

  /**
   * Redirigir a MercadoPago para el pago
   */
  redirectToPayment(initPoint: string): void {
    window.location.href = initPoint;
  }

  /**
   * Procesar respuesta de MercadoPago después del pago
   */
  processPaymentResponse(searchParams: URLSearchParams): {
    paymentId: string | null;
    preferenceId: string | null;
    externalReference: string | null;
    status: string | null;
    paymentMethodType: string | null;
    amount: string | null;
  } {
    return {
      paymentId: searchParams.get('payment_id'),
      preferenceId: searchParams.get('preference_id'),
      externalReference: searchParams.get('external_reference'),
      status: searchParams.get('status'),
      paymentMethodType: searchParams.get('payment_method_type'),
      amount: searchParams.get('amount'),
    };
  }

  /**
   * Verificar si el pago fue exitoso basado en los parámetros de URL
   */
  isPaymentSuccessful(searchParams: URLSearchParams): boolean {
    const status = searchParams.get('status');
    const paymentId = searchParams.get('payment_id');
    
    return status === 'approved' && paymentId !== null;
  }

  /**
   * Verificar si el pago está pendiente
   */
  isPaymentPending(searchParams: URLSearchParams): boolean {
    const status = searchParams.get('status');
    return status === 'pending' || status === 'in_process';
  }

  /**
   * Verificar si el pago falló
   */
  isPaymentFailed(searchParams: URLSearchParams): boolean {
    const status = searchParams.get('status');
    return status === 'rejected' || status === 'cancelled';
  }
}

export default new MercadoPagoService(); 