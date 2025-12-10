import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { 
  Gift, 
  Percent, 
  Calculator, 
  ShoppingCart,
  CheckCircle,
  Info,
  Sparkles,
  TrendingDown
} from "lucide-react";
import { cn } from "~/lib/utils";

interface PromotionBenefitExplanationProps {
  promotion: {
    id: string;
    name: string;
    type: 'percentage_discount' | 'fixed_discount' | 'free_gift';
    discountValue?: number;
    maxDiscountAmount?: number;
  };
  cartValue: number;
  calculatedDiscount?: number;
  freeGifts?: Array<{
    name: string;
    quantity: number;
    value: number;
    imageUrl?: string;
  }>;
  savings: {
    discountSavings: number;
    giftValue: number;
    totalSavings: number;
  };
  explanation?: string;
  showCalculation?: boolean;
  className?: string;
}

export function PromotionBenefitExplanation({
  promotion,
  cartValue,
  calculatedDiscount = 0,
  freeGifts = [],
  savings,
  explanation,
  showCalculation = true,
  className,
}: PromotionBenefitExplanationProps) {
  const getPromotionIcon = () => {
    switch (promotion.type) {
      case 'percentage_discount':
      case 'fixed_discount':
        return <Percent className="w-5 h-5" />;
      case 'free_gift':
        return <Gift className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getPromotionTypeText = () => {
    switch (promotion.type) {
      case 'percentage_discount':
        return `${promotion.discountValue}% Discount`;
      case 'fixed_discount':
        return `฿${(promotion.discountValue! / 100).toFixed(2)} Off`;
      case 'free_gift':
        return 'Free Gift Promotion';
      default:
        return 'Special Promotion';
    }
  };

  const getCalculationExplanation = () => {
    switch (promotion.type) {
      case 'percentage_discount':
        const baseDiscount = (cartValue * (promotion.discountValue! / 100));
        const actualDiscount = promotion.maxDiscountAmount 
          ? Math.min(baseDiscount, promotion.maxDiscountAmount)
          : baseDiscount;
        
        return (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Cart Value:</span>
              <span>฿{(cartValue / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount Rate:</span>
              <span>{promotion.discountValue}%</span>
            </div>
            <div className="flex justify-between">
              <span>Base Discount:</span>
              <span>฿{(baseDiscount / 100).toFixed(2)}</span>
            </div>
            {promotion.maxDiscountAmount && baseDiscount > promotion.maxDiscountAmount && (
              <div className="flex justify-between text-orange-600">
                <span>Maximum Cap:</span>
                <span>฿{(promotion.maxDiscountAmount / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Final Discount:</span>
              <span className="text-green-600">-฿{(actualDiscount / 100).toFixed(2)}</span>
            </div>
          </div>
        );

      case 'fixed_discount':
        const fixedDiscount = Math.min(promotion.discountValue!, cartValue);
        return (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Cart Value:</span>
              <span>฿{(cartValue / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Fixed Discount:</span>
              <span>฿{(promotion.discountValue! / 100).toFixed(2)}</span>
            </div>
            {fixedDiscount < promotion.discountValue! && (
              <div className="flex justify-between text-orange-600">
                <span>Capped at Cart Value:</span>
                <span>฿{(fixedDiscount / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Final Discount:</span>
              <span className="text-green-600">-฿{(fixedDiscount / 100).toFixed(2)}</span>
            </div>
          </div>
        );

      case 'free_gift':
        return (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Cart Value:</span>
              <span>฿{(cartValue / 100).toFixed(2)}</span>
            </div>
            <div className="space-y-1">
              <span className="font-medium">Free Gifts Awarded:</span>
              {freeGifts.map((gift, index) => (
                <div key={index} className="flex justify-between ml-4">
                  <span>{gift.quantity}x {gift.name}</span>
                  <span className="text-green-600">฿{(gift.value / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total Gift Value:</span>
              <span className="text-green-600">฿{(savings.giftValue / 100).toFixed(2)}</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={cn("border-green-200 bg-gradient-to-r from-green-50 to-emerald-50", className)}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            {getPromotionIcon()}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="default" className="bg-green-600 text-white text-xs">
                {getPromotionTypeText()}
              </Badge>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="font-semibold text-green-900">
              {promotion.name}
            </h3>
          </div>

          <div className="text-right">
            <p className="text-lg font-bold text-green-600">
              ฿{(savings.totalSavings / 100).toFixed(2)}
            </p>
            <p className="text-xs text-green-600">
              Total Savings
            </p>
          </div>
        </div>

        {/* Explanation Text */}
        {explanation && (
          <div className="mb-4 p-3 bg-white rounded-lg border border-green-100">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              <p className="text-sm text-gray-700">{explanation}</p>
            </div>
          </div>
        )}

        {/* Calculation Breakdown */}
        {showCalculation && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-4 h-4 text-green-600" />
              <h4 className="text-sm font-medium text-gray-700">How your savings are calculated:</h4>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-green-100">
              {getCalculationExplanation()}
            </div>
          </div>
        )}

        {/* Savings Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-green-600" />
            Your Savings Breakdown:
          </h4>

          <div className="space-y-2 text-sm">
            {savings.discountSavings > 0 && (
              <div className="flex items-center justify-between bg-white rounded-lg p-2 border border-green-100">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-green-600" />
                  <span>Discount Savings:</span>
                </div>
                <span className="font-medium text-green-600">
                  -฿{(savings.discountSavings / 100).toFixed(2)}
                </span>
              </div>
            )}

            {savings.giftValue > 0 && (
              <div className="flex items-center justify-between bg-white rounded-lg p-2 border border-green-100">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-green-600" />
                  <span>Free Gift Value:</span>
                </div>
                <span className="font-medium text-green-600">
                  ฿{(savings.giftValue / 100).toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between bg-green-100 rounded-lg p-3 border border-green-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-700" />
                <span className="font-semibold text-green-800">Total Benefit:</span>
              </div>
              <span className="font-bold text-green-700 text-lg">
                ฿{(savings.totalSavings / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Free Gifts Display */}
        {freeGifts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-green-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Gift className="w-4 h-4 text-green-600" />
              Free Gifts Included:
            </h4>
            
            <div className="grid grid-cols-1 gap-2">
              {freeGifts.map((gift, index) => (
                <div key={index} className="flex items-center gap-3 bg-white rounded-lg p-2 border border-green-100">
                  {gift.imageUrl && (
                    <img 
                      src={gift.imageUrl} 
                      alt={gift.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {gift.quantity}x {gift.name}
                    </p>
                    <p className="text-xs text-green-600">
                      Value: ฿{(gift.value / 100).toFixed(2)}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                    FREE
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-green-200">
          <p className="text-xs text-green-700 text-center flex items-center justify-center gap-1">
            <CheckCircle className="w-3 h-3" />
            This promotion has been automatically applied to your cart
          </p>
        </div>
      </div>
    </Card>
  );
}