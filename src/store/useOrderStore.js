import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => set({ 
        orders: [
          { 
            ...order, 
            date: new Date().toLocaleDateString('en-AU', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            }),
            status: 'Processing Shipment',
            timestamp: Date.now()
          }, 
          ...get().orders 
        ] 
      }),
      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: 'ybtc-orders-storage',
    }
  )
);
