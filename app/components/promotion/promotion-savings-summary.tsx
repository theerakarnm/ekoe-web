import { Badge } from "~/components/ui/badge";
import { 
  CheckCircle, 
  Gift, 
  Percent, 
  Sparkles,
  TrendingDown
} from "lucide-react";
import { cn } from "~/lib/utils";

interface PromotionSavingsSummaryProps {
  appliedPromotions: Array<{
    promotionId: string;
    promotionName: string;
    discountAmount: number;
    freeGifts: Array<{
      quantity: number;
      name: string;
      value: number;
    }>;
  }>;
  totalDiscountAmount: number;
  totalGiftValue?: number;
  compact?: boolean;
  emailFormat?: boolean;
  className?: string;
}

export function PromotionSavingsSummary({
  appliedPromotions,
  totalDiscountAmount,
  totalGiftValue = 0,
  compact = false,
  emailFormat = false,
  className,
}: PromotionSavingsSummaryProps) {
  if (appliedPromotions.length === 0) {
    return null;
  }

  const totalSavings = totalDiscountAmount + totalGiftValue;
  const totalGifts = appliedPromotions.reduce((sum, promo) => sum + promo.freeGifts.length, 0);

  // Email-friendly styles (inline styles for better email client support)
  const emailStyles = emailFormat ? {
    container: {
      backgroundColor: '#f0fdf4',
      border: '2px solid #bbf7d0',
      borderRadius: '8px',
      padding: '16px',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      color: '#166534',
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    badge: {
      backgroundColor: '#dcfce7',
      color: '#166534',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '8px 0',
      borderBottom: '1px solid #bbf7d0',
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '12px 0',
      fontWeight: 'bold',
      fontSize: '16px',
      color: '#166534',
    },
  } : {};

  if (emailFormat) {
    return (
      <div style={emailStyles.container} className={className}>
        <div style={emailStyles.header}>
          <span>🎉</span>
          <span>Promotions Applied - You Saved ฿{(totalSavings / 100).toFixed(2)}!</span>
        </div>
        
        {appliedPromotions.map((promotion) => (
          <div key={promotion.promotionId} style={{ marginBottom: '12px' }}>
            <div style={emailStyles.badge}>
              {promotion.promotionName}
            </div>
            
            {promotion.discountAmount > 0 && (
              <div style={emailStyles.summaryRow}>
                <span>💰 Discount Applied:</span>
                <span style={{ color: '#166534', fontWeight: 'bold' }}>
                  -฿{(promotion.discountAmount / 100).toFixed(2)}
                </span>
              </div>
            )}
            
            {promotion.freeGifts.map((gift, index) => (
              <div key={index} style={emailStyles.summaryRow}>
                <span>🎁 {gift.quantity}x {gift.name}:</span>
                <span style={{ color: '#166534', fontWeight: 'bold' }}>
                  ฿{(gift.value / 100).toFixed(2)} value
                </span>
              </div>
            ))}
          </div>
        ))}
        
        <div style={emailStyles.totalRow}>
          <span>Total Savings:</span>
          <span>฿{(totalSavings / 100).toFixed(2)}</span>
        </div>
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: '12px', 
          fontSize: '12px', 
          color: '#166534' 
        }}>
          Thank you for shopping with us! These promotions were automatically applied.
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={cn(
        "bg-green-50 border border-green-200 rounded-lg p-3",
        className
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              {appliedPromotions.length} promotion{appliedPromotions.length > 1 ? 's' : ''} applied
            </span>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-green-600">
              ฿{(totalSavings / 100).toFixed(2)} saved
            </div>
            {totalGifts > 0 && (
              <div className="text-xs text-green-600">
                + {totalGifts} free gift{totalGifts > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-green-50 border-2 border-green-200 rounded-lg p-4",
      className
    )}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-green-600" />
        </div>
        <h3 className="font-semibold text-green-900">
          Promotions Applied - You Saved ฿{(totalSavings / 100).toFixed(2)}!
        </h3>
      </div>

      {/* Promotions List */}
      <div className="space-y-3 mb-4">
        {appliedPromotions.map((promotion) => (
          <div key={promotion.promotionId} className="bg-white rounded-lg p-3 border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                {promotion.promotionName}
              </Badge>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>

            <div className="space-y-1 text-sm">
              {promotion.discountAmount > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Discount Applied:</span>
                  </div>
                  <span className="font-medium text-green-600">
                    -฿{(promotion.discountAmount / 100).toFixed(2)}
                  </span>
                </div>
              )}

              {promotion.freeGifts.map((gift, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">
                      {gift.quantity}x {gift.name}:
                    </span>
                  </div>
                  <span className="font-medium text-green-600">
                    ฿{(gift.value / 100).toFixed(2)} value
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Total Savings */}
      <div className="bg-green-100 rounded-lg p-3 border border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-green-700" />
            <span className="font-semibold text-green-800">Total Savings:</span>
          </div>
          <span className="text-lg font-bold text-green-700">
            ฿{(totalSavings / 100).toFixed(2)}
          </span>
        </div>

        {(totalDiscountAmount > 0 || totalGiftValue > 0) && (
          <div className="mt-2 pt-2 border-t border-green-300 space-y-1 text-sm text-green-700">
            {totalDiscountAmount > 0 && (
              <div className="flex justify-between">
                <span>Discount Savings:</span>
                <span>-฿{(totalDiscountAmount / 100).toFixed(2)}</span>
              </div>
            )}
            {totalGiftValue > 0 && (
              <div className="flex justify-between">
                <span>Free Gift Value:</span>
                <span>฿{(totalGiftValue / 100).toFixed(2)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Thank You Message */}
      <div className="mt-3 text-center">
        <p className="text-xs text-green-700">
          Thank you for shopping with us! These promotions were automatically applied to give you the best value.
        </p>
      </div>
    </div>
  );
}