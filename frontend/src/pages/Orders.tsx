import React from 'react';
import OrderList from '../components/orders/OrderList';

const Orders: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-4 py-8">
          <OrderList />
        </div>
      </div>
    </div>
  );
};

export default Orders; 