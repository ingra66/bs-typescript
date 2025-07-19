import api from './api';
import axios from 'axios';
import { apiConfig } from '../config/api';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  is_active: boolean;
  products_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  image?: File;
  is_active?: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  image?: File;
  is_active?: boolean;
}

export interface CategoryStatistics {
  total_categories: number;
  active_categories: number;
  categories_with_products: number;
  categories_without_products: number;
  total_products: number;
}

class CategoryService {
  // Crear instancia de axios para rutas públicas
  private publicApi = axios.create({
    baseURL: apiConfig.baseURL,
    timeout: apiConfig.timeout,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Métodos públicos (sin autenticación)
  
  // Obtener todas las categorías públicas
  async getPublicCategories() {
    const response = await this.publicApi.get('/categories');
    return response.data;
  }

  // Obtener categoría específica pública
  async getPublicCategory(slug: string) {
    const response = await this.publicApi.get(`/categories/${slug}`);
    return response.data;
  }

  // Obtener categorías para navegación
  async getNavigationCategories() {
    const response = await this.publicApi.get('/categories/navigation');
    return response.data;
  }

  // Métodos de admin (con autenticación)
  
  // Listar categorías con paginación y filtros
  async getCategories(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    active?: boolean;
    order_by?: string;
    order_direction?: 'asc' | 'desc';
  }) {
    const response = await api.get('/admin/categories', { params });
    return response.data;
  }

  // Obtener categoría específica
  async getCategory(id: number) {
    const response = await api.get(`/admin/categories/${id}`);
    return response.data;
  }

  // Crear nueva categoría
  async createCategory(data: CreateCategoryRequest) {
    const formData = new FormData();
    formData.append('name', data.name);
    
    if (data.description) {
      formData.append('description', data.description);
    }
    
    if (data.image) {
      formData.append('image', data.image);
    }
    
    if (data.is_active !== undefined) {
      formData.append('is_active', data.is_active.toString());
    }

    const response = await api.post('/admin/categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Actualizar categoría
  async updateCategory(id: number, data: UpdateCategoryRequest) {
    const formData = new FormData();
    
    if (data.name) {
      formData.append('name', data.name);
    }
    
    if (data.description !== undefined) {
      formData.append('description', data.description);
    }
    
    if (data.image) {
      formData.append('image', data.image);
    }
    
    if (data.is_active !== undefined) {
      formData.append('is_active', data.is_active.toString());
    }

    // Para Laravel: indicar que es un update
    formData.append('_method', 'PUT');

    // Usar POST en vez de PUT
    const response = await api.post(`/admin/categories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Eliminar categoría
  async deleteCategory(id: number) {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  }

  // Cambiar estado de categoría
  async toggleStatus(id: number) {
    const response = await api.post(`/admin/categories/${id}/toggle-status`);
    return response.data;
  }

  // Subir imagen de categoría
  async uploadImage(id: number, image: File) {
    const formData = new FormData();
    formData.append('image', image);

    const response = await api.post(`/admin/categories/${id}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Obtener categorías para select
  async getCategoriesForSelect() {
    const response = await api.get('/admin/categories/for-select');
    return response.data;
  }

  // Obtener estadísticas
  async getStatistics(): Promise<{ success: boolean; data: CategoryStatistics }> {
    const response = await api.get('/admin/categories/statistics');
    return response.data;
  }

  // Obtener URL de imagen
  getImageUrl(imagePath?: string): string {
    if (!imagePath) return '/placeholder.svg';
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    const baseUrl = import.meta.env.DEV ? 'http://localhost:8000' : (import.meta.env.VITE_API_URL || 'http://localhost:8000');
    return `${baseUrl}/storage/${imagePath}`;
  }
}

export default new CategoryService(); 