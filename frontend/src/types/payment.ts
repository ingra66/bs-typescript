export interface PaymentMethod {
  id: string;
  name: string;
  payment_type_id: string;
  thumbnail: string;
  secure_thumbnail: string;
}

export interface PaymentPreference {
  preference_id: string;
  init_point: string;
  sandbox_init_point: string;
  order: any;
}

export interface PaymentStatus {
  payment_status: string;
  payment_method: string;
  transaction_amount: number;
  order_status: string;
  order_payment_status: string;
}

export interface PaymentResponse {
  paymentId: string | null;
  preferenceId: string | null;
  externalReference: string | null;
  status: string | null;
  paymentMethodType: string | null;
  amount: string | null;
}

export const PAYMENT_STATUS = {
  APPROVED: 'approved',
  PENDING: 'pending',
  IN_PROCESS: 'in_process',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
} as const;

export const getPaymentStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    [PAYMENT_STATUS.APPROVED]: 'Aprobado',
    [PAYMENT_STATUS.PENDING]: 'Pendiente',
    [PAYMENT_STATUS.IN_PROCESS]: 'En proceso',
    [PAYMENT_STATUS.REJECTED]: 'Rechazado',
    [PAYMENT_STATUS.CANCELLED]: 'Cancelado',
  };
  return labels[status] || status;
};

export const getPaymentStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    [PAYMENT_STATUS.APPROVED]: 'bg-green-500',
    [PAYMENT_STATUS.PENDING]: 'bg-yellow-500',
    [PAYMENT_STATUS.IN_PROCESS]: 'bg-blue-500',
    [PAYMENT_STATUS.REJECTED]: 'bg-red-500',
    [PAYMENT_STATUS.CANCELLED]: 'bg-gray-500',
  };
  return colors[status] || 'bg-gray-500';
}; 