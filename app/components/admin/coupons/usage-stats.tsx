import { useEffect, useState } from 'react';
import { Users, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { getCouponUsageStats, type CouponUsageStats } from '~/lib/services/admin/coupon-admin.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';

interface UsageStatsProps {
  couponId: string;
  couponCode: string;
}

export function UsageStats({ couponId, couponCode }: UsageStatsProps) {
  const [stats, setStats] = useState<CouponUsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getCouponUsageStats(couponId);
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch coupon usage stats:', err);
        setError('Failed to load usage statistics');
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [couponId]);

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usage Statistics</CardTitle>
          <CardDescription>Loading statistics for {couponCode}...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usage Statistics</CardTitle>
          <CardDescription>Statistics for {couponCode}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {error || 'No statistics available'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Statistics</CardTitle>
        <CardDescription>Performance metrics for {couponCode}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Uses */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShoppingCart className="size-4" />
              <span>Total Uses</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalUses.toLocaleString()}</p>
          </div>

          {/* Unique Customers */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="size-4" />
              <span>Unique Customers</span>
            </div>
            <p className="text-2xl font-bold">{stats.uniqueCustomers.toLocaleString()}</p>
          </div>

          {/* Total Discount Amount */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="size-4" />
              <span>Total Discount</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(stats.totalDiscountAmount)}</p>
          </div>

          {/* Average Order Value */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="size-4" />
              <span>Avg Order Value</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(stats.averageOrderValue)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
