import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface CartNotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

const CartNotification: React.FC<CartNotificationProps> = ({ 
  message, 
  type, 
  duration = 3000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check size={16} className="text-green-400" />;
      case 'error':
        return <X size={16} className="text-red-400" />;
      default:
        return null;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900 border-green-700';
      case 'error':
        return 'bg-red-900 border-red-700';
      default:
        return 'bg-blue-900 border-blue-700';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${getBgColor()} shadow-lg`}>
      <div className="flex items-center gap-3">
        {getIcon()}
        <span className="text-white text-sm">{message}</span>
        <button
          onClick={handleClose}
          className="ml-2 text-gray-400 hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default CartNotification; 