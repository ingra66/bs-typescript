import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Facebook, Instagram, Search, Heart, User, ShoppingCart, Menu, X, LogOut, Settings, UserCheck } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { ConnectionStatus } from "@/components/ui/ConnectionStatus";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export const Header: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/v1/categories/navigation')
      .then(res => res.json())
      .then(data => {
        setCategories(data.data || []);
      })
      .catch(() => setCategories([]));
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
    <header className="header">
      <div className="header-inner">
        {/* Header Top */}
        <div className="header-top">
          {/* Social Icons */}
          <div className="social-icons">
            <Facebook size={15} />
            <Instagram size={15} />
            <Search size={15} />
            <ConnectionStatus />
          </div>

          {/* Logo */}
          <div className="logo">
            <Link to="/">
              <img 
                src="/logo-beltspot.png" 
                alt="beltspot logo" 
                className="logo-3d-spin" 
              />
            </Link>
          </div>

          {/* User Icons */}
          <div className="user-icons">
            <Heart size={15} />
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="user-menu-button"
                aria-label="Menú de usuario"
              >
                {isAuthenticated ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <User size={15} />
                )}
              </button>

              {/* User Menu Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
                  <div className="py-1">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-700">
                          <p className="text-sm text-gray-300">Hola, {user?.name}</p>
                          <p className="text-xs text-gray-400">{user?.email}</p>
                        </div>
                        <button
                          onClick={() => handleUserAction('profile')}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Mi Perfil
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Cerrar Sesión
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleUserAction('login')}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Iniciar Sesión
                        </button>
                        <Link
                          to="/register"
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Registrarse
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            <ShoppingCart size={15} />
          </div>

          {/* Mobile Menu Button */}
          <div className="mobile-menu-button">
            {isMobileMenuOpen ? (
              <X size={20} onClick={toggleMobileMenu} />
            ) : (
              <Menu size={20} onClick={toggleMobileMenu} />
            )}
          </div>
        </div>
      </div>
      
      {/* Navigation fuera del header-inner para ancho completo */}
      <nav className="navigation">
        <ul className="nav-list">
          {categories.map((cat) => (
            <li key={cat.id} className="nav-item">
              <a 
                href={`/category/${cat.slug}`} 
                className="nav-link"
              >
                {cat.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-close">
            <X size={30} onClick={toggleMobileMenu} />
          </div>
          <div className="mobile-menu-categories">
            {categories.map((cat) => (
              <a 
                key={cat.id}
                href={`/category/${cat.slug}`} 
                onClick={toggleMobileMenu}
              >
                {cat.name}
              </a>
            ))}
            {/* Mobile Auth Menu */}
            <div className="mobile-auth-menu">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" onClick={toggleMobileMenu}>
                    Mi Perfil
                  </Link>
                  <button onClick={() => { handleLogout(); toggleMobileMenu(); }}>
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={toggleMobileMenu}>
                    Iniciar Sesión
                  </Link>
                  <Link to="/register" onClick={toggleMobileMenu}>
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Overlay para cerrar el menú de usuario */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={toggleUserMenu}
        />
      )}
    </header>
  );
}; 