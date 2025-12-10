import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { CheckCircle, Gift, Percent, Info, X } from "lucide-react";
import { cn } from "~/lib/utils";

interface AppliedPromotion {
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

interface CartPromotionDisplayProps {
  appliedPromotions: AppliedPromotion[];
  totalDiscount: number;
  totalGiftValue?: number;
  onRemovePromotion?: (promotionId: string) => void;
  showRemoveButton?: boolean;
  className?: string;
}

export function CartPromotionDisplay({
  appliedPromotions,
  totalDiscount,
  totalGiftValue = 0,
  onRemovePromotion,
  showRemoveButton = false,
  className,
}: CartPromotionDisplayProps) {
  if (appliedPromotions.length === 0) {
    return null;
  }

  const totalSavings = totalDiscount + totalGiftValue;

  return (
    <Card className={cn("p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200", className)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="shrink-0">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-green-900">
            Promotions Applied
          </h3>
          <p className="text-sm text-green-700">
            You're saving ฿{(totalSavings / 100).toFixed(2)} with {appliedPromotions.length} promotion{appliedPromotions.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold text-green-600">
            -฿{(totalSavings / 100).toFixed(2)}
          </p>
          <p className="text-xs text-green-600">
            Total Savings
          </p>
        </div>
      </div>

      {/* Applied Promotions List */}
      <div className="space-y-3">
        {appliedPromotions.map((promotion) => (
          <div key={promotion.promotionId} className="bg-white rounded-lg p-3 border border-green-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                    {promotion.promotionName}
                  </Badge>
                  {showRemoveButton && onRemovePromotion && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemovePromotion(promotion.promotionId)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>

                {/* Discount Details */}
                {promotion.discountAmount > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Percent className="w-4 h-4 text-green-600" />
                    <span>Discount: -฿{(promotion.discountAmount / 100).toFixed(2)}</span>
                  </div>
                )}

                {/* Free Gifts */}
                {promotion.freeGifts.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Gift className="w-4 h-4 text-green-600" />
                      <span>Free Gifts:</span>
                    </div>
                    {promotion.freeGifts.map((gift, index) => (
                      <div key={`${gift.productId}-${gift.variantId || 'default'}-${index}`} className="ml-6 text-sm text-gray-600">
                        <div className="flex items-center justify-between">
                          <span>{gift.quantity}x {gift.name}</span>
                          <span className="text-green-600 font-medium">
                            ฿{(gift.value / 100).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Savings Breakdown */}
      {(totalDiscount > 0 || totalGiftValue > 0) && (
        <div className="mt-4 pt-3 border-t border-green-200">
          <div className="space-y-1 text-sm">
            {totalDiscount > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Discount Savings:</span>
                <span className="text-green-600 font-medium">-฿{(totalDiscount / 100).toFixed(2)}</span>
              </div>
            )}
            {totalGiftValue > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Free Gift Value:</span>
                <span className="text-green-600 font-medium">฿{(totalGiftValue / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-green-800 pt-1 border-t border-green-100">
              <span>Total Savings:</span>
              <span>฿{(totalSavings / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Info Note */}
      <div className="mt-3 pt-3 border-t border-green-200">
        <p className="text-xs text-green-700 flex items-center gap-1">
          <Info className="w-3 h-3" />
          Promotions are automatically applied and may change if cart contents are modified.
        </p>
      </div>
    </Card>
  );
}