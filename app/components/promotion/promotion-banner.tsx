import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Gift, Percent, Clock, Tag } from "lucide-react";
import { cn } from "~/lib/utils";

interface PromotionBannerProps {
  promotion: {
    id: string;
    name: string;
    description?: string;
    type: 'percentage_discount' | 'fixed_discount' | 'free_gift';
    discountValue?: number;
    minCartValue?: number;
    endsAt: string;
    isUrgent?: boolean;
  };
  className?: string;
  onViewDetails?: () => void;
  showCta?: boolean;
}

export function PromotionBanner({
  promotion,
  className,
  onViewDetails,
  showCta = true,
}: PromotionBannerProps) {
  const getPromotionIcon = () => {
    switch (promotion.type) {
      case 'percentage_discount':
      case 'fixed_discount':
        return <Percent className="w-5 h-5" />;
      case 'free_gift':
        return <Gift className="w-5 h-5" />;
      default:
        return <Tag className="w-5 h-5" />;
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

  const getThresholdText = () => {
    if (promotion.minCartValue) {
      return `on orders over ฿${(promotion.minCartValue / 100).toFixed(0)}`;
    }
    return '';
  };

  const formatTimeRemaining = () => {
    const endDate = new Date(promotion.endsAt);
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} left`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} left`;
    } else {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes} minute${minutes > 1 ? 's' : ''} left`;
    }
  };

  const isExpiringSoon = () => {
    const endDate = new Date(promotion.endsAt);
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    const hoursRemaining = diff / (1000 * 60 * 60);
    return hoursRemaining <= 24 && hoursRemaining > 0;
  };

  return (
    <Card className={cn(
      "relative overflow-hidden border-2 transition-all duration-200 hover:shadow-md",
      promotion.isUrgent || isExpiringSoon() 
        ? "border-red-200 bg-gradient-to-r from-red-50 to-pink-50" 
        : "border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50",
      className
    )}>
      {/* Urgency indicator */}
      {(promotion.isUrgent || isExpiringSoon()) && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl-lg">
          <Clock className="w-3 h-3 inline mr-1" />
          Limited Time
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={cn(
            "shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
            promotion.isUrgent || isExpiringSoon()
              ? "bg-red-100 text-red-600"
              : "bg-blue-100 text-blue-600"
          )}>
            {getPromotionIcon()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge 
                variant={promotion.isUrgent || isExpiringSoon() ? "destructive" : "default"}
                className="text-xs font-bold"
              >
                {getPromotionText()}
              </Badge>
              {promotion.minCartValue && (
                <span className="text-xs text-gray-600">
                  {getThresholdText()}
                </span>
              )}
            </div>

            <h3 className="font-semibold text-gray-900 mb-1">
              {promotion.name}
            </h3>

            {promotion.description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {promotion.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{formatTimeRemaining()}</span>
              </div>

              {showCta && onViewDetails && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onViewDetails}
                  className="text-xs"
                >
                  View Details
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}