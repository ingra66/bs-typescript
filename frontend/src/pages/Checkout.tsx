import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, MapPin, User, Phone, Mail } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import CartItem from '../components/cart/CartItem';

interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

const Checkout: React.FC = () => {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: user?.name || '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Argentina',
    phone: '',
  });

  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingAddress> = {};
    
    if (!shippingAddress.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (!shippingAddress.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }
    if (!shippingAddress.city.trim()) {
      newErrors.city = 'La ciudad es requerida';
    }
    if (!shippingAddress.state.trim()) {
      newErrors.state = 'La provincia es requerida';
    }
    if (!shippingAddress.postal_code.trim()) {
      newErrors.postal_code = 'El código postal es requerido';
    }
    if (!shippingAddress.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Crear orden y redirigir a Mercado Pago
  const handleProceedToPayment = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // 1. Crear la orden
      const orderResponse = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          shipping_address: shippingAddress,
          billing_address: shippingAddress, // Usar la misma dirección para facturación
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message || 'Error al crear la orden');
      }

      // 2. Crear preferencia de Mercado Pago
      const preferenceResponse = await fetch('/api/v1/mercadopago/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          order_id: orderData.data.id,
        }),
      });

      const preferenceData = await preferenceResponse.json();

      if (!preferenceData.success) {
        throw new Error(preferenceData.message || 'Error al crear preferencia de pago');
      }

      // 3. Redirigir a Mercado Pago
      const checkoutUrl = preferenceData.data.init_point;
      window.location.href = checkoutUrl;

    } catch (error) {
      console.error('Error en checkout:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-2xl font-bold mb-4">Carrito vacío</h1>
          <p className="text-gray-400 mb-8">No tienes productos en tu carrito para proceder al checkout.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Continuar comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-white text-2xl font-bold">Checkout</h1>
            <p className="text-gray-400">Completa tu información para proceder al pago</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario de dirección */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-white text-lg font-semibold mb-6 flex items-center gap-2">
                <MapPin size={20} />
                Dirección de envío
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Nombre completo *
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={shippingAddress.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Teléfono *
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="+54 11 1234-5678"
                    />
                  </div>
                  {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full pl-10 pr-4 py-3 bg-gray-600 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                {/* Dirección */}
                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="Calle, número, piso, departamento"
                  />
                  {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
                </div>

                {/* Ciudad */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.city ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="Buenos Aires"
                  />
                  {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
                </div>

                {/* Provincia */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Provincia *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.state ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="Buenos Aires"
                  />
                  {errors.state && <p className="text-red-400 text-sm mt-1">{errors.state}</p>}
                </div>

                {/* Código Postal */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Código Postal *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.postal_code}
                    onChange={(e) => handleInputChange('postal_code', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.postal_code ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="1234"
                  />
                  {errors.postal_code && <p className="text-red-400 text-sm mt-1">{errors.postal_code}</p>}
                </div>

                {/* País */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    País
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.country}
                    disabled
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Resumen de productos */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-white text-lg font-semibold">
                  Productos ({getTotalItems()})
                </h2>
              </div>
              <div className="divide-y divide-gray-700">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-8">
              <h2 className="text-white text-lg font-semibold mb-6 flex items-center gap-2">
                <CreditCard size={20} />
                Resumen del pedido
              </h2>
              
              {/* Detalles */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Productos ({getTotalItems()})</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Envío</span>
                  <span className="text-green-400">Gratis</span>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between text-white text-lg font-semibold">
                    <span>Total</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Botón de pago */}
              <button
                onClick={handleProceedToPayment}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-4 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Proceder con Mercado Pago
                  </>
                )}
              </button>

              {/* Información adicional */}
              <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                <h3 className="text-white font-medium mb-2">Información importante</h3>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Pago seguro con Mercado Pago</li>
                  <li>• Envío gratuito en todo el país</li>
                  <li>• Devoluciones gratuitas hasta 30 días</li>
                  <li>• Facturación incluida</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 