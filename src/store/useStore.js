import { create } from 'zustand';

export const useStore = create((set) => ({
  cart: [],
  wishlist: [],
  user: null,
  
  // Connectivity Status for Demo
  backendStatus: 'Testing connection...',
  setBackendStatus: (status) => set({ backendStatus: status }),

  addToCart: (product) => set((state) => ({ cart: [...state.cart, product] })),
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter((item) => item.id !== productId),
  })),
  setUser: (user) => set({ user }),
}));
