import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, MapPin, User, Phone, Mail } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import CartItem from '../components/cart/CartItem';
import PaymentProcessor from '../components/payment/PaymentProcessor';
import AuthDebug from '../components/debug/AuthDebug';
import PaymentDebug from '../components/debug/PaymentDebug';
import QuickPaymentTest from '../components/debug/QuickPaymentTest';
import { Button } from '../components/ui/Button';
import type { CreateOrderRequest } from '../types/order';
import AlertModal from '../components/ui/AlertModal';

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
  const { items, getTotalItems, getTotalPrice } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  

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
  const [showPaymentError, setShowPaymentError] = useState(false);
  const [showDebugAlert1, setShowDebugAlert1] = useState(false);
  const [showDebugAlert2, setShowDebugAlert2] = useState(false);
  const [showDebugAlert3, setShowDebugAlert3] = useState(false);
  const [showDebugAlert4, setShowDebugAlert4] = useState(false);
  const [debugMessage, setDebugMessage] = useState('');

  // Validar formulario
  const validateForm = useMemo((): boolean => {
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
  }, [shippingAddress]);

  // Crear datos de la orden
  const orderData = useMemo((): CreateOrderRequest => {
    return {
          shipping_address: shippingAddress,
          billing_address: shippingAddress, // Usar la misma dirección para facturación
    };
  }, [shippingAddress]);

  // Manejar éxito del pago
  const handlePaymentSuccess = (orderId: number) => {
    console.log('Orden creada exitosamente:', orderId);
    // El usuario será redirigido a MercadoPago automáticamente
  };

  // Manejar error del pago
  const handlePaymentError = (error: string) => {
    console.error('Error en el pago:', error);
    setDebugMessage(`Error: ${error}`);
    setShowPaymentError(true);
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
          <Button
            onClick={() => navigate('/')}
            variant="primary"
            text="Continuar comprando"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            iconBefore={<ArrowLeft size={20} />}
            className="p-2 rounded-full"
          />
          <div>
            <h1 className="text-white text-2xl font-bold">Checkout</h1>
            <p className="text-gray-400">Completa tu información para proceder al pago</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Debug components */}
          <div className="lg:col-span-3 mb-6">
            <AuthDebug />
            <PaymentDebug />
            <QuickPaymentTest />
          </div>
          
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

              {/* Debug buttons */}
              <div className="space-y-2 mb-4">
                <Button
                  onClick={async () => {
                    try {
                      const response = await fetch('http://localhost:8000/api/v1/debug/cart', {
                        headers: {
                          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                        },
                      });
                      const data = await response.json();
                      console.log('Debug carrito:', data);
                      setDebugMessage(`Carrito backend: ${data.data.cart_items_count} items`);
                      setShowDebugAlert1(true);
                    } catch (error) {
                      console.error('Error debug:', error);
                    }
                  }}
                  variant="secondary"
                  fullWidth
                  text="Debug Carrito Backend"
                />
                
                <Button
                  onClick={() => {
                    const { items } = useCartStore.getState();
                    console.log('Carrito frontend:', items);
                    setDebugMessage(`Carrito frontend: ${items.length} items`);
                    setShowDebugAlert2(true);
                  }}
                  variant="secondary"
                  fullWidth
                  text="Debug Carrito Frontend"
                />
                
                <Button
                  onClick={async () => {
                    try {
                      await useCartStore.getState().syncWithBackend();
                      setShowDebugAlert3(true);
                    } catch (error) {
                      console.error('Error sincronizando:', error);
                      setShowDebugAlert4(true);
                    }
                  }}
                  variant="secondary"
                  fullWidth
                  text="Forzar Sincronización"
                />
              </div>

              {/* Procesador de pago */}
              {validateForm ? (
                <PaymentProcessor
                  orderData={orderData}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              ) : (
                <Button
                  disabled
                  variant="primary"
                  fullWidth
                  text="Completa todos los campos requeridos"
                />
              )}

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

        {/* Debug de autenticación */}
        <div className="mt-8">
          <AuthDebug />
        </div>
      </div>
      
      <AlertModal
        isOpen={showPaymentError}
        title="Error de pago"
        message={debugMessage}
        confirmText="Aceptar"
        onConfirm={() => setShowPaymentError(false)}
        onCancel={() => setShowPaymentError(false)}
      />
      
      <AlertModal
        isOpen={showDebugAlert1}
        title="Debug Backend"
        message={debugMessage}
        confirmText="Aceptar"
        onConfirm={() => setShowDebugAlert1(false)}
        onCancel={() => setShowDebugAlert1(false)}
      />
      
      <AlertModal
        isOpen={showDebugAlert2}
        title="Debug Frontend"
        message={debugMessage}
        confirmText="Aceptar"
        onConfirm={() => setShowDebugAlert2(false)}
        onCancel={() => setShowDebugAlert2(false)}
      />
      
      <AlertModal
        isOpen={showDebugAlert3}
        title="Sincronización completada"
        message="Sincronización forzada completada"
        confirmText="Aceptar"
        onConfirm={() => setShowDebugAlert3(false)}
        onCancel={() => setShowDebugAlert3(false)}
      />
      
      <AlertModal
        isOpen={showDebugAlert4}
        title="Error de sincronización"
        message="Error en sincronización"
        confirmText="Aceptar"
        onConfirm={() => setShowDebugAlert4(false)}
        onCancel={() => setShowDebugAlert4(false)}
      />
    </div>
  );
};

export default Checkout; 