import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAdminAuthStore } from '~/store/admin-auth';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user, checkAuth } = useAdminAuthStore();

  useEffect(() => {
    // Check authentication status on mount
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/admin/login', { replace: true });
      return;
    }

    // Check if user has admin role
    if (user && user.role !== 'admin') {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Don't render children until authentication is verified
  if (!isAuthenticated || !user || user.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}
