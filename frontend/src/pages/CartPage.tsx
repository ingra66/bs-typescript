import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { Trash2, ArrowLeft } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface CartTotals {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
}

const CartPage: React.FC = () => {
  const { 
    items, 
 
    getTotalPrice, 
    clearCart,
    removeItem,
    updateQuantity,
    isLoading 
  } = useCartStore();
  
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState<string>("");
  const [showDiscount, setShowDiscount] = useState<boolean>(false);

  const cartTotals: CartTotals = {
    subtotal: getTotalPrice(),
    discount: showDiscount ? getTotalPrice() * 0.2 : 0, // 20% discount
    tax: 0.0,
    shipping: 0.0,
  };

  const total = cartTotals.subtotal - cartTotals.discount + cartTotals.tax + cartTotals.shipping;

  const handleRemoveItem = async (id: number) => {
    await removeItem(id);
  };

  const handleUpdateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity > 0) {
      await updateQuantity(id, newQuantity);
    }
  };

  const removeDiscount = () => {
    setShowDiscount(false);
  };

  const applyCoupon = () => {
    // Coupon logic here
    console.log("Applying coupon:", couponCode);
    if (couponCode.toLowerCase() === 'sale20') {
      setShowDiscount(true);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      clearCart();
    }
  };

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-black">
        <LoadingSpinner message="Cargando carrito..." size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-vh-100" style={{ backgroundColor: "#000000" }}>
        <div className="container py-5" style={{ backgroundColor: "#000000" }}>
          <div className="row">
            <div className="col-12">
              <div className="text-center text-white">
                <h1 className="mb-4" style={{ fontSize: "3rem", fontWeight: "bold" }}>
                  Carrito Vacío
                </h1>
                <p className="text-muted mb-4">No tienes productos en tu carrito.</p>
                <button
                  onClick={handleContinueShopping}
                  className="btn btn-lg"
                  style={{ 
                    backgroundColor: "#DC2626", 
                    border: "1px solid #DC2626",
                    borderRadius: "6px",
                    padding: "10px"
                  }}
                >
                  Continuar Comprando
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#000000" }}>
      <div className="container py-5" style={{ backgroundColor: "#000000" }}>
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-5">
              <div className="d-flex align-items-center">
                <button
                  onClick={() => navigate(-1)}
                  className="btn btn-link text-white me-3 p-0"
                >
                  <ArrowLeft size={24} />
                </button>
                <h1 className="text-white mb-0" style={{ fontSize: "3rem", fontWeight: "bold" }}>
                  Carrito
                </h1>
              </div>
              <button
                onClick={handleClearCart}
                className="btn btn-outline-danger"
              >
                <Trash2 size={16} className="me-2" />
                Vaciar Carrito
              </button>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            {/* Cart Items Table */}
            <div className="card mb-4" style={{ borderRadius: "8px", borderWidth: "1px", backgroundColor: "#000000", border: "1px solid #374151" }}>
              <div className="card-body" style={{ backgroundColor: "#000000" }}>
                                  <div className="table-responsive">
                    <table className="table" style={{ backgroundColor: "#000000" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#000000", borderBottom: "1px solid #374151" }}>
                          <th className="text-white fw-bold" style={{ backgroundColor: "#000000" }}>Producto</th>
                          <th className="text-white fw-bold" style={{ backgroundColor: "#000000" }}>Precio</th>
                          <th className="text-white fw-bold" style={{ backgroundColor: "#000000" }}>Cantidad</th>
                          <th className="text-white fw-bold" style={{ backgroundColor: "#000000" }}>Subtotal</th>
                          <th style={{ backgroundColor: "#000000" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.id} style={{ backgroundColor: "#000000", borderBottom: "1px solid #374151" }}>
                            <td className="align-middle" style={{ backgroundColor: "#000000" }}>
                              <div className="d-flex align-items-center">
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  className="me-3"
                                  style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                />
                                <span className="text-white">{item.name}</span>
                              </div>
                            </td>
                            <td className="align-middle text-white" style={{ backgroundColor: "#000000" }}>${(typeof item.price === 'string' ? parseFloat(item.price) : item.price).toFixed(2)}</td>
                            <td className="align-middle" style={{ backgroundColor: "#000000" }}>
                              <input
                                type="number"
                                className="form-control text-white border-secondary"
                                style={{ 
                                  width: "80px", 
                                  borderRadius: "6px",
                                  borderWidth: "1px",
                                  padding: "8px 12px",
                                  backgroundColor: "#1F2937"
                                }}
                                value={item.quantity}
                                onChange={(e) => handleUpdateQuantity(item.id, Number.parseInt(e.target.value))}
                                min="1"
                                max={item.stock}
                              />
                            </td>
                            <td className="align-middle text-white" style={{ backgroundColor: "#000000" }}>${((typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.quantity).toFixed(2)}</td>
                            <td className="align-middle" style={{ backgroundColor: "#000000" }}>
                              <button
                                className="btn btn-link text-danger p-0"
                                onClick={() => handleRemoveItem(item.id)}
                                style={{ fontSize: "1.2rem" }}
                              >
                                ×
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              </div>
            </div>

            {/* Coupon Section */}
            <div className="card mb-4" style={{ backgroundColor: "#000000", borderRadius: "8px", borderWidth: "1px", border: "1px solid #DC2626" }}>
              <div className="card-body" style={{ backgroundColor: "#000000" }}>
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control border-danger text-white"
                      placeholder="Código de descuento"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      style={{
                        borderRadius: "6px",
                        borderWidth: "1px",
                        padding: "8px 12px",
                        backgroundColor: "#1F2937"
                      }}
                    />
                  </div>
                  <div className="col-md-4 mt-2 mt-md-0">
                    <button
                      className="btn btn-danger w-100"
                      onClick={applyCoupon}
                      style={{ 
                        backgroundColor: "#DC2626", 
                        border: "1px solid #DC2626",
                        borderRadius: "6px",
                        padding: "8px 12px"
                      }}
                    >
                      Aplicar descuento
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            {/* Cart Totals */}
            <div className="card" style={{ borderRadius: "8px", borderWidth: "1px", backgroundColor: "#000000", border: "1px solid #374151" }}>
              <div className="card-header" style={{ borderRadius: "8px 8px 0 0", borderWidth: "1px", backgroundColor: "#000000", border: "1px solid #374151" }}>
                <h4 className="text-white mb-0 fw-bold">Resumen del Carrito</h4>
              </div>
              <div className="card-body" style={{ backgroundColor: "#000000" }}>
                <div className="row mb-3">
                  <div className="col-6">
                    <span className="text-white fw-bold">Subtotal</span>
                  </div>
                  <div className="col-6 text-end">
                    <span className="text-white">${cartTotals.subtotal.toFixed(2)}</span>
                  </div>
                </div>

                {showDiscount && (
                  <div className="row mb-3">
                    <div className="col-6">
                      <span className="text-white fw-bold">20% Descuento</span>
                    </div>
                    <div className="col-6 text-end">
                      <span className="text-danger">
                        -${cartTotals.discount.toFixed(2)}
                        <button
                          className="btn btn-link text-danger p-0 ms-2"
                          onClick={removeDiscount}
                          style={{ fontSize: "0.8rem" }}
                        >
                          [Quitar]
                        </button>
                      </span>
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <div className="row mb-2">
                    <div className="col-12">
                      <span className="text-white fw-bold">Envío</span>
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-12">
                      <small className="text-danger">Ingresa tu dirección para ver opciones de envío.</small>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <button className="btn btn-link text-danger p-0 text-decoration-underline">
                        Calcular envío
                      </button>
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-6">
                    <span className="text-white fw-bold">Impuestos</span>
                  </div>
                  <div className="col-6 text-end">
                    <span className="text-white">${cartTotals.tax.toFixed(2)}</span>
                  </div>
                </div>

                <hr className="border-secondary" />

                <div className="row mb-4">
                  <div className="col-6">
                    <span className="text-white fw-bold fs-5">Total</span>
                  </div>
                  <div className="col-6 text-end">
                    <span className="text-white fw-bold fs-5">${total.toFixed(2)}</span>
                  </div>
                </div>



                {/* Checkout Buttons */}
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-danger btn-lg"
                    onClick={handleCheckout}
                    style={{ 
                      backgroundColor: "#DC2626", 
                      border: "1px solid #DC2626",
                      borderRadius: "6px",
                      padding: "10px"
                    }}
                  >
                    {isAuthenticated ? 'Proceder al Pago' : 'Iniciar Sesión para Pagar'}
                  </button>
                  <button
                    onClick={handleContinueShopping}
                    className="btn btn-outline-light"
                    style={{
                      borderRadius: "6px",
                      padding: "10px"
                    }}
                  >
                    Continuar Comprando
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 