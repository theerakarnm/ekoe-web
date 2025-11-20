import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { formatCurrencyFromCents } from "~/lib/formatter";
import { useCartStore } from "~/store/cart";
import { Gift } from "lucide-react";

export function CheckoutSummary() {
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const subtotal = getTotalPrice();
  const shipping = 0;
  const discount = 293;
  const total = subtotal - discount;

  return (
    <div className="bg-gray-50 p-8 h-full min-h-screen border-l border-gray-200">
      {/* Cart Items */}
      <div className="space-y-6 mb-8">
        {items.map((item) => (
          <div key={`${item.productId}-${item.size}`} className="flex items-center gap-4">
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
              {item.size && <p className="text-xs text-gray-500">{item.size}</p>}
            </div>
            <div className="font-medium text-sm">
              {formatCurrencyFromCents(item.price * item.quantity, { symbol: '$' })}
            </div>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <div className="flex gap-2 mb-8 pb-8 border-b border-gray-200">
        <Input
          placeholder="Coupon code"
          className="bg-white border-gray-300"
        />
        <Button className="bg-black text-white hover:bg-gray-800">
          Apply
        </Button>
      </div>

      {/* Totals */}
      <div className="space-y-4 mb-8 pb-8 border-b border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatCurrencyFromCents(subtotal, { symbol: '$' })}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-xs uppercase">Free</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Discount</span>
          <span className="font-medium">-{formatCurrencyFromCents(discount, { symbol: '$', decimals: 0 })}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <span className="text-lg font-medium">Total</span>
        <span className="text-2xl font-serif font-medium">
          {formatCurrencyFromCents(total, { symbol: '$' })}
        </span>
      </div>

      {/* Free Gift */}
      <div className="bg-white border border-gray-200 rounded p-4">
        <div className="flex items-center gap-2 mb-4">
          <Gift size={16} className="text-gray-600" />
          <h3 className="font-serif text-sm font-medium">Free Gift With Purchase</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-2 border border-gray-100 rounded">
            <div className="w-10 h-10 bg-gray-100 rounded shrink-0">
              <img
                src="https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=100"
                alt="Gift 1"
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div className="flex-1">
              <div className="font-serif text-xs font-medium">The Oil Bar</div>
              <div className="text-[10px] text-gray-500">50 ml.</div>
            </div>
            <div className="text-xs font-medium text-gray-500">x1</div>
          </div>
          <div className="flex items-center gap-3 p-2 border border-gray-100 rounded">
            <div className="w-10 h-10 bg-gray-100 rounded shrink-0">
              <img
                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=100"
                alt="Gift 2"
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div className="flex-1">
              <div className="font-serif text-xs font-medium">The Serum</div>
              <div className="text-[10px] text-gray-500">20 ml.</div>
            </div>
            <div className="text-xs font-medium text-gray-500">x1</div>
          </div>
        </div>
      </div>
    </div>
  );
}
