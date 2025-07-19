import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Eye, EyeOff, Mail, Lock, Shield, User, Crown } from 'lucide-react';
import { Button } from '../ui/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const LoginForm: React.FC = () => {
  // Estilos CSS para centrar el formulario
  const loginStyles = {
    container: {
      height: '100vh',
      overflow: 'hidden',
      position: 'relative' as const,
    },
    formColumn: {
      backgroundColor: '#000000',
      height: '100vh',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '15vh',
      position: 'relative' as const,
    },
    imageColumn: {
      height: '100vh',
      display: 'flex',
    },
    formBox: {
      maxWidth: '320px',
      padding: '1rem',
      borderRadius: '8px',
    },
    logo: {
      marginBottom: '1rem',
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: 700,
      marginBottom: '0.5rem',
    },
    subtitle: {
      fontSize: '0.9rem',
      marginBottom: '1rem',
    },
    input: {
      fontSize: '0.95rem',
      padding: '8px 12px 8px 36px',
      borderRadius: '6px',
      marginBottom: '0.5rem',
      backgroundColor: '#1F2937',
      color: '#fff',
      border: '1px solid #374151',
    },
    button: {
      fontSize: '1rem',
      padding: '10px',
      borderRadius: '6px',
      marginBottom: '0.5rem',
    },
    link: {
      fontSize: '0.9rem',
    }
  };
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated, user } = useAuthStore();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.is_admin) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
    } catch (error) {
      // El error ya se maneja en el store
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const quickLogin = async (email: string, password: string) => {
    setFormData(prev => ({ ...prev, email, password }));
    // Pequeño delay para que se vea la animación
    setTimeout(async () => {
      try {
        await login({ email, password });
      } catch (error) {
        // El error ya se maneja en el store
      }
    }, 300);
  };

  return (
    <div className="container-fluid p-0" style={loginStyles.container}>
      <div className="row g-0" style={{ height: '100vh' }}>
        {/* Left Side - Login Form */}
        <div className="col-lg-6" style={loginStyles.formColumn}>
          <div className="w-100" style={loginStyles.formBox}>
            {/* Logo */}
            <div style={loginStyles.logo}>
              <div className="d-flex align-items-center">
                <div className="me-2">
                  <div className="d-flex align-items-center justify-content-center bg-gradient rounded-2 shadow-sm" 
                       style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)" }}>
                    <Shield className="text-white" size={16} />
                  </div>
                </div>
                <h4 className="mb-0 fw-bold text-white" style={{ fontSize: '1rem' }}>BeltSpot</h4>
              </div>
            </div>

            {/* Welcome Text */}
            <div style={loginStyles.title}>Bienvenido de vuelta</div>
            <div style={loginStyles.subtitle}>Ingresa tus credenciales para continuar</div>

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="mb-2">
                <label htmlFor="email" className="form-label text-white fw-medium" style={{ fontSize: '0.95rem', marginBottom: 2 }}>
                  Email
                </label>
                <div className="position-relative">
                  <input
                    type="email"
                    className={`form-control form-control-sm ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={loginStyles.input}
                    placeholder="tu@email.com"
                    required
                  />
                  <div className="position-absolute top-50 start-0 translate-middle-y ms-2 text-light">
                    <Mail size={16} />
                  </div>
                </div>
                {errors.email && (
                  <div className="invalid-feedback d-block" style={{ fontSize: '0.85rem' }}>{errors.email}</div>
                )}
              </div>

              {/* Password Field */}
              <div className="mb-2">
                <label htmlFor="password" className="form-label text-white fw-medium" style={{ fontSize: '0.95rem', marginBottom: 2 }}>
                  Contraseña
                </label>
                <div className="position-relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`form-control form-control-sm ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    style={{ ...loginStyles.input, paddingLeft: 36, paddingRight: 36 }}
                    placeholder="••••••••"
                    required
                  />
                  <div className="position-absolute top-50 start-0 translate-middle-y ms-2 text-light">
                    <Lock size={16} />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="position-absolute top-50 end-0 translate-middle-y me-2 border-0 bg-transparent text-light"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ fontSize: '1rem' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
                {errors.password && (
                  <div className="invalid-feedback d-block" style={{ fontSize: '0.85rem' }}>{errors.password}</div>
                )}
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    style={{ width: 16, height: 16 }}
                  />
                  <label className="form-check-label text-white" htmlFor="rememberMe" style={{ fontSize: '0.9rem' }}>
                    Recordarme
                  </label>
                </div>
                <a href="#" className="text-decoration-none" style={{ color: "#DC2626", fontSize: '0.9rem' }}>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isLoading}
                isLoading={isLoading}
                text={isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                style={{ ...loginStyles.button, border: "none" }}
              />

              {/* Quick Login Buttons */}
              <div className="mb-2">
                <div className="row g-2">
                  <div className="col-6">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => quickLogin('admin@beltspot.com', 'password')}
                      disabled={isLoading}
                      iconBefore={<Crown size={14} />}
                      text="Admin"
                      style={{ borderRadius: "6px", padding: "7px", border: "1px solid #374151", fontSize: "0.85rem" }}
                    />
                  </div>
                  <div className="col-6">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => quickLogin('user@beltspot.com', 'password')}
                      disabled={isLoading}
                      iconBefore={<User size={14} />}
                      text="Usuario"
                      style={{ borderRadius: "6px", padding: "7px", border: "1px solid #374151", fontSize: "0.85rem" }}
                    />
                  </div>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center" style={loginStyles.link}>
                <span className="text-light">¿No tienes una cuenta? </span>
                <Link to="/register" className="text-decoration-none fw-medium" style={{ color: "#DC2626" }}>
                  Regístrate aquí
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Pure Image */}
        <div className="col-lg-6 d-none d-lg-flex" style={loginStyles.imageColumn}>
          <img 
            src="/public/3.png" 
            alt="Cinturón rojo con piedras brillantes" 
            className="w-100 h-100"
            style={{
              objectFit: 'cover',
              objectPosition: 'center'
            }}
            onError={(e) => {
              // Fallback si la imagen no carga
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.style.backgroundColor = '#DC2626';
            }}
          />
        </div>
      </div>
    </div>
  );
}; 