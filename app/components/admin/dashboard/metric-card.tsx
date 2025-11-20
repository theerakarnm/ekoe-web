import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down';
  };
  icon: React.ReactNode;
}

export function MetricCard({ title, value, change, icon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="text-muted-foreground">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-2xl font-bold">{value}</div>
          {change && (
            <div className="flex items-center gap-1 text-sm">
              {change.trend === 'up' ? (
                <ArrowUp className="h-4 w-4 text-green-600" aria-label="Increased" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-600" aria-label="Decreased" />
              )}
              <span
                className={
                  change.trend === 'up' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'
                }
              >
                {change.trend === 'up' ? '+' : '-'}{Math.abs(change.value)}%
              </span>
              <span className="text-muted-foreground">from last period</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
