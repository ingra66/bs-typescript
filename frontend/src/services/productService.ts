import axios from 'axios';
import { apiConfig } from '../config/api';

export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_price?: number;
  stock: number;
  sku: string;
  images?: string[];
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  variants?: ProductVariant[];
  reviews?: Review[];
  main_image?: string;
  discount_percentage?: number;
  average_rating?: number;
  reviews_count?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  is_active: boolean;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  name: string;
  value: string;
  price_adjustment: number;
  stock: number;
  sku: string;
  barcode?: string;
  weight?: number;
  width?: number;
  height?: number;
  length?: number;
  is_active: boolean;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment?: string;
  is_approved: boolean;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface ProductFilters {
  search?: string;
  category_id?: number;
  category_slug?: string;
  active?: boolean;
  featured?: boolean;
  in_stock?: boolean;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  order_by?: string;
  order_direction?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface ProductCreateData {
  category_id: number;
  name: string;
  description: string;
  price: number;
  compare_price?: number;
  stock: number;
  sku: string;
  images?: File[];
  is_active?: boolean;
  is_featured?: boolean;
}

export interface ProductUpdateData extends Partial<ProductCreateData> {
  id: number;
}

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

class ProductService {
  private baseURL = apiConfig.baseURL;

  // Obtener todos los productos con filtros
  async getProducts(filters: ProductFilters = {}): Promise<ApiResponse<Product[]>> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get(`${this.baseURL}/products?${params.toString()}`);
      
      // Procesar los datos para asegurar tipos correctos
      if (response.data.success && response.data.data) {
        response.data.data = response.data.data.map((product: any) => ({
          ...product,
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
          compare_price: product.compare_price ? (typeof product.compare_price === 'string' ? parseFloat(product.compare_price) : product.compare_price) : undefined,
          stock: typeof product.stock === 'string' ? parseInt(product.stock) : product.stock,
        }));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Obtener un producto específico
  async getProduct(id: number): Promise<ApiResponse<Product>> {
    try {
      const response = await axios.get(`${this.baseURL}/products/${id}`);
      
      // Procesar los datos para asegurar tipos correctos
      if (response.data.success && response.data.data) {
        const product = response.data.data;
        response.data.data = {
          ...product,
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
          compare_price: product.compare_price ? (typeof product.compare_price === 'string' ? parseFloat(product.compare_price) : product.compare_price) : undefined,
          stock: typeof product.stock === 'string' ? parseInt(product.stock) : product.stock,
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Crear un nuevo producto
  async createProduct(data: ProductCreateData): Promise<ApiResponse<Product>> {
    try {
      const formData = new FormData();
      
      // Agregar campos básicos
      formData.append('category_id', data.category_id.toString());
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('stock', data.stock.toString());
      formData.append('sku', data.sku);
      
      if (data.compare_price) {
        formData.append('compare_price', data.compare_price.toString());
      }
      
      if (data.is_active !== undefined) {
        formData.append('is_active', data.is_active ? '1' : '0');
      }
      
      if (data.is_featured !== undefined) {
        formData.append('is_featured', data.is_featured ? '1' : '0');
      }
      
      // Agregar imágenes
      if (data.images) {
        data.images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      }

      // Obtener token de autenticación
      const token = localStorage.getItem('auth_token');
      
      const response = await axios.post(`${this.baseURL}/admin/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Actualizar un producto
  async updateProduct(data: ProductUpdateData): Promise<ApiResponse<Product>> {
    try {
      const formData = new FormData();
      
      // Agregar campos que se van a actualizar
      if (data.category_id) formData.append('category_id', data.category_id.toString());
      if (data.name) formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      if (data.price !== undefined) formData.append('price', data.price.toString());
      if (data.stock !== undefined) formData.append('stock', data.stock.toString());
      if (data.sku) formData.append('sku', data.sku);
      
      if (data.compare_price !== undefined) {
        formData.append('compare_price', data.compare_price.toString());
      }
      
      if (data.is_active !== undefined) {
        formData.append('is_active', data.is_active ? '1' : '0');
      }
      
      if (data.is_featured !== undefined) {
        formData.append('is_featured', data.is_featured ? '1' : '0');
      }
      
      // Agregar imágenes si se proporcionan
      if (data.images) {
        data.images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      }

      // Laravel espera POST + _method=PUT para FormData
      formData.append('_method', 'PUT');

      // Obtener token de autenticación
      const token = localStorage.getItem('auth_token');
      
      const response = await axios.post(`${this.baseURL}/admin/products/${data.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Eliminar un producto
  async deleteProduct(id: number): Promise<ApiResponse<null>> {
    try {
      // Obtener token de autenticación
      const token = localStorage.getItem('auth_token');
      
      const response = await axios.delete(`${this.baseURL}/admin/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Obtener productos destacados
  async getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
    try {
      const response = await axios.get(`${this.baseURL}/products/featured`);
      return response.data;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }

  // Buscar productos
  async searchProducts(query: string, filters: ProductFilters = {}): Promise<ApiResponse<Product[]>> {
    try {
      const params = new URLSearchParams({ search: query });
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get(`${this.baseURL}/products/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  // Obtener productos por categoría
  async getProductsByCategory(categorySlug: string, filters: ProductFilters = {}): Promise<ApiResponse<Product[]>> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get(`${this.baseURL}/categories/${categorySlug}/products?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }
}

export default new ProductService(); 