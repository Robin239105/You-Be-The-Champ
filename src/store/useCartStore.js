import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.id === product.id);
        
        if (existingItem) {
          set({
            items: currentItems.map(item =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            )
          });
        } else {
          set({ items: [...currentItems, { ...product, quantity: 1 }] });
        }
      },
      removeItem: (productId) => set({
        items: get().items.filter(item => item.id !== productId)
      }),
      updateQty: (productId, quantity) => set({
        items: get().items.map(item =>
          item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      }),
      clearCart: () => set({ items: [] }),
      getTotal: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
      getItemCount: () => get().items.reduce((count, item) => count + item.quantity, 0),
    }),
    {
      name: 'ybtc-cart-storage',
    }
  )
);
