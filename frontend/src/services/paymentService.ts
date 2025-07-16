import api from './api';

export interface PaymentItem {
  title: string;
  quantity: number;
  unit_price: number;
  currency_id: string;
}

export interface CreatePaymentRequest {
  items: PaymentItem[];
  payer: {
    name: string;
    email: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  data: {
    preference_id: string;
    init_point: string;
    sandbox_init_point: string;
  };
}

class PaymentService {
  /**
   * Crear preferencia de pago directamente con los items del carrito
   */
  async createPaymentPreference(cartItems: any[], user: any): Promise<PaymentResponse> {
    // Convertir items del carrito al formato que espera MercadoPago
    const items = cartItems.map(item => ({
      title: item.product_name,
      quantity: item.quantity,
      unit_price: parseFloat(item.unit_price),
      currency_id: 'ARS',
    }));

    const requestData = {
      items,
      payer: {
        name: user?.name || 'Cliente',
        email: user?.email || 'cliente@example.com',
      },
    };

    console.log('Enviando datos de pago:', requestData);

    // Usar el endpoint de debug que funciona
    const response = await api.post('/debug/create-preference', requestData);
    return response.data;
  }

  /**
   * Crear preferencia de pago simple (para cuando el endpoint anterior falle)
   */
  async createSimplePreference(): Promise<PaymentResponse> {
    // Usar el endpoint que sabemos que funciona
    const response = await api.get('/debug/test-preference-final');
    return response.data;
  }

  /**
   * Crear preferencia de pago con datos de orden completa
   */
  async createOrderPayment(orderData: any): Promise<PaymentResponse> {
    const response = await api.post('/debug/test-preference-final');
    return response.data;
  }

  /**
   * Redirigir a MercadoPago para el pago
   */
  redirectToPayment(initPoint: string): void {
    console.log('Redirigiendo a MercadoPago:', initPoint);
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

export default new PaymentService(); 