import { Gift, Sparkles } from "lucide-react";
import { formatCurrencyFromCents } from "~/lib/formatter";
import type { FreeGift } from "~/store/cart";

interface FreeGiftDisplayProps {
  gifts: FreeGift[];
  className?: string;
}

export function FreeGiftDisplay({ gifts, className = "" }: FreeGiftDisplayProps) {
  if (gifts.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative">
          <Gift className="h-5 w-5 text-gray-700" />
          <Sparkles className="h-3 w-3 text-amber-500 absolute -top-1 -right-1" />
        </div>
        <h3 className="font-serif text-base font-medium">Free Gift{gifts.length > 1 ? 's' : ''} With Purchase</h3>
      </div>

      {/* Gift List */}
      <div className="space-y-3">
        {gifts.map((gift) => (
          <div
            key={gift.id}
            className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-md"
          >
            {/* Gift Image */}
            <div className="w-12 h-12 bg-white border border-gray-200 rounded shrink-0 overflow-hidden">
              {gift.imageUrl ? (
                <img
                  src={gift.imageUrl}
                  alt={gift.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Gift className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>

            {/* Gift Details */}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-900 truncate">
                {gift.name}
              </div>
              {gift.description && (
                <div className="text-xs text-gray-500 truncate">
                  {gift.description}
                </div>
              )}
              {gift.value > 0 && (
                <div className="text-xs text-gray-600 mt-0.5">
                  Value: {formatCurrencyFromCents(gift.value, { symbol: '฿' })}
                </div>
              )}
            </div>

            {/* Included Badge */}
            <div className="shrink-0">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Included
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          {gifts.length > 1 ? 'These gifts will' : 'This gift will'} be automatically added to your order
        </p>
      </div>
    </div>
  );
}
