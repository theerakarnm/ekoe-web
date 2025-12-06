import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { AlertCircle, PackageX, AlertTriangle } from "lucide-react";
import type { CartValidationError } from "~/lib/services/cart.service";

interface CartValidationErrorsProps {
  errors: CartValidationError[];
  onDismiss?: () => void;
}

/**
 * Display cart validation errors with appropriate icons and messages
 * Handles product not found, out of stock, and insufficient stock errors
 */
export function CartValidationErrors({ errors, onDismiss }: CartValidationErrorsProps) {
  if (errors.length === 0) return null;

  // Group errors by type for better display
  const outOfStockErrors = errors.filter(e => e.type === 'out_of_stock');
  const productNotFoundErrors = errors.filter(e => e.type === 'product_not_found' || e.type === 'product_inactive');
  const insufficientStockErrors = errors.filter(e => e.type === 'insufficient_stock');

  return (
    <div className="space-y-3">
      {/* Out of Stock Errors */}
      {outOfStockErrors.length > 0 && (
        <Alert variant="destructive">
          <PackageX className="h-4 w-4" />
          <AlertTitle>Items Out of Stock</AlertTitle>
          <AlertDescription>
            <div className="space-y-1 mt-2">
              <p className="text-sm">The following items are no longer available:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {outOfStockErrors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
              <p className="text-sm mt-2">These items have been removed from your cart.</p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Product Not Found Errors */}
      {productNotFoundErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Products Unavailable</AlertTitle>
          <AlertDescription>
            <div className="space-y-1 mt-2">
              <p className="text-sm">The following products are no longer available:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {productNotFoundErrors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
              <p className="text-sm mt-2">These items have been removed from your cart.</p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Insufficient Stock Errors */}
      {insufficientStockErrors.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Limited Stock Available</AlertTitle>
          <AlertDescription>
            <div className="space-y-1 mt-2">
              <p className="text-sm">Some items have limited stock:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {insufficientStockErrors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
              <p className="text-sm mt-2">Quantities have been adjusted to available stock.</p>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
