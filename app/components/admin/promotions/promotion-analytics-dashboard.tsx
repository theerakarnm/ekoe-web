import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Percent
} from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { Calendar as CalendarComponent } from '~/components/ui/calendar';
import type { DateRange } from 'react-day-picker';
import { toast } from '~/lib/admin/toast';
import { cn } from '~/lib/utils';
import {
  getPromotionAnalytics,
  getPromotionStats,
  exportPromotionAnalytics,
  type PromotionAnalytics,
  type PromotionUsageStats
} from '~/lib/services/admin/promotion-admin.service';

interface PromotionAnalyticsDashboardProps {
  promotionId: string;
  promotionName: string;
}

export function PromotionAnalyticsDashboard({ 
  promotionId, 
  promotionName 
}: PromotionAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<PromotionAnalytics[]>([]);
  const [stats, setStats] = useState<PromotionUsageStats | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date()
  });
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    loadAnalytics();
  }, [promotionId, dateRange]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const [analyticsData, statsData] = await Promise.all([
        getPromotionAnalytics(
          promotionId,
          dateRange?.from?.toISOString().split('T')[0],
          dateRange?.to?.toISOString().split('T')[0]
        ),
        getPromotionStats(promotionId)
      ]);

      setAnalytics(analyticsData.analytics);
      setSummary(analyticsData.summary);
      setStats(statsData);
    } catch (error) {
      toast.error(`Failed to load analytics: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
    const now = new Date();
    let from: Date;

    switch (newPeriod) {
      case '7d':
        from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        return;
    }

    setDateRange({ from, to: now });
  };

  const handleExport = async () => {
    try {
      const blob = await exportPromotionAnalytics(
        promotionId,
        dateRange?.from?.toISOString().split('T')[0],
        dateRange?.to?.toISOString().split('T')[0]
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `promotion-${promotionId}-analytics.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Analytics exported successfully');
    } catch (error) {
      toast.error(`Failed to export analytics: ${(error as Error).message}`);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'revenue':
        return <DollarSign className="h-4 w-4" />;
      case 'orders':
        return <ShoppingCart className="h-4 w-4" />;
      case 'customers':
        return <Users className="h-4 w-4" />;
      case 'conversion':
        return <Percent className="h-4 w-4" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getMetricTrend = (current: number, previous: number) => {
    if (previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change),
      isPositive: change > 0
    };
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const chartData = analytics.map(day => ({
    date: formatDate(day.date),
    applications: day.applications,
    revenue: day.totalRevenue / 100,
    discount: day.totalDiscountAmount / 100,
    orders: day.totalOrders,
    conversionRate: day.views > 0 ? (day.applications / day.views) * 100 : 0
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{promotionName} Analytics</h2>
          <p className="text-muted-foreground">
            Performance metrics and insights
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-60 justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {dateRange.from.toLocaleDateString()} -{' '}
                      {dateRange.to.toLocaleDateString()}
                    </>
                  ) : (
                    dateRange.from.toLocaleDateString()
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            {getMetricIcon('revenue')}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary?.totalRevenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary?.totalOrders || 0} orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Discount</CardTitle>
            {getMetricIcon('orders')}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary?.totalDiscountAmount || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary?.totalApplications || 0} applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            {getMetricIcon('conversion')}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.conversionRate?.toFixed(2) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {summary?.totalViews || 0} views
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            {getMetricIcon('revenue')}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.roi?.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Return on investment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Discount Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Discount</CardTitle>
            <CardDescription>
              Daily revenue generated and discounts given
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'revenue' || name === 'discount' 
                      ? formatCurrency(value * 100) 
                      : value,
                    name === 'revenue' ? 'Revenue' : 'Discount'
                  ]}
                />
                <Bar dataKey="revenue" fill="#10b981" name="revenue" />
                <Bar dataKey="discount" fill="#f59e0b" name="discount" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Applications & Conversion Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Applications & Conversion</CardTitle>
            <CardDescription>
              Daily promotion applications and conversion rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'conversionRate' ? `${value.toFixed(2)}%` : value,
                    name === 'applications' ? 'Applications' : 'Conversion Rate'
                  ]}
                />
                <Bar yAxisId="left" dataKey="applications" fill="#3b82f6" name="applications" />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="conversionRate" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="conversionRate"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      {stats?.topCustomers && stats.topCustomers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>
              Customers who used this promotion the most
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topCustomers.slice(0, 5).map((customer, index) => (
                <div key={customer.customerId} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <div>
                      <p className="font-medium">Customer {customer.customerId.slice(-8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {customer.usageCount} uses
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(customer.totalDiscount)}</p>
                    <p className="text-sm text-muted-foreground">Total savings</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}