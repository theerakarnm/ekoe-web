import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

export interface OrderStatusChartProps {
  data: {
    status: string;
    count: number;
  }[];
}

// Color palette for different order statuses
const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b', // amber
  processing: '#3b82f6', // blue
  shipped: '#8b5cf6', // purple
  delivered: '#10b981', // green
  cancelled: '#ef4444', // red
  refunded: '#6b7280', // gray
};

export function OrderStatusChart({ data }: OrderStatusChartProps) {
  // Transform data for chart
  const chartData = data?.map((item) => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    value: item.count,
    color: STATUS_COLORS[item.status] || '#6b7280',
  }));

  // Calculate total for percentage display
  const total = data?.reduce((sum, item) => sum + item.count, 0);

  // Custom label renderer
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    if (percent < 0.05) return null; // Don't show label if less than 5%

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Show loading state if no data
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <p>No order data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [
                `${value} orders (${((value / total) * 100).toFixed(1)}%)`,
                '',
              ]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value, entry: any) => (
                <span className="text-sm text-muted-foreground">
                  {value} ({entry.payload.value})
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
