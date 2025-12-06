import { Alert, AlertDescription } from "~/components/ui/alert";
import { AlertCircle, Clock, ShoppingCart, Ban, Calendar } from "lucide-react";
import type { DiscountValidation } from "~/lib/services/cart.service";

interface DiscountValidationErrorProps {
  validation: DiscountValidation;
}

/**
 * Display discount validation errors with appropriate icons and detailed messages
 * Handles invalid codes, expired codes, usage limits, and minimum purchase requirements
 */
export function DiscountValidationError({ validation }: DiscountValidationErrorProps) {
  if (validation.isValid) return null;

  const getErrorDetails = () => {
    if (validation.error) {
      return {
        icon: AlertCircle,
        title: 'Error',
        message: validation.error,
      };
    }

    switch (validation.errorCode) {
      case 'INVALID_CODE':
        return {
          icon: Ban,
          title: 'Invalid Discount Code',
          message: 'This discount code is not valid. Please check the code and try again.',
        };
      case 'EXPIRED':
        return {
          icon: Clock,
          title: 'Code Expired',
          message: 'This discount code has expired and can no longer be used.',
        };
      case 'USAGE_LIMIT_REACHED':
        return {
          icon: Ban,
          title: 'Usage Limit Reached',
          message: 'This discount code has reached its maximum usage limit and is no longer available.',
        };
      case 'MIN_PURCHASE_NOT_MET':
        return {
          icon: ShoppingCart,
          title: 'Minimum Purchase Required',
          message: 'Your order does not meet the minimum purchase requirement for this discount code. Add more items to your cart to qualify.',
        };
      case 'NOT_APPLICABLE':
        return {
          icon: AlertCircle,
          title: 'Not Applicable',
          message: 'This discount code is not applicable to the items in your cart. It may be restricted to specific products.',
        };
      case 'NOT_STARTED':
        return {
          icon: Calendar,
          title: 'Not Yet Active',
          message: 'This discount code is not yet active. Please check the start date and try again later.',
        };
      default:
        return {
          icon: AlertCircle,
          title: 'Unable to Apply',
          message: 'Unable to apply this discount code. Please contact support if the problem persists.',
        };
    }
  };

  const { icon: Icon, title, message } = getErrorDetails();

  return (
    <Alert variant="destructive">
      <Icon className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-1">
          <p className="font-medium">{title}</p>
          <p className="text-sm">{message}</p>
        </div>
      </AlertDescription>
    </Alert>
  );
}
