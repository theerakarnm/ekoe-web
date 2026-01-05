import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Loader2, X, CheckCircle2 } from "lucide-react";
import { validateDiscountCode, type DiscountValidation } from "~/lib/services/cart.service";
import { DiscountValidationError } from "./discount-validation-error";
import { useCartStore } from "~/store/cart";

interface DiscountCodeInputProps {
  onDiscountApplied?: (code: string, amount: number) => void;
  onDiscountRemoved?: () => void;
}

export function DiscountCodeInput({ onDiscountApplied, onDiscountRemoved }: DiscountCodeInputProps) {
  const [code, setCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<DiscountValidation | null>(null);

  const discountCode = useCartStore((state) => state.discountCode);
  const discountAmount = useCartStore((state) => state.discountAmount);
  const applyDiscountCode = useCartStore((state) => state.applyDiscountCode);
  const removeDiscountCode = useCartStore((state) => state.removeDiscountCode);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const items = useCartStore((state) => state.items);

  const handleApply = async () => {
    if (!code.trim()) return;

    setIsValidating(true);
    setValidationResult(null);

    try {
      const subtotal = getSubtotal();
      const cartItems = items.map(item => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      }));

      const result = await validateDiscountCode(code.trim(), subtotal, cartItems);
      setValidationResult(result);

      if (result.isValid && result.discountAmount) {
        // Apply discount to cart store
        applyDiscountCode(result.code!, result.discountAmount);

        // Notify parent component
        if (onDiscountApplied) {
          onDiscountApplied(result.code!, result.discountAmount);
        }

        // Clear input
        setCode("");
      }
    } catch (error) {
      console.error("Failed to validate discount code:", error);
      setValidationResult({
        isValid: false,
        error: "Failed to validate discount code. Please try again.",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemove = () => {
    removeDiscountCode();
    setValidationResult(null);

    // Notify parent component
    if (onDiscountRemoved) {
      onDiscountRemoved();
    }
  };

  return (
    <div className="space-y-3">
      {/* Applied Discount Display */}
      {discountCode && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <span className="font-medium text-green-900">ใช้โค้ด "{discountCode}" แล้ว</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="h-6 px-2 text-green-700 hover:text-green-900 hover:bg-green-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Input Field (only show if no discount applied) */}
      {!discountCode && (
        <>
          <div className="flex gap-2">
            <Input
              placeholder="ใส่โค้ดส่วนลด"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleApply();
                }
              }}
              disabled={isValidating}
              className="bg-white border-gray-300"
            />
            <Button
              type="button"
              onClick={handleApply}
              disabled={!code.trim() || isValidating}
              className="bg-black text-white hover:bg-gray-800 min-w-[80px]"
            >
              {isValidating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'ใช้งาน'
              )}
            </Button>
          </div>

          {/* Error Message */}
          {validationResult && !validationResult.isValid && (
            <DiscountValidationError validation={validationResult} />
          )}
        </>
      )}
    </div>
  );
}
