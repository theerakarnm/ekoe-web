import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuthStore } from '~/store/auth-store';
import { useCartStore } from '~/store/cart';
import { setReturnUrl } from '~/lib/auth-utils';
import { saveCartBackup } from '~/lib/cart-utils';

interface CustomerAuthGuardProps {
  children: React.ReactNode;
}

export function CustomerAuthGuard({ children }: CustomerAuthGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, checkAuth, isLoading } = useAuthStore();
  const { items: cartItems } = useCartStore();

  useEffect(() => {
    // Check authentication status on mount
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isLoading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      // Save cart state before redirect
      if (cartItems.length > 0) {
        saveCartBackup(cartItems);
      }

      // Save current URL as return URL
      const returnUrl = `${location.pathname}${location.search}`;
      setReturnUrl(returnUrl);
      navigate(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`, { replace: true });
    }
  }, [isAuthenticated, navigate, location, isLoading, cartItems]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Don't render children until authentication is verified
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
