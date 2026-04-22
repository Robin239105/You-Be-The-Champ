import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      toggleWishlist: (product) => {
        const isWishlisted = get().items.some(item => item.id === product.id);
        if (isWishlisted) {
          set({ items: get().items.filter(item => item.id !== product.id) });
        } else {
          set({ items: [...get().items, product] });
        }
      },
      isWishlisted: (productId) => get().items.some(item => item.id === productId),
    }),
    {
      name: 'ybtc-wishlist-storage',
    }
  )
);
