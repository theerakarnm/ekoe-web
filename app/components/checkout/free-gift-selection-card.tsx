import { useState } from 'react';
import { Gift, Check, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';
import { formatCurrencyFromCents } from '~/lib/formatter';

export interface GiftOption {
  id: string;
  name: string;
  price?: number;
  imageUrl?: string;
  quantity: number;
  productId?: string;
}

interface FreeGiftSelectionCardProps {
  promotionId: string;
  promotionName: string;
  availableOptions: GiftOption[];
  selectionsRemaining: number;
  selectedOptionIds: string[];
  onSelect: (optionId: string) => void;
  onDeselect: (optionId: string) => void;
  cardIndex?: number;  // For showing "ของแถมที่ 1", "ของแถมที่ 2" etc.
}

export function FreeGiftSelectionCard({
  promotionId,
  promotionName,
  availableOptions,
  selectionsRemaining,
  selectedOptionIds,
  onSelect,
  onDeselect,
  cardIndex = 0,
}: FreeGiftSelectionCardProps) {
  const totalSelections = selectedOptionIds.length;
  const maxSelections = totalSelections + selectionsRemaining;
  const canSelectMore = selectionsRemaining > 0;

  const handleToggle = (optionId: string) => {
    if (selectedOptionIds.includes(optionId)) {
      onDeselect(optionId);
    } else if (canSelectMore) {
      onSelect(optionId);
    }
  };

  return (
    <Card className="border-gray-200 bg-linear-to-r from-gray-100 to-gray-50 mb-12">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white text-base">
          <div className="relative">
            <Gift className="w-5 h-5 text-gray-800" />
            <Sparkles className="w-3 h-3 text-black absolute -top-1 -right-1" />
          </div>
          <span className='text-gray-800'>
            {cardIndex > 0 ? `ของแถมที่ ${cardIndex + 1}` : 'เลือกของแถมฟรี'}
          </span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          {promotionName} • เลือก {maxSelections} จาก {availableOptions.length} รายการ
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Selection Status */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-600">
          <span className="text-sm text-gray-600">
            เลือกแล้ว {totalSelections} / {maxSelections}
          </span>
          {totalSelections === maxSelections && (
            <span className="text-xs bg-green-white text-green-400 px-2 py-1 rounded-full flex items-center gap-1">
              <Check className="w-3 h-3" />
              เลือกครบแล้ว
            </span>
          )}
        </div>

        {/* Gift Options Grid */}
        <div className="grid grid-cols-2 gap-3">
          {availableOptions.map((option) => {
            const isSelected = selectedOptionIds.includes(option.id);
            const isDisabled = !isSelected && !canSelectMore;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleToggle(option.id)}
                disabled={isDisabled}
                className={cn(
                  "relative flex flex-col items-center p-3 rounded-xl border-2 transition-all text-left",
                  isSelected
                    ? "border-white bg-gray-300"
                    : isDisabled
                      ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                      : "border-gray-200 bg-gray-50 hover:border-gray-200 hover:bg-gray-200"
                )}
              >
                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-gray-900" />
                  </div>
                )}

                {/* Gift Image */}
                <div className="w-16 h-16 mb-2 rounded-xl overflow-hidden bg-gray-700 border border-gray-200">
                  {option.imageUrl ? (
                    <img
                      src={option.imageUrl}
                      alt={option.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                      <Gift className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                </div>

                {/* Gift Info */}
                <span className="text-sm font-medium text-black text-center line-clamp-2">
                  {option.name}
                </span>

                {option.quantity > 1 && (
                  <span className="text-xs text-gray-600 mt-0.5">
                    จำนวน {option.quantity} ชิ้น
                  </span>
                )}

                {option.price && option.price > 0 && (
                  <span className="text-xs text-gray-300 font-medium mt-1">
                    มูลค่า {formatCurrencyFromCents(option.price, { symbol: '฿' })}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Incomplete Selection Warning */}
        {selectionsRemaining > 0 && (
          <div className="mt-4 p-2 bg-gray-700 rounded-lg text-center">
            <p className="text-xs text-gray-300">
              กรุณาเลือกของแถมอีก {selectionsRemaining} รายการ
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
