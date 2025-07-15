import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Facebook, Instagram, Search, Heart, User, Menu, X, LogOut, Settings, UserCheck, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { ConnectionStatus } from "@/components/ui/ConnectionStatus";
import CartIcon from "@/components/ui/CartIcon";
import CartModal from "@/components/cart/CartModal";

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
    <>
      <header style={{
        backgroundColor: '#000000',
        borderBottom: '1px solid #333',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        {/* Top Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Left Side - Social Icons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#1976d2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              <Facebook size={14} style={{ color: 'white' }} />
            </div>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#c2185b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              <Instagram size={14} style={{ color: 'white' }} />
            </div>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#333',
              border: '1px solid #555',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              <Search size={14} style={{ color: '#ccc' }} />
            </div>
            <ConnectionStatus />
          </div>

          {/* Center - Logo */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <img 
                src="/logo-beltspot.png" 
                alt="beltspot logo" 
                style={{
                  height: '50px',
                  width: 'auto',
                  animation: 'spin 20s linear infinite'
                }}
              />
            </Link>
          </div>

          {/* Right Side - User Icons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#333',
              border: '1px solid #555',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              <Heart size={14} style={{ color: '#ccc' }} />
            </div>
            
            <div style={{ position: 'relative' }}>
              <button
                onClick={toggleUserMenu}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#333',
                  border: '1px solid #555',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                aria-label="Menú de usuario"
              >
                {isAuthenticated ? (
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#1976d2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 600
                  }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <User size={14} style={{ color: '#ccc' }} />
                )}
              </button>

              {/* User Menu Dropdown */}
              {isUserMenuOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '8px',
                  width: '200px',
                  backgroundColor: '#111',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                  zIndex: 50,
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '8px 0' }}>
                    {isAuthenticated ? (
                      <>
                        <div style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #333'
                        }}>
                          <p style={{
                            fontSize: '14px',
                            color: '#fff',
                            margin: '0 0 4px 0',
                            fontWeight: 500
                          }}>
                            Hola, {user?.name}
                          </p>
                          <p style={{
                            fontSize: '12px',
                            color: '#ccc',
                            margin: 0
                          }}>
                            {user?.email}
                          </p>
                        </div>
                        <button
                          onClick={() => handleUserAction('profile')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            padding: '12px 16px',
                            fontSize: '14px',
                            color: '#fff',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#333';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <Settings size={16} style={{ marginRight: '8px' }} />
                          Mi Perfil
                        </button>
                        <button
                          onClick={handleLogout}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            padding: '12px 16px',
                            fontSize: '14px',
                            color: '#ff6b6b',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#4a1a1a';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <LogOut size={16} style={{ marginRight: '8px' }} />
                          Cerrar Sesión
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleUserAction('login')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            padding: '12px 16px',
                            fontSize: '14px',
                            color: '#fff',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#333';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <UserCheck size={16} style={{ marginRight: '8px' }} />
                          Iniciar Sesión
                        </button>
                        <Link
                          to="/register"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            padding: '12px 16px',
                            fontSize: '14px',
                            color: '#fff',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            textDecoration: 'none'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#333';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <User size={16} style={{ marginRight: '8px' }} />
                          Registrarse
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <CartIcon />
          </div>

          {/* Mobile Menu Button */}
          <div style={{
            display: 'none',
            cursor: 'pointer',
            padding: '8px'
          }}>
            {isMobileMenuOpen ? (
              <X size={20} onClick={toggleMobileMenu} style={{ color: '#ccc' }} />
            ) : (
              <Menu size={20} onClick={toggleMobileMenu} style={{ color: '#ccc' }} />
            )}
          </div>
        </div>
        
        {/* Navigation Bar */}
        <nav style={{
          borderTop: '1px solid #333',
          backgroundColor: '#000000'
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 24px'
          }}>
            <ul style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              listStyle: 'none',
              margin: 0,
              padding: '16px 0',
              gap: '32px',
              flexWrap: 'wrap'
            }}>
              {categories.map((cat, index) => (
                <li key={cat.id} style={{ position: 'relative' }}>
                  <a 
                    href={`/category/${cat.slug}`}
                    style={{
                      color: '#ccc',
                      textDecoration: 'none',
                      fontSize: '12px',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'color 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ff6b6b';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#ccc';
                    }}
                  >
                    {cat.name}
                    <ChevronDown size={10} style={{ color: '#666' }} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              backgroundColor: '#000000',
              padding: '20px',
              borderBottom: '1px solid #333'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <img 
                  src="/logo-beltspot.png" 
                  alt="beltspot logo" 
                  style={{
                    height: '35px',
                    width: 'auto'
                  }}
                />
                <X size={24} onClick={toggleMobileMenu} style={{ color: '#ccc', cursor: 'pointer' }} />
              </div>
            </div>
            <div style={{
              backgroundColor: '#000000',
              flex: 1,
              padding: '20px'
            }}>
              <div style={{ marginBottom: '24px' }}>
                {categories.map((cat) => (
                  <a 
                    key={cat.id}
                    href={`/category/${cat.slug}`} 
                    onClick={toggleMobileMenu}
                    style={{
                      display: 'block',
                      padding: '12px 0',
                      color: '#ccc',
                      textDecoration: 'none',
                      fontSize: '16px',
                      borderBottom: '1px solid #333'
                    }}
                  >
                    {cat.name}
                  </a>
                ))}
              </div>
              <div style={{ borderTop: '1px solid #333', paddingTop: '20px' }}>
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/profile" 
                      onClick={toggleMobileMenu}
                      style={{
                        display: 'block',
                        padding: '12px 0',
                        color: '#ccc',
                        textDecoration: 'none',
                        fontSize: '16px'
                      }}
                    >
                      Mi Perfil
                    </Link>
                    <button 
                      onClick={() => { handleLogout(); toggleMobileMenu(); }}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '12px 0',
                        color: '#ff6b6b',
                        backgroundColor: 'transparent',
                        border: 'none',
                        fontSize: '16px',
                        cursor: 'pointer'
                      }}
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      onClick={toggleMobileMenu}
                      style={{
                        display: 'block',
                        padding: '12px 0',
                        color: '#ccc',
                        textDecoration: 'none',
                        fontSize: '16px'
                      }}
                    >
                      Iniciar Sesión
                    </Link>
                    <Link 
                      to="/register" 
                      onClick={toggleMobileMenu}
                      style={{
                        display: 'block',
                        padding: '12px 0',
                        color: '#ccc',
                        textDecoration: 'none',
                        fontSize: '16px'
                      }}
                    >
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
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 40
            }}
            onClick={toggleUserMenu}
          />
        )}
      </header>

      {/* Cart Modal */}
      <CartModal />
    </>
  );
}; 