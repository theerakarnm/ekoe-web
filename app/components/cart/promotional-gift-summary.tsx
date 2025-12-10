import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { Gift, Sparkles } from "lucide-react";

interface PromotionalGiftSummaryProps {
  totalGifts: number;
  totalGiftValue: number;
  giftsByPromotion: Record<string, {
    count: number;
    value: number;
    items: Array<{
      productId: string;
      variantId?: string;
      quantity: number;
      giftValue?: number;
    }>;
  }>;
}

export function PromotionalGiftSummary({
  totalGifts,
  totalGiftValue,
  giftsByPromotion,
}: PromotionalGiftSummaryProps) {
  if (totalGifts === 0) {
    return null;
  }

  const promotionEntries = Object.entries(giftsByPromotion);

  return (
    <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-green-600" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-green-900">
            Free Gifts Included
          </h3>
          <p className="text-sm text-green-700">
            {totalGifts} free {totalGifts === 1 ? 'item' : 'items'} added to your cart
          </p>
        </div>

        {totalGiftValue > 0 && (
          <div className="text-right">
            <p className="text-lg font-bold text-green-600">
              ฿{(totalGiftValue / 100).toFixed(2)}
            </p>
            <p className="text-xs text-green-600">
              Total Value
            </p>
          </div>
        )}
      </div>

      {/* Promotion Breakdown */}
      {promotionEntries.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 border-b border-green-200 pb-1">
            Gift Breakdown
          </h4>
          
          {promotionEntries.map(([promotionId, summary]) => (
            <div key={promotionId} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">
                  {promotionId === 'unknown' ? 'Promotional Gifts' : `Promotion ${promotionId}`}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {summary.count} {summary.count === 1 ? 'item' : 'items'}
                </Badge>
              </div>
              
              {summary.value > 0 && (
                <span className="text-sm font-medium text-green-600">
                  ฿{(summary.value / 100).toFixed(2)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-4 pt-3 border-t border-green-200">
        <p className="text-xs text-green-700 flex items-center gap-1">
          <Gift className="w-3 h-3" />
          Free gifts are automatically managed and may be removed if cart conditions change.
        </p>
      </div>
    </Card>
  );
}