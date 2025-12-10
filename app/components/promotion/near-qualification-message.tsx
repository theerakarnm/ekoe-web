import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { 
  TrendingUp, 
  Gift, 
  Percent, 
  ShoppingCart, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { cn } from "~/lib/utils";

interface NearQualificationMessageProps {
  promotion: {
    id: string;
    name: string;
    type: 'percentage_discount' | 'fixed_discount' | 'free_gift';
    discountValue?: number;
    minCartValue: number;
  };
  currentCartValue: number;
  amountNeeded: number;
  progressPercentage: number;
  suggestedProducts?: Array<{
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  }>;
  onViewSuggestions?: () => void;
  onContinueShopping?: () => void;
  className?: string;
}

export function NearQualificationMessage({
  promotion,
  currentCartValue,
  amountNeeded,
  progressPercentage,
  suggestedProducts = [],
  onViewSuggestions,
  onContinueShopping,
  className,
}: NearQualificationMessageProps) {
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

  const getPromotionText = () => {
    switch (promotion.type) {
      case 'percentage_discount':
        return `${promotion.discountValue}% OFF`;
      case 'fixed_discount':
        return `฿${(promotion.discountValue! / 100).toFixed(0)} OFF`;
      case 'free_gift':
        return 'FREE GIFT';
      default:
        return 'SPECIAL OFFER';
    }
  };

  const getMotivationalText = () => {
    const percentage = Math.round(progressPercentage);
    
    if (percentage >= 90) {
      return "You're almost there! Just a little more to unlock this amazing offer.";
    } else if (percentage >= 70) {
      return "You're so close to earning this great deal!";
    } else if (percentage >= 50) {
      return "You're halfway to unlocking this promotion!";
    } else {
      return "Add a few more items to unlock this exclusive offer!";
    }
  };

  return (
    <Card className={cn(
      "border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 overflow-hidden",
      className
    )}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            {getPromotionIcon()}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs font-bold">
                {getPromotionText()}
              </Badge>
              <TrendingUp className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="font-semibold text-orange-900">
              {promotion.name}
            </h3>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Current: ฿{(currentCartValue / 100).toFixed(2)}
            </span>
            <span className="text-sm font-medium text-orange-700">
              Need: ฿{(amountNeeded / 100).toFixed(2)} more
            </span>
            <span className="text-sm text-gray-600">
              Goal: ฿{(promotion.minCartValue / 100).toFixed(2)}
            </span>
          </div>
          
          <Progress 
            value={progressPercentage} 
            className="h-3 bg-orange-100"
          />
          
          <div className="flex justify-center mt-2">
            <span className="text-xs text-orange-600 font-medium">
              {Math.round(progressPercentage)}% complete
            </span>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="mb-4">
          <p className="text-sm text-gray-700 text-center">
            {getMotivationalText()}
          </p>
        </div>

        {/* Suggested Products Preview */}
        {suggestedProducts.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Suggested items to reach your goal:
            </h4>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {suggestedProducts.slice(0, 3).map((product) => (
                <div key={product.id} className="shrink-0 bg-white rounded-lg p-2 border border-orange-100 min-w-[120px]">
                  {product.imageUrl && (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-16 object-cover rounded mb-1"
                    />
                  )}
                  <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                    {product.name}
                  </p>
                  <p className="text-xs font-medium text-orange-600">
                    ฿{(product.price / 100).toFixed(2)}
                  </p>
                </div>
              ))}
              {suggestedProducts.length > 3 && (
                <div className="shrink-0 bg-white rounded-lg p-2 border border-orange-100 min-w-[120px] flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">
                      +{suggestedProducts.length - 3} more
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onViewSuggestions}
                      className="h-6 px-2 text-xs"
                    >
                      View All
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {onContinueShopping && (
            <Button
              onClick={onContinueShopping}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          )}
          
          {onViewSuggestions && suggestedProducts.length > 0 && (
            <Button
              variant="outline"
              onClick={onViewSuggestions}
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
              size="sm"
            >
              View Suggestions
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Fine Print */}
        <div className="mt-3 pt-3 border-t border-orange-200">
          <p className="text-xs text-orange-700 text-center">
            Add ฿{(amountNeeded / 100).toFixed(2)} more to your cart to unlock {getPromotionText()}
          </p>
        </div>
      </div>
    </Card>
  );
}