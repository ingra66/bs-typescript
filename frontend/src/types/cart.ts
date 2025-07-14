export interface CartItem {
  product_id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (product_id: number) => void;
  updateQuantity: (product_id: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  setCart: (items: CartItem[]) => void;
} 