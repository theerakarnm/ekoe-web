import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { 
  CheckCircle, 
  Gift, 
  Percent, 
  Sparkles,
  TrendingDown,
  Tag
} from "lucide-react";
import { cn } from "~/lib/utils";

interface OrderPromotionItem {
  promotionId: string;
  promotionName: string;
  discountAmount: number;
  freeGifts: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
    name: string;
    imageUrl?: string;
    value: number;
  }>;
  appliedAt: string;
}

interface OrderPromotionDisplayProps {
  appliedPromotions: OrderPromotionItem[];
  totalDiscountAmount: number;
  totalGiftValue?: number;
  orderSubtotal: number;
  showSavingsPercentage?: boolean;
  className?: string;
}

export function OrderPromotionDisplay({
  appliedPromotions,
  totalDiscountAmount,
  totalGiftValue = 0,
  orderSubtotal,
  showSavingsPercentage = true,
  className,
}: OrderPromotionDisplayProps) {
  if (appliedPromotions.length === 0) {
    return null;
  }

  const totalSavings = totalDiscountAmount + totalGiftValue;
  const savingsPercentage = orderSubtotal > 0 ? (totalSavings / orderSubtotal) * 100 : 0;
  const totalGifts = appliedPromotions.reduce((sum, promo) => sum + promo.freeGifts.length, 0);

  return (
    <Card className={cn("border-green-200 bg-gradient-to-r from-green-50 to-emerald-50", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-900">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-green-600" />
          </div>
          Promotions Applied
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center bg-white rounded-lg p-3 border border-green-100">
            <div className="text-lg font-bold text-green-600">
              {appliedPromotions.length}
            </div>
            <div className="text-xs text-gray-600">
              Promotion{appliedPromotions.length > 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="text-center bg-white rounded-lg p-3 border border-green-100">
            <div className="text-lg font-bold text-green-600">
              ฿{(totalSavings / 100).toFixed(2)}
            </div>
            <div className="text-xs text-gray-600">
              Total Savings
            </div>
          </div>

          {totalGifts > 0 && (
            <div className="text-center bg-white rounded-lg p-3 border border-green-100">
              <div className="text-lg font-bold text-green-600">
                {totalGifts}
              </div>
              <div className="text-xs text-gray-600">
                Free Gift{totalGifts > 1 ? 's' : ''}
              </div>
            </div>
          )}

          {showSavingsPercentage && savingsPercentage > 0 && (
            <div className="text-center bg-white rounded-lg p-3 border border-green-100">
              <div className="text-lg font-bold text-green-600">
                {savingsPercentage.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-600">
                Savings Rate
              </div>
            </div>
          )}
        </div>

        <Separator className="bg-green-200" />

        {/* Individual Promotions */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Promotion Details:</h4>
          
          {appliedPromotions.map((promotion) => (
            <div key={promotion.promotionId} className="bg-white rounded-lg p-4 border border-green-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                      {promotion.promotionName}
                    </Badge>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-500">
                    Applied on {new Date(promotion.appliedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Benefits Breakdown */}
              <div className="space-y-2">
                {promotion.discountAmount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">Discount Applied:</span>
                    </div>
                    <span className="font-medium text-green-600">
                      -฿{(promotion.discountAmount / 100).toFixed(2)}
                    </span>
                  </div>
                )}

                {promotion.freeGifts.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Gift className="w-4 h-4 text-green-600" />
                      <span>Free Gifts Received:</span>
                    </div>
                    {promotion.freeGifts.map((gift, index) => (
                      <div key={`${gift.productId}-${gift.variantId || 'default'}-${index}`} 
                           className="ml-6 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {gift.imageUrl && (
                            <img 
                              src={gift.imageUrl} 
                              alt={gift.name}
                              className="w-6 h-6 object-cover rounded"
                            />
                          )}
                          <span className="text-gray-600">
                            {gift.quantity}x {gift.name}
                          </span>
                        </div>
                        <span className="text-green-600 font-medium text-xs">
                          ฿{(gift.value / 100).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <Separator className="bg-green-200" />

        {/* Total Savings Summary */}
        <div className="bg-green-100 rounded-lg p-4 border border-green-200">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-green-700" />
                <span className="text-green-800 font-medium">Your Total Savings:</span>
              </div>
            </div>

            {totalDiscountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-700">
                <span className="ml-6">Discount Savings:</span>
                <span>-฿{(totalDiscountAmount / 100).toFixed(2)}</span>
              </div>
            )}

            {totalGiftValue > 0 && (
              <div className="flex justify-between text-sm text-green-700">
                <span className="ml-6">Free Gift Value:</span>
                <span>฿{(totalGiftValue / 100).toFixed(2)}</span>
              </div>
            )}

            <Separator className="bg-green-300" />
            
            <div className="flex justify-between font-bold text-green-800">
              <span>Total Benefit:</span>
              <span className="text-lg">฿{(totalSavings / 100).toFixed(2)}</span>
            </div>

            {showSavingsPercentage && savingsPercentage > 0 && (
              <div className="text-center">
                <p className="text-xs text-green-700">
                  You saved {savingsPercentage.toFixed(1)}% on this order!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Thank You Message */}
        <div className="text-center pt-2">
          <p className="text-sm text-green-700 flex items-center justify-center gap-1">
            <Tag className="w-4 h-4" />
            Thank you for shopping with us! These promotions were automatically applied to give you the best value.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}