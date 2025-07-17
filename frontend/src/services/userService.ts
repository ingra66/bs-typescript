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
  last_order?: {
    order_number: string;
    status: string;
  };
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
  message?: string;
}

export interface UserStatsResponse {
  success: boolean;
  data: UserStatistics;
  message?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  is_admin?: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  is_admin?: boolean;
}

export interface UsersStatisticsResponse {
  success: boolean;
  data: {
    total_users: number;
    new_users_this_month: number;
    verified_users: number;
    admin_users: number;
    users_with_orders: number;
  };
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
    try {
      const response = await api.get('/admin/users', { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching admin users:', error);
      throw new Error(error.response?.data?.message || 'Error al cargar usuarios');
    }
  }

  /**
   * Obtener un usuario específico para el admin
   */
  async getAdminUser(userId: number): Promise<UserResponse> {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching admin user:', error);
      throw new Error(error.response?.data?.message || 'Error al cargar usuario');
    }
  }

  /**
   * Crear un nuevo usuario
   */
  async createUser(userData: CreateUserRequest): Promise<UserResponse> {
    try {
      const response = await api.post('/admin/users', userData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating user:', error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        throw new Error(errorMessages.join(', '));
      }
      throw new Error(error.response?.data?.message || 'Error al crear usuario');
    }
  }

  /**
   * Actualizar un usuario
   */
  async updateUser(userId: number, userData: UpdateUserRequest): Promise<UserResponse> {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating user:', error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        throw new Error(errorMessages.join(', '));
      }
      throw new Error(error.response?.data?.message || 'Error al actualizar usuario');
    }
  }

  /**
   * Eliminar un usuario
   */
  async deleteUser(userId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting user:', error);
      throw new Error(error.response?.data?.message || 'Error al eliminar usuario');
    }
  }

  /**
   * Obtener estadísticas de un usuario
   */
  async getUserStatistics(userId: number): Promise<UserStatsResponse> {
    try {
      const response = await api.get(`/admin/users/${userId}/statistics`);
      
      // Convertir valores a números para evitar errores de toFixed()
      if (response.data.success && response.data.data) {
        response.data.data.total_spent = Number(response.data.data.total_spent) || 0;
        response.data.data.average_order_value = Number(response.data.data.average_order_value) || 0;
        response.data.data.total_orders = Number(response.data.data.total_orders) || 0;
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user statistics:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas del usuario');
    }
  }

  /**
   * Obtener estadísticas generales de usuarios
   */
  async getUsersStatistics(): Promise<UsersStatisticsResponse> {
    try {
      const response = await api.get('/admin/users/statistics');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching users statistics:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas generales');
    }
  }
}

export default new UserService(); 