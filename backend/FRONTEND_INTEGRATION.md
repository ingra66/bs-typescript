# 🚀 Integración Frontend - BeltSpot Ecommerce API

## 📋 Información General

Esta API está completamente preparada para ser consumida por un frontend React con TypeScript. Todas las rutas están documentadas, tipadas y listas para la integración.

---

## 🔧 Configuración Base

### **URL Base**
```
http://localhost:8000/api/v1
```

### **Headers Requeridos**
```typescript
// Para rutas públicas
{
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

// Para rutas protegidas
{
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer {token}'
}
```

---

## 🔐 Autenticación

### **Tipos TypeScript**
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}
```

### **Endpoints de Autenticación**

#### **1. Registro**
```typescript
POST /register
Body: RegisterRequest
Response: AuthResponse
```

#### **2. Login**
```typescript
POST /login
Body: LoginRequest
Response: AuthResponse
```

#### **3. Obtener Usuario**
```typescript
GET /user
Headers: Authorization: Bearer {token}
Response: { success: boolean; data: User }
```

#### **4. Logout**
```typescript
POST /logout
Headers: Authorization: Bearer {token}
Response: { success: boolean; message: string }
```

---

## 📦 Categorías

### **Tipos TypeScript**
```typescript
interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CategoryResponse {
  success: boolean;
  data: Category[];
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
```

### **Endpoints**

#### **1. Listar Categorías**
```typescript
GET /categories
Query Parameters:
  - active?: boolean
  - with_products?: boolean
  - order_by?: string
  - order_direction?: 'asc' | 'desc'
  - per_page?: number
Response: CategoryResponse
```

#### **2. Navegación de Categorías**
```typescript
GET /categories/navigation
Response: CategoryResponse
```

#### **3. Obtener Categoría**
```typescript
GET /categories/{id}
Response: { success: boolean; data: Category }
```

---

## 🛍️ Productos

### **Tipos TypeScript**
```typescript
interface Product {
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
  category: Category;
  variants?: ProductVariant[];
  reviews?: Review[];
  created_at: string;
  updated_at: string;
}

interface ProductVariant {
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

interface ProductResponse {
  success: boolean;
  data: Product[];
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
```

### **Endpoints**

#### **1. Listar Productos**
```typescript
GET /products
Query Parameters:
  - active?: boolean
  - featured?: boolean
  - in_stock?: boolean
  - category_id?: number
  - category_slug?: string
  - search?: string
  - min_price?: number
  - max_price?: number
  - min_rating?: number
  - order_by?: string
  - order_direction?: 'asc' | 'desc'
  - per_page?: number
Response: ProductResponse
```

#### **2. Productos Destacados**
```typescript
GET /products/featured
Response: ProductResponse
```

#### **3. Búsqueda de Productos**
```typescript
GET /products/search?q={query}
Response: ProductResponse
```

#### **4. Obtener Producto**
```typescript
GET /products/{id}
Response: {
  success: boolean;
  data: Product;
  related_products: Product[];
}
```

#### **5. Productos por Categoría**
```typescript
GET /categories/{category}/products
Response: ProductResponse
```

---

## 🛒 Carrito

### **Tipos TypeScript**
```typescript
interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  product: Product;
  subtotal: number;
  created_at: string;
  updated_at: string;
}

interface CartResponse {
  success: boolean;
  data: {
    items: CartItem[];
    subtotal: number;
    formatted_subtotal: string;
    total_items: number;
  };
}

interface AddToCartRequest {
  product_id: number;
  quantity: number;
}

interface UpdateCartRequest {
  quantity: number;
}
```

### **Endpoints (Protegidos)**

#### **1. Ver Carrito**
```typescript
GET /cart
Headers: Authorization: Bearer {token}
Response: CartResponse
```

#### **2. Agregar al Carrito**
```typescript
POST /cart/add
Headers: Authorization: Bearer {token}
Body: AddToCartRequest
Response: { success: boolean; message: string; data: CartItem }
```

#### **3. Actualizar Cantidad**
```typescript
PUT /cart/{cartItemId}
Headers: Authorization: Bearer {token}
Body: UpdateCartRequest
Response: { success: boolean; message: string; data: CartItem }
```

#### **4. Remover del Carrito**
```typescript
DELETE /cart/{cartItemId}
Headers: Authorization: Bearer {token}
Response: { success: boolean; message: string }
```

#### **5. Vaciar Carrito**
```typescript
DELETE /cart
Headers: Authorization: Bearer {token}
Response: { success: boolean; message: string }
```

#### **6. Resumen del Carrito**
```typescript
GET /cart/summary
Headers: Authorization: Bearer {token}
Response: {
  success: boolean;
  data: {
    total_items: number;
    subtotal: number;
    formatted_subtotal: string;
  };
}
```

---

## 📦 Órdenes

### **Tipos TypeScript**
```typescript
interface Order {
  id: number;
  user_id: number;
  order_number: string;
  total_amount: number;
  tax_amount: number;
  shipping_amount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed';
  payment_method?: string;
  mp_payment_id?: string;
  mp_preference_id?: string;
  shipping_address: Address;
  billing_address: Address;
  notes?: string;
  items: OrderItem[];
  user: User;
  created_at: string;
  updated_at: string;
}

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_data: any;
}

interface Address {
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

interface CreateOrderRequest {
  shipping_address: Address;
  billing_address?: Address;
  coupon_code?: string;
  notes?: string;
}
```

### **Endpoints (Protegidos)**

#### **1. Listar Órdenes**
```typescript
GET /orders
Headers: Authorization: Bearer {token}
Query Parameters:
  - status?: string
  - payment_status?: string
  - order_by?: string
  - order_direction?: 'asc' | 'desc'
  - per_page?: number
Response: { success: boolean; data: Order[]; pagination: Pagination }
```

#### **2. Crear Orden**
```typescript
POST /orders
Headers: Authorization: Bearer {token}
Body: CreateOrderRequest
Response: { success: boolean; message: string; data: Order }
```

#### **3. Obtener Orden**
```typescript
GET /orders/{id}
Headers: Authorization: Bearer {token}
Response: { success: boolean; data: Order }
```

#### **4. Cancelar Orden**
```typescript
POST /orders/{id}/cancel
Headers: Authorization: Bearer {token}
Response: { success: boolean; message: string; data: Order }
```

#### **5. Estadísticas de Órdenes**
```typescript
GET /orders/statistics
Headers: Authorization: Bearer {token}
Response: {
  success: boolean;
  data: {
    total_orders: number;
    pending_orders: number;
    total_spent: number;
    recent_orders: Order[];
  };
}
```

---

## 🎫 Cupones

### **Tipos TypeScript**
```typescript
interface Coupon {
  id: number;
  code: string;
  name: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  minimum_amount: number;
  max_uses?: number;
  used_count: number;
  starts_at?: string;
  expires_at?: string;
  is_active: boolean;
  applicable_categories?: number[];
  excluded_products?: number[];
}

interface ValidateCouponRequest {
  code: string;
  subtotal: number;
}

interface ValidateCouponResponse {
  success: boolean;
  data: {
    coupon: Coupon;
    discount: number;
    formatted_discount: string;
    final_amount: number;
    formatted_final_amount: string;
  };
}
```

### **Endpoints**

#### **1. Validar Cupón (Público)**
```typescript
POST /coupons/validate
Body: ValidateCouponRequest
Response: ValidateCouponResponse
```

---

## ⭐ Reseñas

### **Tipos TypeScript**
```typescript
interface Review {
  id: number;
  user_id: number;
  product_id: number;
  order_id?: number;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  is_verified_purchase: boolean;
  is_approved: boolean;
  is_helpful: boolean;
  helpful_count: number;
  not_helpful_count: number;
  user: User;
  created_at: string;
  updated_at: string;
}

interface CreateReviewRequest {
  product_id: number;
  order_id?: number;
  rating: number;
  title?: string;
  comment: string;
  is_verified?: boolean;
}
```

### **Endpoints**

#### **1. Listar Reseñas de Producto (Público)**
```typescript
GET /products/{productId}/reviews
Query Parameters:
  - rating?: number
  - verified?: boolean
  - order_by?: string
  - per_page?: number
Response: { success: boolean; data: Review[]; pagination: Pagination }
```

#### **2. Ver Reseña (Público)**
```typescript
GET /reviews/{id}
Response: { success: boolean; data: Review }
```

#### **3. Crear Reseña (Protegido)**
```typescript
POST /reviews
Headers: Authorization: Bearer {token}
Body: CreateReviewRequest
Response: { success: boolean; message: string; data: Review }
```

#### **4. Actualizar Reseña (Protegido)**
```typescript
PUT /reviews/{id}
Headers: Authorization: Bearer {token}
Body: CreateReviewRequest
Response: { success: boolean; message: string; data: Review }
```

#### **5. Eliminar Reseña (Protegido)**
```typescript
DELETE /reviews/{id}
Headers: Authorization: Bearer {token}
Response: { success: boolean; message: string }
```

#### **6. Marcar como Útil (Protegido)**
```typescript
POST /reviews/{id}/helpful
Headers: Authorization: Bearer {token}
Response: { success: boolean; message: string }
```

---

## ❤️ Lista de Deseos

### **Tipos TypeScript**
```typescript
interface Wishlist {
  id: number;
  user_id: number;
  product_id: number;
  notes?: string;
  is_public: boolean;
  product: Product;
  created_at: string;
  updated_at: string;
}

interface AddToWishlistRequest {
  product_id: number;
  notes?: string;
  is_public?: boolean;
}

interface CheckWishlistRequest {
  product_id: number;
}
```

### **Endpoints (Protegidos)**

#### **1. Ver Lista de Deseos**
```typescript
GET /wishlist
Headers: Authorization: Bearer {token}
Response: { success: boolean; data: Wishlist[] }
```

#### **2. Agregar a Lista de Deseos**
```typescript
POST /wishlist/add
Headers: Authorization: Bearer {token}
Body: AddToWishlistRequest
Response: { success: boolean; message: string; data: Wishlist }
```

#### **3. Actualizar Item**
```typescript
PUT /wishlist/{id}
Headers: Authorization: Bearer {token}
Body: AddToWishlistRequest
Response: { success: boolean; message: string; data: Wishlist }
```

#### **4. Remover de Lista de Deseos**
```typescript
DELETE /wishlist/{id}
Headers: Authorization: Bearer {token}
Response: { success: boolean; message: string }
```

#### **5. Verificar en Lista de Deseos**
```typescript
POST /wishlist/check
Headers: Authorization: Bearer {token}
Body: CheckWishlistRequest
Response: { success: boolean; data: { in_wishlist: boolean } }
```

---

## 🔔 Notificaciones

### **Tipos TypeScript**
```typescript
interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  data?: any;
  icon?: string;
  action_url?: string;
  action_text?: string;
  read_at?: string;
  is_important: boolean;
  created_at: string;
  updated_at: string;
}
```

### **Endpoints (Protegidos)**

#### **1. Listar Notificaciones**
```typescript
GET /notifications
Headers: Authorization: Bearer {token}
Query Parameters:
  - unread?: boolean
  - read?: boolean
  - important?: boolean
  - type?: string
  - order_by?: string
  - per_page?: number
Response: { success: boolean; data: Notification[]; pagination: Pagination }
```

#### **2. Notificaciones No Leídas**
```typescript
GET /notifications/unread
Headers: Authorization: Bearer {token}
Response: { success: boolean; data: Notification[] }
```

#### **3. Marcar como Leída**
```typescript
POST /notifications/{id}/read
Headers: Authorization: Bearer {token}
Response: { success: boolean; message: string }
```

#### **4. Marcar Todas como Leídas**
```typescript
POST /notifications/read-all
Headers: Authorization: Bearer {token}
Response: { success: boolean; message: string }
```

---

## 💳 MercadoPago

### **Tipos TypeScript**
```typescript
interface MercadoPagoPreference {
  preference_id: string;
  init_point: string;
}

interface CreatePreferenceRequest {
  order_id: number;
}
```

### **Endpoints**

#### **1. Métodos de Pago (Público)**
```typescript
GET /mercadopago/payment-methods
Response: { success: boolean; data: PaymentMethod[] }
```

#### **2. Crear Preferencia de Pago (Protegido)**
```typescript
POST /mercadopago/create-preference
Headers: Authorization: Bearer {token}
Body: CreatePreferenceRequest
Response: { success: boolean; data: MercadoPagoPreference }
```

#### **3. Estado de Pago (Protegido)**
```typescript
GET /mercadopago/orders/{orderId}/payment-status
Headers: Authorization: Bearer {token}
Response: { success: boolean; data: PaymentStatus }
```

---

## 🔧 Utilidades para Frontend

### **Cliente HTTP (Axios)**
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### **Hooks de React**
```typescript
// Hook para autenticación
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    const { user, token } = response.data.data;
    localStorage.setItem('token', token);
    setUser(user);
    return response.data;
  };

  const logout = async () => {
    await api.post('/logout');
    localStorage.removeItem('token');
    setUser(null);
  };

  const register = async (userData: RegisterRequest) => {
    const response = await api.post('/register', userData);
    const { user, token } = response.data.data;
    localStorage.setItem('token', token);
    setUser(user);
    return response.data;
  };

  return { user, loading, login, logout, register };
};
```

---

## 🎨 Integración con ShadCN/UI

### **Configuración de ShadCN**
```bash
# Instalar ShadCN/UI
npx shadcn@latest init

