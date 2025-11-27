import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authClient } from '../lib/auth-client';

interface CustomerUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image?: string | null;
}

interface CustomerProfile {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  dateOfBirth: Date | null;
  newsletterSubscribed: boolean;
  smsSubscribed: boolean;
  language: string;
  totalOrders: number;
  totalSpent: number;
  customerTier: string;
  loyaltyPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CustomerAuthState {
  user: CustomerUser | null;
  profile: CustomerProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isEmailVerified: boolean;
  
  // Authentication actions
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  
  // Profile actions
  loadProfile: () => Promise<void>;
  updateProfile: (data: Partial<CustomerProfile>) => Promise<void>;
  
  // Password reset actions
  sendVerificationEmail: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const useCustomerAuthStore = create<CustomerAuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: true,
      isEmailVerified: false,

      signUp: async (email: string, password: string, name: string) => {
        try {
          const { data, error } = await authClient.signUp.email({
            email,
            password,
            name,
          });

          if (error) {
            throw new Error(error.message || 'Registration failed');
          }

          if (!data) {
            throw new Error('Registration failed: No data returned');
          }

          // After signup, get the session to update state
          const session = await authClient.getSession();
          
          if (session.data) {
            set({
              user: {
                id: session.data.user.id,
                email: session.data.user.email,
                name: session.data.user.name || name,
                emailVerified: session.data.user.emailVerified || false,
                image: session.data.user.image,
              },
              isAuthenticated: true,
              isEmailVerified: session.data.user.emailVerified || false,
            });

            // Load profile after successful signup
            await get().loadProfile();
          }
        } catch (error) {
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isEmailVerified: false,
          });
          throw error;
        }
      },

      signIn: async (email: string, password: string) => {
        try {
          const { data, error } = await authClient.signIn.email({
            email,
            password,
          });

          if (error) {
            throw new Error(error.message || 'Authentication failed');
          }

          if (!data) {
            throw new Error('Authentication failed: No data returned');
          }

          const session = await authClient.getSession();

          if (session.data) {
            set({
              user: {
                id: session.data.user.id,
                email: session.data.user.email,
                name: session.data.user.name || 'Customer',
                emailVerified: session.data.user.emailVerified || false,
                image: session.data.user.image,
              },
              isAuthenticated: true,
              isEmailVerified: session.data.user.emailVerified || false,
            });

            // Load profile after successful login
            await get().loadProfile();
          }
        } catch (error) {
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isEmailVerified: false,
          });
          throw error;
        }
      },

      signInWithGoogle: async () => {
        try {
          // Initiate Google OAuth flow
          // better-auth will handle the redirect and callback
          await authClient.signIn.social({
            provider: 'google',
            callbackURL: `${window.location.origin}/auth/callback`,
          });
        } catch (error) {
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isEmailVerified: false,
          });
          throw error;
        }
      },

      signOut: async () => {
        try {
          await authClient.signOut();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isEmailVerified: false,
          });
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const { data } = await authClient.getSession();

          if (!data) {
            set({ 
              user: null, 
              profile: null,
              isAuthenticated: false, 
              isEmailVerified: false,
              isLoading: false 
            });
            return;
          }

          set({
            user: {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name || 'Customer',
              emailVerified: data.user.emailVerified || false,
              image: data.user.image,
            },
            isAuthenticated: true,
            isEmailVerified: data.user.emailVerified || false,
            isLoading: false,
          });

          // Load profile after auth check
          await get().loadProfile();
        } catch (error) {
          console.error('Auth check error:', error);
          set({ 
            user: null, 
            profile: null,
            isAuthenticated: false, 
            isEmailVerified: false,
            isLoading: false 
          });
        }
      },

      loadProfile: async () => {
        try {
          const state = get();
          if (!state.isAuthenticated || !state.user) {
            return;
          }

          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/customers/me`, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to load profile');
          }

          const result = await response.json();
          
          set({
            profile: result.data,
          });
        } catch (error) {
          console.error('Load profile error:', error);
          // Don't throw - profile loading is optional
        }
      },

      updateProfile: async (data: Partial<CustomerProfile>) => {
        try {
          const state = get();
          if (!state.isAuthenticated || !state.user) {
            throw new Error('Not authenticated');
          }

          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/customers/me`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            throw new Error('Failed to update profile');
          }

          const result = await response.json();
          
          set({
            profile: result.data,
          });
        } catch (error) {
          console.error('Update profile error:', error);
          throw error;
        }
      },

      sendVerificationEmail: async () => {
        try {
          const state = get();
          if (!state.user) {
            throw new Error('Not authenticated');
          }

          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/send-verification-email`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to send verification email');
          }
        } catch (error) {
          console.error('Send verification email error:', error);
          throw error;
        }
      },

      resetPassword: async (email: string) => {
        try {
          // Request password reset - better-auth will send email with reset link
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forget-password`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              redirectTo: `${window.location.origin}/auth/reset-password-confirm`,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to request password reset');
          }
        } catch (error) {
          console.error('Reset password error:', error);
          throw error;
        }
      },
    }),
    {
      name: 'customer-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
        isEmailVerified: state.isEmailVerified,
      }),
    }
  )
);
