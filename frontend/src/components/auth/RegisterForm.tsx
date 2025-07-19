import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Eye, EyeOff, Mail, Lock, User, Shield, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, isAuthenticated, user } = useAuthStore();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Confirma tu contraseña';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await register(formData);
    } catch (error) {
      // El error ya se maneja en el store
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, color: 'bg-secondary', text: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const colors = ['bg-danger', 'bg-warning', 'bg-info', 'bg-primary', 'bg-success'];
    const texts = ['Muy débil', 'Débil', 'Media', 'Fuerte', 'Muy fuerte'];
    
    return {
      strength: Math.min(strength, 5),
      color: colors[Math.min(strength - 1, 4)],
      text: texts[Math.min(strength - 1, 4)]
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Estilos CSS para centrar el formulario
  const registerStyles = {
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

  return (
    <div className="container-fluid p-0" style={registerStyles.container}>
      <div className="row g-0" style={{ height: '100vh' }}>
        {/* Left Side - Register Form */}
        <div className="col-lg-6" style={registerStyles.formColumn}>
          <div className="w-100" style={registerStyles.formBox}>
            {/* Logo */}
            <div style={registerStyles.logo}>
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
            <div style={registerStyles.title}>Crear cuenta</div>
            <div style={registerStyles.subtitle}>Únete a nuestra comunidad</div>

            {/* Register Form */}
            <form onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="mb-2">
                <label htmlFor="name" className="form-label text-white fw-medium" style={{ fontSize: '0.95rem', marginBottom: 2 }}>
                  Nombre completo
                </label>
                <div className="position-relative">
                <input
                    type="text"
                    className={`form-control form-control-sm ${errors.name ? 'is-invalid' : ''}`}
                  id="name"
                  name="name"
                  value={formData.name}
                    onChange={handleInputChange}
                    style={registerStyles.input}
                  placeholder="Tu nombre completo"
                    required
                />
                  <div className="position-absolute top-50 start-0 translate-middle-y ms-2 text-light">
                    <User size={16} />
                  </div>
              </div>
              {errors.name && (
                  <div className="invalid-feedback d-block" style={{ fontSize: '0.85rem' }}>{errors.name}</div>
              )}
            </div>

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
                    style={registerStyles.input}
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
                    style={{ ...registerStyles.input, paddingLeft: 36, paddingRight: 36 }}
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
                
                {/* Password strength indicator */}
                {formData.password && (
                  <div className="mt-1">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <small className="text-light">Fortaleza:</small>
                      <small className={`text-${passwordStrength.color.replace('bg-', '')}`}>{passwordStrength.text}</small>
                    </div>
                    <div className="progress" style={{ height: "5px" }}>
                      <div 
                        className={`progress-bar ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
              {errors.password && (
                  <div className="invalid-feedback d-block" style={{ fontSize: '0.85rem' }}>{errors.password}</div>
              )}
            </div>

              {/* Confirm Password Field */}
              <div className="mb-3">
                <label htmlFor="password_confirmation" className="form-label text-white fw-medium" style={{ fontSize: '0.95rem', marginBottom: 2 }}>
                  Confirmar contraseña
              </label>
                <div className="position-relative">
                <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`form-control form-control-sm ${errors.password_confirmation ? 'is-invalid' : ''}`}
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                    onChange={handleInputChange}
                    style={{ ...registerStyles.input, paddingLeft: 36, paddingRight: 36 }}
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ fontSize: '1rem' }}
                >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
                
                {/* Password match indicator */}
                {formData.password_confirmation && (
                  <div className="mt-1">
                    {formData.password === formData.password_confirmation ? (
                      <small className="text-success d-flex align-items-center" style={{ fontSize: '0.85rem' }}>
                        <CheckCircle size={14} className="me-1" />
                        Las contraseñas coinciden
                      </small>
                    ) : (
                      <small className="text-danger d-flex align-items-center" style={{ fontSize: '0.85rem' }}>
                        <span className="me-1">⚠</span>
                        Las contraseñas no coinciden
                      </small>
                    )}
                  </div>
                )}
                
              {errors.password_confirmation && (
                  <div className="invalid-feedback d-block" style={{ fontSize: '0.85rem' }}>{errors.password_confirmation}</div>
              )}
            </div>

              {/* Sign Up Button */}
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isLoading}
                isLoading={isLoading}
                text={isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
                style={{ ...registerStyles.button, border: "none" }}
              />

              {/* Sign In Link */}
              <div className="text-center" style={registerStyles.link}>
                <span className="text-light">¿Ya tienes una cuenta? </span>
                <Link to="/login" className="text-decoration-none fw-medium" style={{ color: "#DC2626" }}>
                  Inicia sesión aquí
                </Link>
            </div>
          </form>
          </div>
        </div>

        {/* Right Side - Pure Image */}
        <div className="col-lg-6 d-none d-lg-flex" style={registerStyles.imageColumn}>
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