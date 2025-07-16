import api from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserStatistics {
  total_orders: number;
  total_spent: number;
  average_order_value: number;
  last_order_date: string | null;
  orders_by_status: Record<string, number>;
}

export interface UsersResponse {
  success: boolean;
  data: User[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface UserResponse {
  success: boolean;
  data: User;
}

export interface UserStatsResponse {
  success: boolean;
  data: UserStatistics;
}

class UserService {
  /**
   * Obtener todos los usuarios para el admin
   */
  async getAdminUsers(params?: {
    search?: string;
    is_admin?: boolean;
    email_verified?: boolean;
    order_by?: string;
    order_direction?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  }): Promise<UsersResponse> {
    const response = await api.get('/admin/users', { params });
    return response.data;
  }

  /**
   * Obtener un usuario específico para el admin
   */
  async getAdminUser(userId: number): Promise<UserResponse> {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  }

  /**
   * Crear un nuevo usuario
   */
  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    is_admin?: boolean;
  }): Promise<UserResponse> {
    const response = await api.post('/admin/users', userData);
    return response.data;
  }

  /**
   * Actualizar un usuario
   */
  async updateUser(userId: number, userData: {
    name?: string;
    email?: string;
    password?: string;
    password_confirmation?: string;
    is_admin?: boolean;
  }): Promise<UserResponse> {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  }

  /**
   * Eliminar un usuario
   */
  async deleteUser(userId: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  }

  /**
   * Obtener estadísticas de un usuario
   */
  async getUserStatistics(userId: number): Promise<UserStatsResponse> {
    const response = await api.get(`/admin/users/${userId}/statistics`);
    return response.data;
  }

  /**
   * Obtener estadísticas generales de usuarios
   */
  async getUsersStatistics(): Promise<{
    success: boolean;
    data: {
      total_users: number;
      new_users_this_month: number;
      verified_users: number;
      admin_users: number;
      users_with_orders: number;
    };
  }> {
    const response = await api.get('/admin/users/statistics');
    return response.data;
  }
}

export default new UserService(); 