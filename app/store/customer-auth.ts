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

interface CustomerAddress {
  id: string;
  userId: string;
  label: string | null;
  firstName: string;
  lastName: string;
  company: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CustomerAuthState {
  user: CustomerUser | null;
  profile: CustomerProfile | null;
  addresses: CustomerAddress[];
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
  
  // Address actions
  loadAddresses: () => Promise<void>;
  
  // Password reset actions
  sendVerificationEmail: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  
  // Session management
  handleSessionExpired: () => void;
}

export const useCustomerAuthStore = create<CustomerAuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      addresses: [],
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
            addresses: [],
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
            addresses: [],
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
            addresses: [],
            isAuthenticated: false,
            isEmailVerified: false,
          });
          throw error;
        }
      },

      signOut: async () => {
        try {
          // Sign out on server - this will clear the session and cookies
          await authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                // Clear all auth state
                set({
                  user: null,
                  profile: null,
                  addresses: [],
                  isAuthenticated: false,
                  isEmailVerified: false,
                });
                
                // Clear localStorage
                localStorage.removeItem('customer-auth-storage');
                
                // Redirect to home page
                window.location.href = '/';
              },
              onError: (ctx) => {
                console.error('Logout error:', ctx.error);
                // Still clear local state even if server logout fails
                set({
                  user: null,
                  profile: null,
                  addresses: [],
                  isAuthenticated: false,
                  isEmailVerified: false,
                });
                localStorage.removeItem('customer-auth-storage');
                window.location.href = '/';
              }
            }
          });
        } catch (error) {
          console.error('Logout error:', error);
          // Ensure state is cleared even on error
          set({
            user: null,
            profile: null,
            addresses: [],
            isAuthenticated: false,
            isEmailVerified: false,
          });
          localStorage.removeItem('customer-auth-storage');
          window.location.href = '/';
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const { data, error } = await authClient.getSession();

          // Handle session expiration or invalid session
          if (error || !data) {
            // Clear expired session state
            set({ 
              user: null, 
              profile: null,
              addresses: [],
              isAuthenticated: false, 
              isEmailVerified: false,
              isLoading: false 
            });
            
            // Clear localStorage
            localStorage.removeItem('customer-auth-storage');
            
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
          
          // Clear state on error (likely session expired)
          set({ 
            user: null, 
            profile: null,
            addresses: [],
            isAuthenticated: false, 
            isEmailVerified: false,
            isLoading: false 
          });
          
          // Clear localStorage
          localStorage.removeItem('customer-auth-storage');
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

          // Handle session expiration
          if (response.status === 401) {
            console.warn('Session expired while loading profile');
            get().handleSessionExpired();
            return;
          }

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

          // Handle session expiration
          if (response.status === 401) {
            console.warn('Session expired while updating profile');
            get().handleSessionExpired();
            throw new Error('Session expired');
          }

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

      loadAddresses: async () => {
        try {
          const state = get();
          if (!state.isAuthenticated || !state.user) {
            return;
          }

          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/customers/me/addresses`, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          // Handle session expiration
          if (response.status === 401) {
            console.warn('Session expired while loading addresses');
            get().handleSessionExpired();
            return;
          }

          if (!response.ok) {
            throw new Error('Failed to load addresses');
          }

          const result = await response.json();
          
          set({
            addresses: result.data,
          });
        } catch (error) {
          console.error('Load addresses error:', error);
          // Don't throw - address loading is optional
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

      handleSessionExpired: () => {
        // Clear all auth state
        set({
          user: null,
          profile: null,
          addresses: [],
          isAuthenticated: false,
          isEmailVerified: false,
        });

        // Clear localStorage
        localStorage.removeItem('customer-auth-storage');

        // Save current URL as return URL (if not already on auth page)
        const currentPath = window.location.pathname;
        const authRoutes = ['/auth/login', '/auth/register', '/auth/verify-email', '/auth/reset-password', '/auth/reset-password-confirm', '/auth/callback'];
        const isAuthRoute = authRoutes.some(route => currentPath.startsWith(route));
        
        if (!isAuthRoute && currentPath !== '/') {
          localStorage.setItem('auth_return_url', currentPath);
        }

        // Redirect to login page
        window.location.href = '/auth/login';
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
