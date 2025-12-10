import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { Gift, Info } from "lucide-react";

interface PromotionalGiftItemProps {
  productId: string;
  variantId?: string;
  productName: string;
  variantName?: string;
  quantity: number;
  giftValue: number;
  promotionName?: string;
  imageUrl?: string;
  onInfoClick?: () => void;
}

export function PromotionalGiftItem({
  productId,
  variantId,
  productName,
  variantName,
  quantity,
  giftValue,
  promotionName,
  imageUrl,
  onInfoClick,
}: PromotionalGiftItemProps) {
  const displayName = variantName ? `${productName} - ${variantName}` : productName;

  return (
    <Card className="p-4 bg-green-50 border-green-200">
      <div className="flex items-center gap-4">
        {/* Gift Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Gift className="w-6 h-6 text-green-600" />
          </div>
        </div>

        {/* Product Image */}
        {imageUrl && (
          <div className="flex-shrink-0">
            <img
              src={imageUrl}
              alt={displayName}
              className="w-16 h-16 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
              <Gift className="w-3 h-3 mr-1" />
              FREE GIFT
            </Badge>
            {promotionName && (
              <Badge variant="outline" className="text-xs">
                {promotionName}
              </Badge>
            )}
          </div>
          
          <h3 className="font-medium text-gray-900 truncate">
            {displayName}
          </h3>
          
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span>Qty: {quantity}</span>
            {giftValue > 0 && (
              <span className="text-green-600 font-medium">
                Value: ฿{(giftValue / 100).toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Info Button */}
        {onInfoClick && (
          <button
            onClick={onInfoClick}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Gift information"
          >
            <Info className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Gift Notice */}
      <div className="mt-3 p-3 bg-green-100 rounded-lg">
        <p className="text-sm text-green-800">
          <Gift className="w-4 h-4 inline mr-1" />
          This item is automatically added as a free gift. It will be removed if cart conditions change.
        </p>
      </div>
    </Card>
  );
}