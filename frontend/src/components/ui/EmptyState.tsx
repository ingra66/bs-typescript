import React from 'react';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export default function EmptyState({ 
  title, 
  description, 
  actionLabel, 
  onAction, 
  icon,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-6 text-center ${className}`}>
      {icon && (
        <div className="mb-2 text-gray-500">
          {icon}
        </div>
      )}
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-4 max-w-md">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <button
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
          onClick={onAction}
        >
          <Plus size={16} />
          {actionLabel}
        </button>
      )}
    </div>
  );
} 