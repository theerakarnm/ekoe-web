import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const baseUrl = import.meta.env.VITE_API_URL;

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminAuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await fetch(baseUrl + '/api/auth/sign-in/email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
            }),
            credentials: 'include',
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Authentication failed');
          }

          const data = await response.json();

          // Check if user has admin role
          if (data.user.role !== 'admin') {
            throw new Error('Unauthorized: Admin access required');
          }

          set({
            user: {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name || 'Admin User',
              role: data.user.role,
            },
            isAuthenticated: true,
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await fetch(baseUrl + '/api/auth/sign-out', {
            method: 'POST',
            credentials: 'include',
          });
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },

      checkAuth: async () => {
        try {
          const response = await fetch(baseUrl + '/api/auth/get-session', {
            method: 'GET',
            credentials: 'include',
          });

          if (!response.ok) {
            set({ user: null, isAuthenticated: false });
            return;
          }

          const data = await response.json();

          if (data.user && data.user.role === 'admin') {
            set({
              user: {
                id: data.user.id,
                email: data.user.email,
                name: data.user.name || 'Admin User',
                role: data.user.role,
              },
              isAuthenticated: true,
            });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        } catch (error) {
          console.error('Auth check error:', error);
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'admin-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
