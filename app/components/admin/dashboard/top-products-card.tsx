import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { TrendingUp, Package } from 'lucide-react';

export interface TopProductsCardProps {
  data?: Array<{
    id: string;
    name: string;
    soldCount: number;
    revenue: number;
    imageUrl?: string;
  }>;
}

export function TopProductsCard({ data }: TopProductsCardProps) {
  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value / 100); // Convert from cents to baht
  };

  // Show empty state if no data
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Top Products</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            <p>No product data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Top Products</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {index + 1}
                </span>
              </div>

              {/* Product Image or Icon */}
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-background border flex items-center justify-center overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="h-6 w-6 text-muted-foreground" />
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {product.soldCount} sold
                </p>
              </div>

              {/* Revenue */}
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-green-600">
                  {formatCurrency(product.revenue)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
