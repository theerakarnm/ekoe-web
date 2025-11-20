import { Outlet } from 'react-router';
import { AdminAuthGuard } from '~/components/admin/auth/admin-auth-guard';
import { AdminSidebar } from '~/components/admin/layout/admin-sidebar';
import { AdminHeader } from '~/components/admin/layout/admin-header';

export default function AdminLayout() {
  return (
    <AdminAuthGuard>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <AdminHeader />
          
          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
