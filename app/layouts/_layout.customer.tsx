import { useEffect } from 'react';
import * as React from 'react';
import { Outlet } from 'react-router';
import { useAuthStore } from '../store/auth-store';

function CustomerAuthGuard({ children }: { children: React.ReactNode }) {
  const { checkAuth } = useAuthStore();
  const mounted = React.useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}

export default function CustomerLayout() {
  return (
    <main>
      <CustomerAuthGuard>
        <Outlet />
      </CustomerAuthGuard>
    </main>
  );
}
