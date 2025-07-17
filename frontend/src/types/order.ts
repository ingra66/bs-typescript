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

export interface CreateOrderRequest {
  shipping_address: ShippingAddress;
  billing_address?: BillingAddress;
  coupon_code?: string;
  notes?: string;
}

export interface OrderStatus {
  PENDING: 'pending';
  PROCESSING: 'processing';
  SHIPPED: 'shipped';
  DELIVERED: 'delivered';
  CANCELLED: 'cancelled';
}

export interface PaymentStatus {
  PENDING: 'pending';
  PAID: 'paid';
  FAILED: 'failed';
  REFUNDED: 'refunded';
}

export const ORDER_STATUS: OrderStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const PAYMENT_STATUS: PaymentStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

export const getOrderStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    [ORDER_STATUS.PENDING]: 'Pendiente',
    [ORDER_STATUS.PROCESSING]: 'En proceso',
    [ORDER_STATUS.SHIPPED]: 'Enviado',
    [ORDER_STATUS.DELIVERED]: 'Entregado',
    [ORDER_STATUS.CANCELLED]: 'Cancelado',
  };
  return labels[status] || status;
};

export const getPaymentStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    [PAYMENT_STATUS.PENDING]: 'Pendiente',
    [PAYMENT_STATUS.PAID]: 'Pagado',
    [PAYMENT_STATUS.FAILED]: 'Fallido',
    [PAYMENT_STATUS.REFUNDED]: 'Reembolsado',
  };
  return labels[status] || status;
};

export const getOrderStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    [ORDER_STATUS.PENDING]: 'bg-yellow-500',
    [ORDER_STATUS.PROCESSING]: 'bg-red-500',
    [ORDER_STATUS.SHIPPED]: 'bg-purple-500',
    [ORDER_STATUS.DELIVERED]: 'bg-green-500',
    [ORDER_STATUS.CANCELLED]: 'bg-red-500',
  };
  return colors[status] || 'bg-gray-500';
};

export const getPaymentStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    [PAYMENT_STATUS.PENDING]: 'bg-yellow-500',
    [PAYMENT_STATUS.PAID]: 'bg-green-500',
    [PAYMENT_STATUS.FAILED]: 'bg-red-500',
    [PAYMENT_STATUS.REFUNDED]: 'bg-orange-500',
  };
  return colors[status] || 'bg-gray-500';
}; 