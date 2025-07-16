import api from './api';

export interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export interface BillingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface CreateOrderRequest {
  shipping_address: ShippingAddress;
  billing_address?: BillingAddress;
  coupon_code?: string;
  notes?: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_data: {
    images: string[];
    category: string;
  };
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  total_amount: number;
  tax_amount: number;
  shipping_amount: number;
  shipping_address: ShippingAddress;
  billing_address: BillingAddress;
  status: string;
  payment_status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface OrderResponse {
  success: boolean;
  data: Order;
}

export interface OrderStatistics {
  success: boolean;
  data: {
    total_orders: number;
    total_spent: number;
    average_order_value: number;
    orders_by_status: Record<string, number>;
  };
}

class OrderService {
  /**
   * Obtener todas las órdenes del usuario
   */
  async getOrders(params?: {
    status?: string;
    payment_status?: string;
    order_by?: string;
    order_direction?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  }): Promise<OrdersResponse> {
    const response = await api.get('/orders', { params });
    return response.data;
  }

  /**
   * Obtener una orden específica
   */
  async getOrder(orderId: number): Promise<OrderResponse> {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  }

  /**
   * Crear una nueva orden
   */
  async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    console.log('Enviando datos de orden:', orderData);
    const response = await api.post('/orders', orderData);
    return response.data;
  }

  /**
   * Cancelar una orden
   */
  async cancelOrder(orderId: number): Promise<OrderResponse> {
    const response = await api.post(`/orders/${orderId}/cancel`);
    return response.data;
  }

  /**
   * Obtener estadísticas de órdenes
   */
  async getOrderStatistics(): Promise<OrderStatistics> {
    const response = await api.get('/orders/statistics');
    return response.data;
  }
}

export default new OrderService(); 