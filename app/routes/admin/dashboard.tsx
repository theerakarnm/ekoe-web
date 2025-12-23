import { type LoaderFunctionArgs } from 'react-router';
import { useLoaderData, useSearchParams, useNavigate } from 'react-router';
import { getDashboardMetrics } from '~/lib/services/admin/analytics-admin.service';
import { MetricCard } from '~/components/admin/dashboard/metric-card';
import { RevenueChart } from '~/components/admin/dashboard/revenue-chart';
import { OrderStatusChart } from '~/components/admin/dashboard/order-status-chart';
import { TopProductsCard } from '~/components/admin/dashboard/top-products-card';
import { DateRangePicker, getDefaultDateRange, type DateRange } from '~/components/admin/dashboard/date-range-picker';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Mail,
} from 'lucide-react';
import { Suspense, useCallback } from 'react';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    const params: { startDate?: string; endDate?: string } = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    console.log('[Dashboard Loader] Fetching metrics with params:', params);
    const metrics = await getDashboardMetrics(params, request.headers);
    console.log('[Dashboard Loader] Received metrics:', JSON.stringify(metrics).substring(0, 500));
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get current date range from URL or use default
  const getCurrentDateRange = useCallback((): DateRange => {
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const label = searchParams.get('label');

    if (startDate && endDate) {
      return {
        startDate,
        endDate,
        label: label || 'Custom range',
      };
    }

    return getDefaultDateRange();
  }, [searchParams]);

  // Handle date range change
  const handleDateRangeChange = useCallback((range: DateRange) => {
    const params = new URLSearchParams();
    params.set('startDate', range.startDate);
    params.set('endDate', range.endDate);
    params.set('label', range.label);
    navigate(`?${params.toString()}`, { replace: true });
  }, [navigate]);

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
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your e-commerce platform
          </p>
        </div>
        <DateRangePicker
          value={getCurrentDateRange()}
          onChange={handleDateRangeChange}
        />
      </header>

      <Suspense fallback={<DashboardSkeleton />}>
        {/* Metric Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(metrics.revenue?.total || 0)}
            change={
              metrics.revenue?.growth !== 0
                ? {
                  value: Math.abs(metrics.revenue?.growth || 0),
                  trend: metrics.revenue?.growth > 0 ? 'up' : 'down',
                }
                : undefined
            }
            icon={<DollarSign className="h-5 w-5" />}
          />
          <MetricCard
            title="Total Orders"
            value={formatNumber(metrics.orders?.total || 0)}
            change={
              metrics.orders?.growth !== 0
                ? {
                  value: Math.abs(metrics.orders?.growth || 0),
                  trend: metrics.orders?.growth > 0 ? 'up' : 'down',
                }
                : undefined
            }
            icon={<ShoppingCart className="h-5 w-5" />}
          />
          <MetricCard
            title="Total Customers"
            value={formatNumber(metrics.customers?.total || 0)}
            change={
              metrics.customers?.growth !== 0
                ? {
                  value: Math.abs(metrics.customers?.growth || 0),
                  trend: metrics.customers?.growth > 0 ? 'up' : 'down',
                }
                : undefined
            }
            icon={<Users className="h-5 w-5" />}
          />
          <MetricCard
            title="Average Order Value"
            value={formatCurrency(metrics.orders?.averageValue || 0)}
            icon={<Package className="h-5 w-5" />}
          />
          <MetricCard
            title="Unread Contacts"
            value={formatNumber(metrics.contacts?.unread || 0)}
            icon={<Mail className="h-5 w-5" />}
          />
        </div>

        {/* Charts and Top Products */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <RevenueChart data={metrics.revenue?.byDate || []} />
          <OrderStatusChart data={metrics.orders?.byStatus || []} />
          <TopProductsCard data={metrics.topProducts} />
        </div>
      </Suspense>
    </div>
  );
}
