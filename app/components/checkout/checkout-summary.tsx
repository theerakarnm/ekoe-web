import { useEffect, useState, useMemo } from "react";
import { formatCurrencyFromCents } from "~/lib/formatter";
import { useCartStore, type FreeGift } from "~/store/cart";
import { DiscountCodeInput } from "./discount-code-input";
import { FreeGiftDisplay } from "./free-gift-display";
import { ShippingMethodSelector } from "./shipping-method-selector";

export function CheckoutSummary() {
  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const discountAmount = useCartStore((state) => state.discountAmount);
  const eligibleGifts = useCartStore((state) => state.eligibleGifts);
  const fetchEligibleGifts = useCartStore((state) => state.fetchEligibleGifts);
  const getComplimentaryGifts = useCartStore((state) => state.getComplimentaryGifts);

  const [shippingCost, setShippingCost] = useState(0);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>();

  const subtotal = getSubtotal();
  const discount = discountAmount;
  // Calculate tax (7% VAT) - matches backend calculation in orders.domain.ts
  const taxAmount = Math.round((subtotal + shippingCost) * 0.07);
  const total = subtotal + shippingCost + taxAmount - discount;

  // Combine eligible gifts and complimentary gifts from cart items
  const allGifts = useMemo(() => {
    const complimentaryGifts = getComplimentaryGifts();

    // Convert complimentary gifts to FreeGift format
    const convertedGifts: FreeGift[] = complimentaryGifts.map((gift) => ({
      id: `complimentary-${gift.productId}`,
      name: gift.name,
      description: gift.description || `Gift from ${gift.productName}`,
      imageUrl: gift.imageUrl,
      value: gift.value,
    }));

    // Combine and deduplicate by name
    const combined = [...convertedGifts, ...eligibleGifts];
    const uniqueGifts = combined.reduce((acc, gift) => {
      if (!acc.some(g => g.name === gift.name)) {
        acc.push(gift);
      }
      return acc;
    }, [] as FreeGift[]);

    return uniqueGifts;
  }, [getComplimentaryGifts, eligibleGifts]);

  // Fetch eligible gifts when cart changes
  useEffect(() => {
    fetchEligibleGifts();
  }, [items, fetchEligibleGifts]);

  const handleShippingMethodChange = (methodId: string, cost: number) => {
    setSelectedShippingMethod(methodId);
    setShippingCost(cost);
  };

  return (
    <div className="bg-gray-50 p-8 h-full min-h-screen border-l border-gray-200">
      {/* Cart Items */}
      <div className="space-y-6 mb-8">
        {items.map((item) => (
          <div key={`${item.productId}-${item.variantId || 'default'}`} className="flex items-center gap-4">
            <div className="relative w-16 h-16 bg-white border border-gray-200 rounded shrink-0">
              <img
                src={item.image}
                alt={item.productName}
                className="w-full h-full object-cover rounded"
              />
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">{item.productName}</h4>
              {item.variantName && <p className="text-xs text-gray-500">{item.variantName}</p>}
            </div>
            <div className="font-medium text-sm">
              {formatCurrencyFromCents(item.price * item.quantity, { symbol: '฿' })}
            </div>
          </div>
        ))}
      </div>

      {/* Discount Code */}
      <div className="mb-8 pb-8 border-b border-gray-200">
        <DiscountCodeInput />
      </div>

      {/* Shipping Method */}
      <div className="mb-8 pb-8 border-b border-gray-200">
        <h3 className="font-medium text-sm mb-3">Shipping Method</h3>
        <ShippingMethodSelector
          selectedMethod={selectedShippingMethod}
          onMethodChange={handleShippingMethodChange}
        />
      </div>

      {/* Totals */}
      <div className="space-y-4 mb-8 pb-8 border-b border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatCurrencyFromCents(subtotal, { symbol: '฿' })}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {shippingCost === 0 ? (
              <span className="text-xs uppercase">Free</span>
            ) : (
              formatCurrencyFromCents(shippingCost, { symbol: '฿' })
            )}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (7% VAT)</span>
          <span className="font-medium">{formatCurrencyFromCents(taxAmount, { symbol: '฿' })}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Discount</span>
            <span className="font-medium text-green-600">-{formatCurrencyFromCents(discount, { symbol: '฿' })}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-8">
        <span className="text-lg font-medium">Total</span>
        <span className="text-2xl font-serif font-medium">
          {formatCurrencyFromCents(total, { symbol: '฿' })}
        </span>
      </div>

      {/* Free Gifts - Shows both complimentary and eligible gifts */}
      <FreeGiftDisplay gifts={allGifts} />
    </div>
  );
}
