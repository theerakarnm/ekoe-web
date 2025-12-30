import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { formatCurrencyFromCents } from "~/lib/formatter";
import { useCartStore } from "~/store/cart";
import { Link } from "react-router";
import { useState } from "react";
import { validateDiscountCode } from "~/lib/services/cart.service";
import { Loader2, Gift, Tag } from "lucide-react";
import type { PromotionalCartResult } from "~/lib/services/promotional-cart.service";

interface CartSummaryProps {
  promotionalResult?: PromotionalCartResult | null;
}

export function CartSummary({ promotionalResult }: CartSummaryProps) {
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const storeDiscount = useCartStore((state) => state.discountAmount);
  const discountCode = useCartStore((state) => state.discountCode);
  const items = useCartStore((state) => state.items);
  const applyDiscountCode = useCartStore((state) => state.applyDiscountCode);
  const removeDiscountCode = useCartStore((state) => state.removeDiscountCode);

  // Use promotional result pricing if available, otherwise fall back to store values
  const subtotal = promotionalResult?.pricing.subtotal ?? getSubtotal();
  const discount = promotionalResult?.pricing.discountAmount ?? storeDiscount;
  const freeGifts = promotionalResult?.freeGifts ?? [];
  const appliedPromotions = promotionalResult?.appliedPromotions ?? [];

  // Calculate total
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
      <h2 className="font-serif text-xl mb-8">สรุปยอดตะกร้า</h2>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">ยอดรวมสินค้า</span>
          <span className="font-medium">{formatCurrencyFromCents(subtotal, { symbol: '฿' })}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">ค่าจัดส่ง</span>
          <span className="font-medium uppercase">ฟรี</span>
        </div>

        {/* Discount display */}
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              ส่วนลด
            </span>
            <span className="font-medium">-{formatCurrencyFromCents(discount, { symbol: '฿' })}</span>
          </div>
        )}

        {/* Applied promotions */}
        {appliedPromotions.length > 0 && (
          <div className="border-t border-gray-100 pt-3 mt-3 space-y-2">
            {appliedPromotions.map((promo) => (
              <div key={promo.promotionId} className="text-xs text-green-600 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {promo.promotionName}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Free Gifts Section */}
      {freeGifts.length > 0 && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="text-sm font-medium text-green-800 flex items-center gap-2 mb-3">
            <Gift className="w-4 h-4" />
            ของแถมฟรี
          </h3>
          <div className="space-y-2">
            {freeGifts.map((gift, index) => (
              <div key={`${gift.productId}-${index}`} className="flex items-center gap-3">
                {gift.imageUrl && (
                  <img src={gift.imageUrl} alt={gift.name} className="w-10 h-10 object-cover rounded" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">{gift.name}</p>
                  <p className="text-xs text-green-600">จำนวน: {gift.quantity}</p>
                </div>
                <span className="text-xs text-green-600">
                  {formatCurrencyFromCents(gift.value, { symbol: '฿' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8 pt-4 border-t border-gray-100">
        <span className="font-serif text-lg">ยอดชำระทั้งหมด</span>
        <span className="font-serif text-xl font-medium">{formatCurrencyFromCents(Math.max(0, total), { symbol: '฿' })}</span>
      </div>

      <Link to="/checkout" className="block w-full">
        <Button disabled={subtotal <= 0} className="w-full h-12 bg-black text-white hover:bg-gray-800 rounded-none uppercase tracking-widest text-sm">
          ดำเนินการชำระเงิน
        </Button>
      </Link>
    </div>
  );
}

