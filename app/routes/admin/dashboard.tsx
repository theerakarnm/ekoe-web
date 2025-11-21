import { type LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { type DashboardMetrics, createAdminClient } from '~/lib/admin/api-client';
import { MetricCard } from '~/components/admin/dashboard/metric-card';
import { RevenueChart } from '~/components/admin/dashboard/revenue-chart';
import { OrderStatusChart } from '~/components/admin/dashboard/order-status-chart';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
} from 'lucide-react';
import { Suspense } from 'react';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const api = createAdminClient(request);
    const metrics = await api.getDashboardMetrics();

    console.log(metrics);


    return { metrics };
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error('Failed to load dashboard metrics:', error);
    throw new Response('Failed to load dashboard metrics', { status: 500 });
  }
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-xl border bg-card animate-pulse"
          />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="h-96 rounded-xl border bg-card animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { metrics } = useLoaderData<typeof loader>();

  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value / 100); // Convert from cents to baht
  };

  // Format number with commas
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('th-TH').format(value);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your e-commerce platform
        </p>
      </header>

      <Suspense fallback={<DashboardSkeleton />}>
        {/* Metric Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(metrics.totalRevenue)}
            icon={<DollarSign className="h-5 w-5" />}
          />
          <MetricCard
            title="Total Orders"
            value={formatNumber(metrics.totalOrders)}
            icon={<ShoppingCart className="h-5 w-5" />}
          />
          <MetricCard
            title="Total Customers"
            value={formatNumber(metrics.totalCustomers)}
            icon={<Users className="h-5 w-5" />}
          />
          <MetricCard
            title="Total Products"
            value={formatNumber(metrics.totalProducts)}
            icon={<Package className="h-5 w-5" />}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <RevenueChart data={metrics.revenueByDate} />
          <OrderStatusChart data={metrics.ordersByStatus} />
        </div>
      </Suspense>
    </div>
  );
}
