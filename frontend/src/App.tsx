
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/layout/Header';
import Footer from './components/layout/Footer';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import { ProductPage } from './pages/ProductPage';
import { Products } from './pages/Products';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import PaymentPending from './pages/PaymentPending';
import Orders from './pages/Orders';
import OrderDetailPage from './pages/OrderDetailPage';
import Wishlist from './pages/Wishlist';
import CartSync from './components/cart/CartSync';
import { useWishlistSync } from './hooks/useWishlistSync';
// import CartDebug from './components/cart/CartDebug';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Sincronizar wishlist
  useWishlistSync();

  return (
    <>
      {!isAdminRoute && (
        <div className="min-h-screen bg-black flex flex-col w-full">
          <CartSync />
          <Header />
          {/* <CartDebug /> */}
      
          <main className="flex-1 overflow-x-hidden pt-[54px]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="/products" element={<Products />} />
              <Route path="/category/:categorySlug" element={<Products />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:orderId" element={<OrderDetailPage />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/failure" element={<PaymentFailure />} />
              <Route path="/payment/pending" element={<PaymentPending />} />
            </Routes>
          </main>
      
          <Footer />
        </div>
      )}

      {isAdminRoute && (
        <Routes>
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      )}
    
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
          },
          success: {
            style: {
              background: '#065f46',
              border: '1px solid #047857',
            },
          },
          error: {
            style: {
              background: '#7f1d1d',
              border: '1px solid #dc2626',
            },
          },
        }}
      />
    </>
  );
}

export default App;