# Instalar componentes necesarios
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add form
npx shadcn@latest add toast
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add select
npx shadcn@latest add textarea
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
npx shadcn@latest add tabs
npx shadcn@latest add table
npx shadcn@latest add pagination
npx shadcn@latest add skeleton
npx shadcn@latest add progress
npx shadcn@latest add alert
npx shadcn@latest add separator
```

### **Configuración de Formularios con React Hook Form**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Schema de validación
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

// Hook personalizado para formularios
export const useFormWithValidation = <T extends z.ZodType>(schema: T) => {
  return useForm<z.infer<T>>({
    resolver: zodResolver(schema),
  });
};
```
```

### **Tipos Globales**
```typescript
// types/api.ts
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
```

---

## 🚀 Ejemplo de Uso Completo

### **Componente de Login con ShadCN**
```typescript
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginComponent: React.FC = () => {
  const { toast } = useToast();
  const { login } = useAuth();
  
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      toast({
        title: 'Login exitoso',
        description: 'Has iniciado sesión correctamente',
      });
      // Redirigir al dashboard
    } catch (error) {
      toast({
        title: 'Error de login',
        description: 'Credenciales incorrectas',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="tu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Iniciar Sesión
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
```
```

### **Componente de Productos con ShadCN**
```typescript
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import api from '../services/api';
import { Product } from '../types/api';

const ProductsComponent: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los productos',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  const addToCart = async (productId: number) => {
    try {
      await api.post('/cart/add', { product_id: productId, quantity: 1 });
      toast({
        title: 'Producto agregado',
        description: 'Se agregó al carrito correctamente',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo agregar al carrito',
        variant: 'destructive',
      });
    }
  };

  const addToWishlist = async (productId: number) => {
    try {
      await api.post('/wishlist/add', { product_id: productId });
      toast({
        title: 'Agregado a favoritos',
        description: 'Se agregó a tu lista de deseos',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo agregar a favoritos',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-48 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <CardHeader className="p-0">
            <img
              src={product.images?.[0] || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            {product.is_featured && (
              <Badge className="absolute top-2 left-2" variant="secondary">
                Destacado
              </Badge>
            )}
            {product.compare_price && product.compare_price > product.price && (
              <Badge className="absolute top-2 right-2" variant="destructive">
                -{Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%
              </Badge>
            )}
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {product.name}
            </CardTitle>
            <CardDescription className="line-clamp-2 mt-2">
              {product.description}
            </CardDescription>
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.average_rating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-500 ml-1">
                  ({product.reviews_count || 0})
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div>
                <span className="text-lg font-bold">${product.price}</span>
                {product.compare_price && product.compare_price > product.price && (
                  <span className="text-sm text-gray-500 line-through ml-2">
                    ${product.compare_price}
                  </span>
                )}
              </div>
              <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                {product.stock > 0 ? 'En stock' : 'Sin stock'}
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <div className="flex gap-2 w-full">
              <Button
                onClick={() => addToCart(product.id)}
                disabled={product.stock === 0}
                className="flex-1"
                size="sm"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Agregar
              </Button>
              <Button
                onClick={() => addToWishlist(product.id)}
                variant="outline"
                size="sm"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
```
```

---

## ✅ Checklist de Integración

- [x] **Autenticación** - Sanctum configurado y funcionando
- [x] **CORS** - Configurado para permitir peticiones del frontend
- [x] **Tipos TypeScript** - Todos los endpoints documentados
- [x] **Manejo de errores** - Respuestas consistentes
- [x] **Paginación** - Implementada en todos los listados
- [x] **Filtros** - Búsqueda y filtros avanzados
- [x] **Validación** - Todos los endpoints validan datos
- [x] **Autorización** - Middleware de admin funcionando
- [x] **Documentación** - Endpoints completamente documentados
- [x] **ShadCN/UI** - Componentes y ejemplos incluidos

---

## 📦 Dependencias Frontend

### **Package.json Dependencias**
```json
{
  "dependencies": {
    "@hookform/resolvers": "^3.3.2",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-form": "^0.0.3",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-pagination": "^1.0.3",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-radio-group": "^1.1.3",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "axios": "^1.6.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "lucide-react": "^0.294.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.48.2",
    "tailwind-merge": "^2.0.0",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "^20.9.0",
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
    "@vitejs/plugin-react": "^4.1.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.53.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.2.2",
    "vite": "^4.5.0"
  }
}
```

### **Configuración de Tailwind CSS**
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

---

## 🎯 Próximos Pasos

1. **Configurar el frontend** con las URLs y tipos
2. **Implementar autenticación** con Sanctum
3. **Crear componentes** para cada funcionalidad
4. **Probar integración** con la API
5. **Desplegar** en producción

La API está **100% lista** para la integración con React/TypeScript! 🚀 