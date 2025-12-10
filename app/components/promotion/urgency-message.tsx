import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { 
  Clock, 
  AlertTriangle, 
  Zap, 
  Timer,
  Gift,
  Percent,
  Flame
} from "lucide-react";
import { cn } from "~/lib/utils";
import { useEffect, useState } from "react";

interface UrgencyMessageProps {
  promotion: {
    id: string;
    name: string;
    type: 'percentage_discount' | 'fixed_discount' | 'free_gift';
    discountValue?: number;
    endsAt: string;
  };
  urgencyLevel: 'high' | 'medium' | 'low';
  onTakeAction?: () => void;
  actionText?: string;
  className?: string;
}

export function UrgencyMessage({
  promotion,
  urgencyLevel,
  onTakeAction,
  actionText = "Shop Now",
  className,
}: UrgencyMessageProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const endDate = new Date(promotion.endsAt);
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();

      if (diff <= 0) {
        setIsExpired(true);
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [promotion.endsAt]);

  if (isExpired) {
    return null;
  }

  const getUrgencyConfig = () => {
    switch (urgencyLevel) {
      case 'high':
        return {
          bgColor: "from-red-50 to-pink-50",
          borderColor: "border-red-300",
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          textColor: "text-red-900",
          badgeVariant: "destructive" as const,
          icon: <Flame className="w-5 h-5" />,
          pulse: true,
        };
      case 'medium':
        return {
          bgColor: "from-orange-50 to-amber-50",
          borderColor: "border-orange-300",
          iconBg: "bg-orange-100",
          iconColor: "text-orange-600",
          textColor: "text-orange-900",
          badgeVariant: "secondary" as const,
          icon: <AlertTriangle className="w-5 h-5" />,
          pulse: false,
        };
      case 'low':
        return {
          bgColor: "from-yellow-50 to-amber-50",
          borderColor: "border-yellow-300",
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-600",
          textColor: "text-yellow-900",
          badgeVariant: "outline" as const,
          icon: <Clock className="w-5 h-5" />,
          pulse: false,
        };
    }
  };

  const config = getUrgencyConfig();

  const getPromotionIcon = () => {
    switch (promotion.type) {
      case 'percentage_discount':
      case 'fixed_discount':
        return <Percent className="w-4 h-4" />;
      case 'free_gift':
        return <Gift className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
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

  const getUrgencyText = () => {
    const { days, hours, minutes } = timeRemaining;
    
    if (days > 0) {
      return `Ends in ${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `Ends in ${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `Ends in ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return "Ending very soon!";
    }
  };

  const getMotivationalText = () => {
    const { days, hours, minutes } = timeRemaining;
    
    if (urgencyLevel === 'high') {
      if (minutes <= 30) {
        return "⚡ Last chance! This offer expires in minutes!";
      } else if (hours <= 2) {
        return "🔥 Hurry! Only a few hours left to save!";
      } else {
        return "⏰ Limited time offer - don't miss out!";
      }
    } else if (urgencyLevel === 'medium') {
      if (hours <= 6) {
        return "This great deal ends today - secure your savings now!";
      } else if (days <= 1) {
        return "Less than 24 hours left to take advantage of this offer!";
      } else {
        return "This promotion won't last much longer!";
      }
    } else {
      return "This offer is ending soon - shop while you can!";
    }
  };

  return (
    <Card className={cn(
      "border-2 overflow-hidden",
      `bg-gradient-to-r ${config.bgColor}`,
      config.borderColor,
      config.pulse && "animate-pulse",
      className
    )}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className={cn(
            "shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
            config.iconBg,
            config.iconColor
          )}>
            {config.icon}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={config.badgeVariant} className="text-xs font-bold">
                {getPromotionText()}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {getUrgencyText()}
              </Badge>
            </div>
            <h3 className={cn("font-semibold", config.textColor)}>
              {promotion.name}
            </h3>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="mb-4">
          <div className="flex justify-center gap-2 mb-2">
            {timeRemaining.days > 0 && (
              <div className="text-center bg-white rounded-lg px-2 py-1 min-w-[50px]">
                <div className="text-lg font-bold text-gray-900">
                  {timeRemaining.days}
                </div>
                <div className="text-xs text-gray-500">
                  {timeRemaining.days === 1 ? 'Day' : 'Days'}
                </div>
              </div>
            )}
            
            <div className="text-center bg-white rounded-lg px-2 py-1 min-w-[50px]">
              <div className="text-lg font-bold text-gray-900">
                {timeRemaining.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-500">Hours</div>
            </div>
            
            <div className="text-center bg-white rounded-lg px-2 py-1 min-w-[50px]">
              <div className="text-lg font-bold text-gray-900">
                {timeRemaining.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-500">Mins</div>
            </div>
            
            {urgencyLevel === 'high' && (
              <div className="text-center bg-white rounded-lg px-2 py-1 min-w-[50px]">
                <div className="text-lg font-bold text-gray-900">
                  {timeRemaining.seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-gray-500">Secs</div>
              </div>
            )}
          </div>
        </div>

        {/* Motivational Message */}
        <div className="mb-4">
          <p className={cn("text-sm text-center font-medium", config.textColor)}>
            {getMotivationalText()}
          </p>
        </div>

        {/* Action Button */}
        {onTakeAction && (
          <div className="flex justify-center">
            <Button
              onClick={onTakeAction}
              className={cn(
                "font-semibold",
                urgencyLevel === 'high' 
                  ? "bg-red-600 hover:bg-red-700 text-white" 
                  : urgencyLevel === 'medium'
                    ? "bg-orange-600 hover:bg-orange-700 text-white"
                    : "bg-yellow-600 hover:bg-yellow-700 text-white"
              )}
              size="sm"
            >
              <Timer className="w-4 h-4 mr-2" />
              {actionText}
            </Button>
          </div>
        )}

        {/* Fine Print */}
        <div className="mt-3 pt-3 border-t border-current border-opacity-20">
          <div className="flex items-center justify-center gap-2">
            {getPromotionIcon()}
            <p className={cn("text-xs text-center", config.textColor)}>
              Offer expires {new Date(promotion.endsAt).toLocaleDateString()} at{' '}
              {new Date(promotion.endsAt).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}