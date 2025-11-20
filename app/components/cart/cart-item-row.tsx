import { X } from "lucide-react";
import { QuantitySelector } from "~/components/product/quantity-selector";
import { formatCurrencyFromCents } from "~/lib/formatter";
import type { CartItem } from "~/store/cart";
import { useCartStore } from "~/store/cart";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const handleIncrease = () => {
    updateQuantity(item.productId, item.quantity + 1, item.size);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.quantity - 1, item.size);
    }
  };

  const handleRemove = () => {
    removeItem(item.productId, item.size);
  };

  return (
    <div className="flex items-center py-8 border-b border-gray-100">
      {/* Product Info */}
      <div className="flex-1 flex gap-6">
        <div className="w-24 h-24 bg-gray-100 shrink-0">
          <img
            src={item.image}
            alt={item.productName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="font-serif text-lg mb-1">{item.productName}</h3>
          {item.size && (
            <p className="text-sm text-gray-500">{item.size}</p>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="w-32 text-center font-serif">
        {formatCurrencyFromCents(item.price, { symbol: '$' })}
      </div>

      {/* Quantity */}
      <div className="w-40 flex justify-center">
        <QuantitySelector
          quantity={item.quantity}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          className="h-10 w-28"
        />
      </div>

      {/* Subtotal */}
      <div className="w-32 text-center font-serif">
        {formatCurrencyFromCents(item.price * item.quantity, { symbol: '$' })}
      </div>

      {/* Remove Button */}
      <div className="w-12 flex justify-end">
        <button
          onClick={handleRemove}
          className="text-gray-300 hover:text-gray-500 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
