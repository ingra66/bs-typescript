import axios from 'axios';
import { apiConfig } from '../config/api';
import type { Category } from './productService';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

class CategoryService {
  private baseURL = apiConfig.baseURL;

  // Obtener todas las categorías
  async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const response = await axios.get(`${this.baseURL}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Obtener una categoría específica
  async getCategory(id: number): Promise<ApiResponse<Category>> {
    try {
      const response = await axios.get(`${this.baseURL}/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  }

  // Obtener categorías con navegación
  async getCategoriesNavigation(): Promise<ApiResponse<Category[]>> {
    try {
      const response = await axios.get(`${this.baseURL}/categories/navigation`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories navigation:', error);
      throw error;
    }
  }
}

export default new CategoryService(); 