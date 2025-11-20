import { Outlet } from "react-router";
import type { Route } from "./+types/_layout";
import { AdminAuthGuard } from "~/components/admin/auth/admin-auth-guard";

export async function loader(_args: Route.LoaderArgs) {
  // Check authentication on server side
  // For now, we'll handle this on client side with the store
  // In production, this should validate session from cookies/headers
  return null;
}

export default function AdminLayout() {
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Admin layout structure will be enhanced in later tasks */}
        <div className="flex">
          {/* Sidebar placeholder */}
          <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
            <div className="p-4">
              <h2 className="text-xl font-bold">Admin Portal</h2>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <div className="p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
