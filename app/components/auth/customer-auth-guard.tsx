import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useCustomerAuthStore } from '~/store/customer-auth';

interface CustomerAuthGuardProps {
  children: React.ReactNode;
}

export function CustomerAuthGuard({ children }: CustomerAuthGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, checkAuth, isLoading } = useCustomerAuthStore();

  useEffect(() => {
    // Check authentication status on mount
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isLoading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      // Save current URL as return URL
      const returnUrl = `${location.pathname}${location.search}`;
      navigate(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`, { replace: true });
    }
  }, [isAuthenticated, navigate, location, isLoading]);

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
