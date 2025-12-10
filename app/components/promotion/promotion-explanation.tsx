import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { 
  CheckCircle, 
  XCircle, 
  Info, 
  Gift, 
  Percent, 
  ShoppingCart,
  Clock,
  Users,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { cn } from "~/lib/utils";
import { useState } from "react";

interface PromotionCondition {
  type: 'cart_value' | 'product_quantity' | 'specific_products' | 'category_products';
  description: string;
  isMet: boolean;
  currentValue?: string;
  requiredValue?: string;
}

interface PromotionExplanationProps {
  promotion: {
    id: string;
    name: string;
    description?: string;
    type: 'percentage_discount' | 'fixed_discount' | 'free_gift';
    isApplied: boolean;
    priority: number;
  };
  conditions: PromotionCondition[];
  benefits: {
    discountAmount?: number;
    discountPercentage?: number;
    freeGifts?: Array<{
      name: string;
      quantity: number;
      value: number;
    }>;
  };
  selectionReason?: string;
  conflictInfo?: {
    rejectedPromotions: string[];
    reason: string;
  };
  usageInfo?: {
    usageCount: number;
    usageLimit?: number;
    customerUsageCount: number;
    customerUsageLimit: number;
  };
  className?: string;
  expandable?: boolean;
}

export function PromotionExplanation({
  promotion,
  conditions,
  benefits,
  selectionReason,
  conflictInfo,
  usageInfo,
  className,
  expandable = true,
}: PromotionExplanationProps) {
  const [isExpanded, setIsExpanded] = useState(!expandable);

  const allConditionsMet = conditions.every(condition => condition.isMet);
  const hasUsageLimit = usageInfo && (usageInfo.usageLimit || usageInfo.customerUsageLimit);

  const getPromotionIcon = () => {
    switch (promotion.type) {
      case 'percentage_discount':
      case 'fixed_discount':
        return <Percent className="w-5 h-5" />;
      case 'free_gift':
        return <Gift className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getConditionIcon = (condition: PromotionCondition) => {
    switch (condition.type) {
      case 'cart_value':
        return <ShoppingCart className="w-4 h-4" />;
      case 'product_quantity':
        return <Users className="w-4 h-4" />;
      case 'specific_products':
      case 'category_products':
        return <Gift className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getBenefitText = () => {
    if (benefits.discountPercentage) {
      return `${benefits.discountPercentage}% discount`;
    }
    if (benefits.discountAmount) {
      return `฿${(benefits.discountAmount / 100).toFixed(2)} discount`;
    }
    if (benefits.freeGifts && benefits.freeGifts.length > 0) {
      const giftCount = benefits.freeGifts.reduce((sum, gift) => sum + gift.quantity, 0);
      return `${giftCount} free gift${giftCount > 1 ? 's' : ''}`;
    }
    return 'Special offer';
  };

  return (
    <Card className={cn(
      "border-2 transition-all duration-200",
      promotion.isApplied 
        ? "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50" 
        : allConditionsMet 
          ? "border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50"
          : "border-gray-200 bg-gray-50",
      className
    )}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className={cn(
            "shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
            promotion.isApplied 
              ? "bg-green-100 text-green-600"
              : allConditionsMet
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-500"
          )}>
            {getPromotionIcon()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">
                {promotion.name}
              </h3>
              <Badge 
                variant={promotion.isApplied ? "default" : allConditionsMet ? "secondary" : "outline"}
                className="text-xs"
              >
                {promotion.isApplied ? "Applied" : allConditionsMet ? "Eligible" : "Not Eligible"}
              </Badge>
              {promotion.priority > 0 && (
                <Badge variant="outline" className="text-xs">
                  Priority {promotion.priority}
                </Badge>
              )}
            </div>

            {promotion.description && (
              <p className="text-sm text-gray-600 mb-2">
                {promotion.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {getBenefitText()}
              </span>

              {expandable && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-6 px-2 text-xs"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-3 h-3 mr-1" />
                      Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3 mr-1" />
                      Details
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 space-y-4">
            {/* Conditions */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h4>
              <div className="space-y-2">
                {conditions.map((condition, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <div className={cn(
                      "shrink-0 w-5 h-5 rounded-full flex items-center justify-center",
                      condition.isMet ? "bg-green-100" : "bg-red-100"
                    )}>
                      {condition.isMet ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-600" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 flex-1">
                      {getConditionIcon(condition)}
                      <span className={condition.isMet ? "text-gray-700" : "text-gray-500"}>
                        {condition.description}
                      </span>
                    </div>

                    {condition.currentValue && condition.requiredValue && (
                      <div className="text-xs text-gray-500">
                        {condition.currentValue} / {condition.requiredValue}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Benefits:</h4>
              <div className="space-y-1 text-sm text-gray-600">
                {benefits.discountAmount && (
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-green-600" />
                    <span>Save ฿{(benefits.discountAmount / 100).toFixed(2)} on your order</span>
                  </div>
                )}
                {benefits.discountPercentage && (
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-green-600" />
                    <span>Save {benefits.discountPercentage}% on your order</span>
                  </div>
                )}
                {benefits.freeGifts && benefits.freeGifts.map((gift, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-green-600" />
                    <span>{gift.quantity}x {gift.name} (฿{(gift.value / 100).toFixed(2)} value)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selection Reason */}
            {selectionReason && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Why this promotion?</h4>
                <p className="text-sm text-gray-600">{selectionReason}</p>
              </div>
            )}

            {/* Conflict Information */}
            {conflictInfo && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Promotion Conflicts:</h4>
                <p className="text-sm text-gray-600 mb-1">{conflictInfo.reason}</p>
                {conflictInfo.rejectedPromotions.length > 0 && (
                  <p className="text-xs text-gray-500">
                    Other promotions not applied: {conflictInfo.rejectedPromotions.join(', ')}
                  </p>
                )}
              </div>
            )}

            {/* Usage Information */}
            {hasUsageLimit && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Usage Limits:</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  {usageInfo!.usageLimit && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        Total uses: {usageInfo!.usageCount} / {usageInfo!.usageLimit}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>
                      Your uses: {usageInfo!.customerUsageCount} / {usageInfo!.customerUsageLimit}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}