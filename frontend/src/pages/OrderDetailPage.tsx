import React from 'react';
import OrderDetail from '../components/orders/OrderDetail';

const OrderDetailPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <OrderDetail />
      </div>
    </div>
  );
};

export default OrderDetailPage; 