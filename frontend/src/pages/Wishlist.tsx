import React, { useEffect } from 'react';
import { useWishlistStore } from '../stores/wishlistStore';
import { useAuthStore } from '../stores/authStore';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import WishlistProductCard from '../components/products/WishlistProductCard';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const Wishlist: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { 
    items, 
    isLoading, 
    error, 
    fetchWishlist, 
    getWishlistCount 
  } = useWishlistStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, fetchWishlist]);

  const handleProductRemoved = () => {
    // Recargar la wishlist después de eliminar un producto
    fetchWishlist();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">
              Inicia sesión para ver tus favoritos
            </h1>
            <p className="text-gray-400 mb-6">
              Guarda tus productos favoritos y accede a ellos desde cualquier lugar
            </p>
            <Button
              variant="primary"
              size="md"
              text="Iniciar sesión"
              onClick={() => window.location.href = '/login'}
            />
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">
              Error al cargar favoritos
            </h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <Button
              onClick={() => fetchWishlist()}
              variant="primary"
              size="md"
              text="Intentar de nuevo"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Mis Favoritos
          </h1>
          <p className="text-gray-400">
            {getWishlistCount()} {getWishlistCount() === 1 ? 'producto' : 'productos'} guardado{getWishlistCount() !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Wishlist Items */}
        {items.length === 0 ? (
          <EmptyState
            title="No tienes favoritos aún"
            description="Agrega productos a tus favoritos para verlos aquí"
            actionLabel="Explorar productos"
            onAction={() => window.location.href = '/products'}
            icon={
              <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <WishlistProductCard
                key={item.id}
                product={item.product}
                onRemove={handleProductRemoved}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist; 