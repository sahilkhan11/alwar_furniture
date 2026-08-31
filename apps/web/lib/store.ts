import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface StoreState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: () => number;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (item) => set((state) => {
        const existing = state.cart.find(i => i.id === item.id);
        if (existing) {
          return {
            cart: state.cart.map(i => 
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            )
          };
        }
        return { cart: [...state.cart, item] };
      }),
      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter(i => i.id !== id)
      })),
      clearCart: () => set({ cart: [] }),
      cartTotal: () => get().cart.reduce((total, item) => total + (item.price * item.quantity), 0),
    }),
    {
      name: 'alwar-cart-storage',
    }
  )
);

interface AuthState {
  token: string | null;
  user: { id: string; role: string; name?: string; email?: string } | null;
  setAuth: (token: string, user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'alwar-auth-storage',
    }
  )
);
