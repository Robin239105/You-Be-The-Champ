import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      discountAmount: 0,
      isOpen: false,
      
      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.id === product.id);
        const qtyToAdd = product.quantity || 1;
        // Normalize price/salePrice to Number (Prisma Decimal arrives as string)
        const normalized = {
          ...product,
          price: Number(product.price || 0),
          salePrice: product.salePrice ? Number(product.salePrice) : null,
        };
        
        if (existingItem) {
          set({
            items: currentItems.map(item =>
              item.id === product.id ? { ...item, quantity: item.quantity + qtyToAdd } : item
            ),
            isOpen: true // Auto-open cart when item is added
          });
        } else {
          set({ 
            items: [...currentItems, { ...normalized, quantity: qtyToAdd }],
            isOpen: true // Auto-open cart when item is added
          });
        }
      },
      addItemWithoutCart: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.id === product.id);
        const qtyToAdd = product.quantity || 1;
        // Normalize price/salePrice to Number (Prisma Decimal arrives as string)
        const normalized = {
          ...product,
          price: Number(product.price || 0),
          salePrice: product.salePrice ? Number(product.salePrice) : null,
        };
        
        if (existingItem) {
          set({
            items: currentItems.map(item =>
              item.id === product.id ? { ...item, quantity: item.quantity + qtyToAdd } : item
            )
            // Note: NOT setting isOpen: true here
          });
        } else {
          set({ 
            items: [...currentItems, { ...normalized, quantity: qtyToAdd }]
            // Note: NOT setting isOpen: true here
          });
        }
      },
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      removeItem: (productId) => set({
        items: get().items.filter(item => item.id !== productId)
      }),
      updateQty: (productId, quantity) => set({
        items: get().items.map(item =>
          item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      }),
      clearCart: () => set({ items: [], appliedCoupon: null, discountAmount: 0 }),
      getTotal: () => get().items.reduce((total, item) => total + (Number(item.price) * item.quantity), 0),
      getItemCount: () => get().items.reduce((count, item) => count + item.quantity, 0),
      
      // Coupon methods
      setAppliedCoupon: (coupon, discount) => set({ appliedCoupon: coupon, discountAmount: discount }),
      removeCoupon: () => set({ appliedCoupon: null, discountAmount: 0 }),
    }),
    {
      name: 'ybtc-cart-storage',
    }
  )
);
