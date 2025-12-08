import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '~/store/auth-store';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user, checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    // Check authentication status on mount
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isLoading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/auth/login', { replace: true });
      return;
    }

    // Check if user has admin role - redirect non-admins to landing page
    if (user?.role !== 'admin') {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, navigate, isLoading]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Don't render children until authentication is verified
  if (!isAuthenticated || !user || user.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}

