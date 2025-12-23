import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { formatCurrencyFromCents } from "~/lib/formatter";
import { useCartStore } from "~/store/cart";
import { Link } from "react-router";
import { useState } from "react";
import { validateDiscountCode } from "~/lib/services/cart.service";
import { Loader2 } from "lucide-react";

export function CartSummary() {
  const subtotal = useCartStore((state) => state.getSubtotal());
  const discount = useCartStore((state) => state.discountAmount);
  const discountCode = useCartStore((state) => state.discountCode);
  const items = useCartStore((state) => state.items);
  const applyDiscountCode = useCartStore((state) => state.applyDiscountCode);
  const removeDiscountCode = useCartStore((state) => state.removeDiscountCode);

  // Only dealing with 0 shipping/tax for now as per previous implementation
  const total = subtotal - discount;

  const [couponCode, setCouponCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const cartItems = items.map(item => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity
      }));

      const result = await validateDiscountCode(couponCode, subtotal, cartItems);

      if (result && result.isValid && result.discountAmount !== undefined) {
        applyDiscountCode(result.code || couponCode, result.discountAmount);
        setMessage({ type: 'success', text: `Coupon ${result.code || couponCode} applied!` });
        setCouponCode("");
      } else {
        setMessage({ type: 'error', text: result?.error || "Invalid coupon code" });
      }
    } catch (err) {
      setMessage({ type: 'error', text: "Failed to apply coupon" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 p-8">
      <h2 className="font-serif text-xl mb-8">Cart Total</h2>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatCurrencyFromCents(subtotal, { symbol: '$' })}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium uppercase">Free</span>
        </div>

      </div>



      <div className="flex justify-between items-center mb-8 pt-4 border-t border-gray-100">
        <span className="font-serif text-lg">Total</span>
        <span className="font-serif text-xl font-medium">{formatCurrencyFromCents(Math.max(0, total), { symbol: '$' })}</span>
      </div>

      <Link to="/checkout" className="block w-full">
        <Button disabled={subtotal <= 0} className="w-full h-12 bg-black text-white hover:bg-gray-800 rounded-none uppercase tracking-widest text-sm">
          Checkout
        </Button>
      </Link>
    </div>
  );
}
