import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';
import { signInWithGoogle, signUpWithGoogle } from '../utils/firebase';

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

      clearError: () => set({ error: null }),

      loginWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
          const result = await signInWithGoogle();
          if (result.success) {
            const { user: googleUser } = result;
            
            const response = await api.post('/auth/google-login', {
              email: googleUser.email,
              uid: googleUser.uid,
              firstName: googleUser.firstName,
              lastName: googleUser.lastName,
              provider: 'google'
            });
            
            if (response.data.success) {
              const { accessToken, ...userData } = response.data.data;
              set({
                user: userData,
                token: accessToken,
                isAuthenticated: true,
                isLoading: false
              });
              return { success: true, user: userData };
            }
          }
          set({ isLoading: false });
          return { success: false, message: result.message || 'Google login failed' };
        } catch (error) {
          const message = error.response?.data?.message || 'Google login failed';
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      registerWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
          const result = await signUpWithGoogle();
          if (result.success) {
            const { user: googleUser } = result;
            
            const response = await api.post('/auth/register', {
              firstName: googleUser.firstName,
              lastName: googleUser.lastName,
              email: googleUser.email,
              password: googleUser.uid,
              provider: 'google'
            });
            
            if (response.data.success) {
              const { accessToken, ...userData } = response.data.data;
              set({
                user: userData,
                token: accessToken,
                isAuthenticated: true,
                isLoading: false
              });
              return { success: true };
            }
          }
          set({ isLoading: false });
          return { success: false, message: result.message || 'Google registration failed' };
        } catch (error) {
          const message = error.response?.data?.message || 'Google registration failed';
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);
