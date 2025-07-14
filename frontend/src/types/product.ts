export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category_id: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  created_at: string;
  updated_at: string;
} 