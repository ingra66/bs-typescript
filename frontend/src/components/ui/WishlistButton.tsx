import React, { useState, useEffect } from 'react';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useAuthStore } from '../../stores/authStore';

interface WishlistButtonProps {
  productId: number;
  productName?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
  onToggle?: (isInWishlist: boolean) => void;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  productName = 'Producto',
  size = 'md',
  className = '',
  showText = false,
  onToggle,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [localIsInWishlist, setLocalIsInWishlist] = useState(false);
  const [optimisticState, setOptimisticState] = useState<boolean | null>(null);
  
  const { isAuthenticated } = useAuthStore();
  const { 
    isInWishlist, 
    toggleWishlist, 
    checkWishlistStatus,
    addToWishlist,
    removeFromWishlist
  } = useWishlistStore();

  // Verificar estado inicial
  useEffect(() => {
    const checkInitialStatus = async () => {
      if (isAuthenticated) {
        try {
          const status = await checkWishlistStatus(productId);
          setLocalIsInWishlist(status);
        } catch (error) {
          console.error('Error checking initial wishlist status:', error);
        }
      }
    };

    checkInitialStatus();
  }, [productId, isAuthenticated, checkWishlistStatus]);

  // Sincronizar con el store
  useEffect(() => {
    const storeStatus = isInWishlist(productId);
    setLocalIsInWishlist(storeStatus);
  }, [productId, isInWishlist]);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Redirigir al login si no está autenticado
      window.location.href = '/login';
      return;
    }

    // Optimistic UI: cambiar inmediatamente el estado visual
    const newOptimisticState = !localIsInWishlist;
    setOptimisticState(newOptimisticState);
    setLocalIsInWishlist(newOptimisticState);
    
    setIsLoading(true);
    
    try {
      if (newOptimisticState) {
        // Agregar a wishlist
        await addToWishlist(productId);
      } else {
        // Eliminar de wishlist
        await removeFromWishlist(productId);
      }
      
      // Callback opcional
      if (onToggle) {
        onToggle(newOptimisticState);
      }

      // Mostrar feedback visual
      const message = newOptimisticState 
        ? `${productName} agregado a favoritos` 
        : `${productName} eliminado de favoritos`;
      
      console.log(message);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      
      // Revertir el cambio si la API falla
      setLocalIsInWishlist(!newOptimisticState);
      setOptimisticState(null);
      
      // Mostrar error al usuario
      alert(`Error: No se pudo ${newOptimisticState ? 'agregar' : 'eliminar'} el producto de favoritos`);
    } finally {
      setIsLoading(false);
      setOptimisticState(null);
    }
  };

  // Tamaños de icono
  const sizeClasses = {
    sm: { width: '16px', height: '16px' },
    md: { width: '20px', height: '20px' },
    lg: { width: '24px', height: '24px' },
  };

  // Tamaños de botón
  const buttonSizeClasses = {
    sm: { padding: '6px' },
    md: { padding: '8px' },
    lg: { padding: '10px' },
  };

  // Estilos dinámicos
  const buttonStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    border: 'none',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    opacity: isLoading ? 0.5 : 1,
    ...buttonSizeClasses[size],
    backgroundColor: localIsInWishlist ? '#EF4444' : '#E5E7EB',
    color: localIsInWishlist ? '#FFFFFF' : '#374151',
  };

  const iconStyles = {
    ...sizeClasses[size],
    transition: 'colors 0.2s ease',
  };

  const spinnerStyles = {
    ...iconStyles,
    animation: 'spin 1s linear infinite',
    border: '2px solid currentColor',
    borderTopColor: 'transparent',
    borderRadius: '50%',
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isLoading) {
      e.currentTarget.style.transform = 'scale(1.05)';
      e.currentTarget.style.backgroundColor = localIsInWishlist ? '#DC2626' : '#D1D5DB';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isLoading) {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.backgroundColor = localIsInWishlist ? '#EF4444' : '#E5E7EB';
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isLoading) {
      e.currentTarget.style.transform = 'scale(0.95)';
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isLoading) {
      e.currentTarget.style.transform = 'scale(1.05)';
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
      <button
        onClick={handleToggleWishlist}
        disabled={isLoading}
        style={buttonStyles}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className={className}
        aria-label={localIsInWishlist ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
        title={localIsInWishlist ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
      >
        {isLoading ? (
          <div style={spinnerStyles} />
        ) : (
          <svg
            style={iconStyles}
            fill={localIsInWishlist ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        )}
        
        {showText && (
          <span style={{
            marginLeft: '8px',
            fontSize: '14px',
            fontWeight: '500',
          }}>
            {localIsInWishlist ? 'Favorito' : 'Favorito'}
          </span>
        )}
      </button>
    </>
  );
};

export default WishlistButton; 