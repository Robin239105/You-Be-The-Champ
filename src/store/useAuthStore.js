import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', { email, password });
          if (response.data.success) {
            const { accessToken, refreshToken, ...userData } = response.data.data;
            set({ 
              user: userData, 
              token: accessToken, 
              isAuthenticated: true,
              isLoading: false 
            });
            return { success: true, user: userData };
          }
          set({ isLoading: false });
          return { success: false, message: response.data.message || 'Login failed' };
        } catch (error) {
          const message = error.response?.data?.message || 'Invalid email or password';
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/register', userData);
          if (response.data.success) {
            const { accessToken, ...createdUser } = response.data.data;
            set({ 
              user: createdUser, 
              token: accessToken, 
              isAuthenticated: true,
              isLoading: false 
            });
            return { success: true };
          }
        } catch (error) {
          const message = error.response?.data?.message || 'Registration failed';
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },
      
      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          error: null
        });
      },
      
      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      })),

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
    }
  )
);
