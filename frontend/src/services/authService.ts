import api from './api';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types/auth';

export const authService = {
  // Login
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/login', credentials);
    return response.data;
  },

  // Registro
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/register', userData);
    return response.data;
  },

  // Logout
  async logout(): Promise<void> {
    await api.post('/logout');
  },

  // Obtener usuario actual
  async getCurrentUser(): Promise<User> {
    const response = await api.get<{ success: boolean; data: User }>('/user');
    return response.data.data;
  },

  // Guardar token en localStorage
  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  },

  // Obtener token del localStorage
  getToken(): string | null {
    try {
      const token = localStorage.getItem('auth_token');
      return token || null;
    } catch (error) {
      console.error('Error getting token from localStorage:', error);
      return null;
    }
  },

  // Eliminar token del localStorage
  removeToken(): void {
    localStorage.removeItem('auth_token');
  },

  // Guardar usuario en localStorage
  saveUser(user: User): void {
    try {
      if (user && typeof user === 'object') {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        console.warn('Attempting to save invalid user data:', user);
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
      localStorage.removeItem('user');
    }
  },

  // Obtener usuario del localStorage
  getUser(): User | null {
    try {
      const user = localStorage.getItem('user');
      if (!user || user === 'undefined' || user === 'null') {
        // Limpiar datos inválidos
        localStorage.removeItem('user');
        return null;
      }
      return JSON.parse(user);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      // Limpiar datos corruptos
      localStorage.removeItem('user');
      return null;
    }
  },

  // Eliminar usuario del localStorage
  removeUser(): void {
    localStorage.removeItem('user');
  },

  // Limpiar toda la información de autenticación
  clearAuth(): void {
    this.removeToken();
    this.removeUser();
  }
}; 