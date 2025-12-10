import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { 
  CheckCircle, 
  Gift, 
  Percent, 
  Eye,
  Calendar,
  TrendingDown,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { cn } from "~/lib/utils";
import { useState } from "react";

interface OrderPromotionTrackingProps {
  orderId: string;
  orderDate: string;
  appliedPromotions: Array<{
    promotionId: string;
    promotionName: string;
    discountAmount: number;
    freeGifts: Array<{
      quantity: number;
      name: string;
      value: number;
    }>;
    appliedAt: string;
  }>;
  totalSavings: number;
  orderTotal: number;
  compact?: boolean;
  showDetails?: boolean;
  onViewOrder?: () => void;
  className?: string;
}

export function OrderPromotionTracking({
  orderId,
  orderDate,
  appliedPromotions,
  totalSavings,
  orderTotal,
  compact = false,
  showDetails = false,
  onViewOrder,
  className,
}: OrderPromotionTrackingProps) {
  const [isExpanded, setIsExpanded] = useState(showDetails);

  if (appliedPromotions.length === 0) {
    return null;
  }

  const savingsPercentage = orderTotal > 0 ? (totalSavings / orderTotal) * 100 : 0;
  const totalGifts = appliedPromotions.reduce((sum, promo) => sum + promo.freeGifts.length, 0);

  if (compact) {
    return (
      <div className={cn(
        "bg-green-50 border border-green-200 rounded-lg p-3",
        className
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <div>
              <span className="text-sm font-medium text-green-800">
                {appliedPromotions.length} promotion{appliedPromotions.length > 1 ? 's' : ''} applied
              </span>
              {totalGifts > 0 && (
                <span className="text-xs text-green-600 ml-2">
                  + {totalGifts} free gift{totalGifts > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-green-600">
              ฿{(totalSavings / 100).toFixed(2)} saved
            </div>
            {savingsPercentage > 0 && (
              <div className="text-xs text-green-600">
                {savingsPercentage.toFixed(1)}% off
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-green-50 border border-green-200 rounded-lg overflow-hidden",
      className
    )}>
      {/* Header */}
      <div className="p-4 bg-green-100 border-b border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-green-700" />
            </div>
            <div>
              <h4 className="font-semibold text-green-900">
                Promotions Applied
              </h4>
              <div className="flex items-center gap-2 text-sm text-green-700">
                <Calendar className="w-3 h-3" />
                <span>{new Date(orderDate).toLocaleDateString()}</span>
                <span>•</span>
                <span>Order #{orderId.slice(-8)}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-lg font-bold text-green-700">
              ฿{(totalSavings / 100).toFixed(2)}
            </div>
            <div className="text-xs text-green-600">
              Total Savings
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 mt-3">
          <Badge variant="secondary" className="bg-green-200 text-green-800 text-xs">
            {appliedPromotions.length} Promotion{appliedPromotions.length > 1 ? 's' : ''}
          </Badge>
          {totalGifts > 0 && (
            <Badge variant="secondary" className="bg-green-200 text-green-800 text-xs">
              {totalGifts} Free Gift{totalGifts > 1 ? 's' : ''}
            </Badge>
          )}
          {savingsPercentage > 0 && (
            <Badge variant="secondary" className="bg-green-200 text-green-800 text-xs">
              {savingsPercentage.toFixed(1)}% Saved
            </Badge>
          )}
        </div>
      </div>

      {/* Expandable Details */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">
            Promotion Details
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 px-2 text-xs"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3 h-3 mr-1" />
                Hide
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3 mr-1" />
                Show
              </>
            )}
          </Button>
        </div>

        {isExpanded && (
          <div className="space-y-3">
            {appliedPromotions.map((promotion) => (
              <div key={promotion.promotionId} className="bg-white rounded-lg p-3 border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {promotion.promotionName}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    Applied {new Date(promotion.appliedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-1 text-sm">
                  {promotion.discountAmount > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Percent className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">Discount:</span>
                      </div>
                      <span className="font-medium text-green-600">
                        -฿{(promotion.discountAmount / 100).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {promotion.freeGifts.map((gift, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">
                          {gift.quantity}x {gift.name}:
                        </span>
                      </div>
                      <span className="font-medium text-green-600">
                        ฿{(gift.value / 100).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Action Buttons */}
            {onViewOrder && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onViewOrder}
                  className="text-xs"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View Full Order
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Summary when collapsed */}
        {!isExpanded && (
          <div className="text-sm text-gray-600">
            <div className="flex justify-between items-center">
              <span>
                {appliedPromotions.map(p => p.promotionName).join(', ')}
              </span>
              <span className="font-medium text-green-600">
                ฿{(totalSavings / 100).toFixed(2)} saved
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}