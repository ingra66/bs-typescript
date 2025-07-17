import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Facebook, Instagram, Search, Heart, User, Menu, X, LogOut, Settings, UserCheck, ChevronDown, ShoppingCart, Bell } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { ConnectionStatus } from "@/components/ui/ConnectionStatus";
import CartIcon from "@/components/ui/CartIcon";
import CartModal from "@/components/cart/CartModal";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";

interface Category {
  id: number;
  name: string;
  slug: string;
}

// Componente de botón sin círculo
const IconButton: React.FC<{
  icon: React.ComponentType<{ size: number; className?: string }>;
  badge?: string;
  badgeColor?: string;
  onClick?: () => void;
}> = ({ icon: Icon, badge, badgeColor, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="header-icon-btn"
      style={{
        padding: '0',
        backgroundColor: 'transparent',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <Icon size={20} className="text-white hover:text-red-500 transition-colors duration-200" />
      {badge && (
        <span 
          style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            width: '14px',
            height: '14px',
            backgroundColor: '#EF4444',
            color: 'white',
            fontSize: '9px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: '1',
            fontWeight: 'bold'
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
};

export const Header: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { toggleCart, getTotalItems } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/v1/categories/navigation')
      .then(res => res.json())
      .then(data => {
        setCategories(data.data || []);
      })
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide categories
        setShowCategories(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show categories
        setShowCategories(true);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const handleUserAction = (action: string) => {
    setIsUserMenuOpen(false);
    if (action === 'profile') {
      navigate('/profile');
    } else if (action === 'login') {
      navigate('/login');
    }
  };

  return (
    <div className="bg-black shadow-sm w-full fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-2 py-px h-[54px] w-full">
        {/* Izquierda: Social */}
        <div className="flex items-center gap-2">
          <IconButton icon={Facebook} />
          <IconButton icon={Instagram} />
          <IconButton icon={Search} />
          <ConnectionStatus />
        </div>

        {/* Centro: Logo */}
        <Link to="/" className="flex items-center justify-center">
          <img
            src="/gif.gif"
            alt="BeltSpot"
            className="h-16 w-auto object-contain brightness-125 saturate-150"
          />
        </Link>

        {/* Derecha: Iconos */}
        <div className="flex items-center gap-2">
          <IconButton icon={Heart} badge="3" />
          <IconButton icon={Bell} badge="2" />
          <IconButton icon={ShoppingCart} badge={getTotalItems().toString()} onClick={toggleCart} />

          {/* Usuario */}
          <DropdownMenu.Root open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
            <DropdownMenu.Trigger asChild>
              <button 
                style={{
                  padding: '0',
                  backgroundColor: 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {isAuthenticated ? (
                  <span 
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      lineHeight: '1',
                      marginTop: '6px'
                    }}
                    className="text-red-600"
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User size={20} className="text-white hover:text-red-500 transition-colors duration-200" />
                )}
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="z-50 min-w-[180px] bg-black border border-gray-700 rounded-lg shadow-lg p-2 mt-1">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 border-b border-gray-700">
                    <p className="text-sm text-gray-100 font-semibold mb-1">Hola, {user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                  <DropdownMenu.Item asChild>
                    <Button
                      onClick={() => handleUserAction('profile')}
                      className="w-full text-left bg-transparent hover:bg-gray-800 text-gray-200 px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 text-sm"
                    >
                      <User size={14} />
                      Mi Perfil
                    </Button>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Button
                      onClick={() => navigate('/orders')}
                      className="w-full text-left bg-transparent hover:bg-gray-800 text-gray-200 px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 text-sm"
                    >
                      <ShoppingCart size={14} />
                      Mis Pedidos
                    </Button>
                  </DropdownMenu.Item>
                  {user?.is_admin && (
                    <DropdownMenu.Item asChild>
                      <Button
                        onClick={() => navigate('/admin')}
                        className="w-full text-left bg-transparent hover:bg-red-900 text-red-400 px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 text-sm"
                      >
                        <Settings size={14} />
                        Panel de Administración
                      </Button>
                    </DropdownMenu.Item>
                  )}
                  <DropdownMenu.Item asChild>
                    <Button
                      onClick={handleLogout}
                      className="w-full text-left bg-transparent hover:bg-red-900 text-red-400 px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 text-sm"
                    >
                      <LogOut size={14} />
                      Cerrar sesión
                    </Button>
                  </DropdownMenu.Item>
                </>
              ) : (
                <>
                  <DropdownMenu.Item asChild>
                    <Button
                      onClick={() => handleUserAction('login')}
                      className="w-full text-left bg-transparent hover:bg-gray-800 text-gray-200 px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 text-sm"
                    >
                      <UserCheck size={14} />
                      Iniciar sesión
                    </Button>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Button
                      onClick={() => navigate('/register')}
                      className="w-full text-left bg-transparent hover:bg-gray-800 text-gray-200 px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 text-sm"
                    >
                      <User size={14} />
                      Registrarse
                    </Button>
                  </DropdownMenu.Item>
                </>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>

      {/* Navegación Mejorada */}
      <div className={`bg-black w-full transition-all duration-300 ${showCategories ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="max-w-7xl mx-auto px-4 py-1 w-full">
          <div className="flex items-center justify-between">
            <nav className="hidden lg:flex items-center justify-center flex-1 gap-4">
              <div className="group relative">
                <Link
                  to="/products"
                  className="text-xs text-red-400 hover:text-red-300 uppercase tracking-wide transition-colors duration-200 cursor-pointer no-underline font-bold"
                >
                  SHOP
                </Link>
              </div>
              {categories.slice(0, 8).map((cat) => (
                <div key={cat.id} className="group relative">
                  <Link
                    to={`/category/${cat.slug}`}
                    className="text-xs text-gray-400 hover:text-white uppercase tracking-wide transition-colors duration-200 cursor-pointer no-underline"
                  >
                    {cat.name}
                  </Link>
                </div>
              ))}
            </nav>

            <Button
              onClick={toggleMobileMenu}
              className="lg:hidden w-6 h-6 p-0 rounded-full bg-gray-800 border border-gray-600 hover:bg-gray-700 flex items-center justify-center"
            >
              <Menu size={14} className="text-gray-300" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] lg:hidden">
          <div className="bg-gray-900 h-full w-80 max-w-[90vw] shadow-xl">
            <div className="bg-gray-900 border-b border-gray-700 p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img 
                    src="/logo-beltspot.png" 
                    alt="BeltSpot" 
                    className="h-8 w-auto"
                  />
                  <span className="text-xl font-bold text-white">BeltSpot</span>
                </div>
                <Button
                  onClick={toggleMobileMenu}
                  className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center p-0"
                >
                  <X size={16} className="text-gray-300" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-semibold mb-4 text-lg">Categorías</h3>
                  <div className="space-y-2">
                    <Link
                      to="/products"
                      onClick={toggleMobileMenu}
                      className="block text-red-400 hover:text-red-300 py-2 px-3 rounded-md transition-all duration-200 hover:bg-gray-800 font-bold"
                    >
                      SHOP - Todos los productos
                    </Link>
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.slug}`}
                        onClick={toggleMobileMenu}
                        className="block text-gray-300 hover:text-white py-2 px-3 rounded-md transition-all duration-200 hover:bg-gray-800"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-white font-semibold mb-4 text-lg">Cuenta</h3>
                  <div className="space-y-2">
                    {isAuthenticated ? (
                      <>
                        <Button
                          onClick={() => {
                            handleUserAction('profile');
                            toggleMobileMenu();
                          }}
                          className="w-full text-left bg-transparent hover:bg-gray-800 text-gray-200 py-2 px-3 rounded-md transition-all duration-200 flex items-center gap-2"
                        >
                          <User size={16} />
                          Mi Perfil
                        </Button>
                        <Button
                          onClick={() => {
                            navigate('/orders');
                            toggleMobileMenu();
                          }}
                          className="w-full text-left bg-transparent hover:bg-gray-800 text-gray-200 py-2 px-3 rounded-md transition-all duration-200 flex items-center gap-2"
                        >
                          <ShoppingCart size={16} />
                          Mis Pedidos
                        </Button>
                        <Button
                          onClick={() => {
                            handleLogout();
                            toggleMobileMenu();
                          }}
                          className="w-full text-left bg-transparent hover:bg-red-900 text-red-400 py-2 px-3 rounded-md transition-all duration-200 flex items-center gap-2"
                        >
                          <LogOut size={16} />
                          Cerrar sesión
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => {
                            handleUserAction('login');
                            toggleMobileMenu();
                          }}
                          className="w-full text-left bg-transparent hover:bg-gray-800 text-gray-200 py-2 px-3 rounded-md transition-all duration-200 flex items-center gap-2"
                        >
                          <UserCheck size={16} />
                          Iniciar sesión
                        </Button>
                        <Button
                          onClick={() => {
                            navigate('/register');
                            toggleMobileMenu();
                          }}
                          className="w-full text-left bg-transparent hover:bg-gray-800 text-gray-200 py-2 px-3 rounded-md transition-all duration-200 flex items-center gap-2"
                        >
                          <User size={16} />
                          Registrarse
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <CartModal />
    </div>
  );
}; 