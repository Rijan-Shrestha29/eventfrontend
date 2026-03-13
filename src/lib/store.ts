import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, CartItem, Event } from '../types';

// Auth Store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Cart Store
interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (eventId: string) => void;
  updateQuantity: (eventId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.eventId === item.eventId && i.ticketType.id === item.ticketType.id
          );
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.eventId === item.eventId && i.ticketType.id === item.ticketType.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (eventId) =>
        set((state) => ({
          items: state.items.filter((i) => i.eventId !== eventId),
        })),
      updateQuantity: (eventId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.eventId === eventId ? { ...i, quantity } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
      getTotalAmount: () => {
        const items = get().items;
        return items.reduce(
          (total, item) => total + item.ticketType.price * item.quantity,
          0
        );
      },
      getItemCount: () => {
        const items = get().items;
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

// Wishlist Store
interface WishlistState {
  items: string[];
  addItem: (eventId: string) => void;
  removeItem: (eventId: string) => void;
  isInWishlist: (eventId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (eventId) =>
        set((state) => {
          if (!state.items.includes(eventId)) {
            return { items: [...state.items, eventId] };
          }
          return state;
        }),
      removeItem: (eventId) =>
        set((state) => ({
          items: state.items.filter((id) => id !== eventId),
        })),
      isInWishlist: (eventId) => get().items.includes(eventId),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);

// UI Store
interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  mobileMenuOpen: false,
  toggleMobileMenu: () =>
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
}));
