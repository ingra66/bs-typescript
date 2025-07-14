import { create } from 'zustand';
import { authService } from '@/services/authService';
import type { AuthStore, LoginRequest, RegisterRequest, User } from '@/types/auth';
import toast from 'react-hot-toast';


// Hook para navegación fuera de componentes
let navigate: (path: string) => void = () => {};
export const setNavigate = (navFn: (path: string) => void) => {
  navigate = navFn;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: authService.getUser(),
  token: authService.getToken(),
  isAuthenticated: !!authService.getToken(),
  isLoading: false,

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true });
    try {
      const response = await authService.login(credentials);
      
      // Guardar en localStorage
      authService.saveToken(response.data.token);
      authService.saveUser(response.data.user);
      
      // Actualizar estado
      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
        isLoading: false,
      });
      
      toast.success('¡Inicio de sesión exitoso!');

      // Redirección automática según rol
      if (response.data.user.is_admin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      toast.error(message);
      throw error;
    }
  },

  register: async (userData: RegisterRequest) => {
    set({ isLoading: true });
    try {
      const response = await authService.register(userData);
      
      // Guardar en localStorage
      authService.saveToken(response.data.token);
      authService.saveUser(response.data.user);
      
      // Actualizar estado
      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
        isLoading: false,
      });
      
      toast.success('¡Registro exitoso!');

      // Redirección automática según rol
      if (response.data.user.is_admin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.message || 'Error al registrar usuario';
      toast.error(message);
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar localStorage y estado
      authService.clearAuth();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      toast.success('Sesión cerrada correctamente');
      navigate('/');
    }
  },

  setUser: (user: User) => {
    set({ user });
    authService.saveUser(user);
  },

  setToken: (token: string) => {
    set({ token, isAuthenticated: true });
    authService.saveToken(token);
  },

  clearAuth: () => {
    authService.clearAuth();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
})); 