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
    return localStorage.getItem('auth_token');
  },

  // Eliminar token del localStorage
  removeToken(): void {
    localStorage.removeItem('auth_token');
  },

  // Guardar usuario en localStorage
  saveUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Obtener usuario del localStorage
  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
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