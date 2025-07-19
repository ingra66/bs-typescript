import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '../../stores/wishlistStore';

interface WishlistIconProps {
  size?: number;
  className?: string;
  showBadge?: boolean;
}

const WishlistIcon: React.FC<WishlistIconProps> = ({
  size = 20,
  className = '',
  showBadge = true
}) => {
  const { getWishlistCount } = useWishlistStore();
  const count = getWishlistCount();

  return (
    <div className="relative inline-block">
      <Heart 
        size={size} 
        className={`text-white hover:text-red-500 transition-colors duration-200 ${className}`}
      />
      {showBadge && count > 0 && (
        <span 
          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold"
          style={{
            fontSize: '10px',
            lineHeight: '1'
          }}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  );
};

export default WishlistIcon; 