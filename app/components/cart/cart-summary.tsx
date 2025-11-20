import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { formatCurrencyFromCents } from "~/lib/formatter";
import { useCartStore } from "~/store/cart";

export function CartSummary() {
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const subtotal = getTotalPrice();
  const shipping = 0; // Free shipping for now
  const discount = 293; // Mock discount for now to match design
  const total = subtotal - discount;

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
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Discount</span>
          <span className="font-medium">-{formatCurrencyFromCents(discount, { symbol: '$', decimals: 0 })}</span>
        </div>
      </div>

      <div className="flex gap-2 mb-8">
        <Input
          placeholder="Coupon code"
          className="h-10 bg-transparent border-gray-200 rounded-none placeholder:text-gray-300"
        />
        <Button className="h-10 px-6 bg-black text-white hover:bg-gray-800 rounded-none uppercase text-xs tracking-widest">
          Apply
        </Button>
      </div>

      <div className="flex justify-between items-center mb-8 pt-4 border-t border-gray-100">
        <span className="font-serif text-lg">Total</span>
        <span className="font-serif text-xl font-medium">{formatCurrencyFromCents(total, { symbol: '$' })}</span>
      </div>

      <Button className="w-full h-12 bg-black text-white hover:bg-gray-800 rounded-none uppercase tracking-widest text-sm">
        Checkout
      </Button>
    </div>
  );
}
