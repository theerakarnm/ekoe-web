import { X } from "lucide-react";
import { QuantitySelector } from "~/components/product/quantity-selector";
import { formatCurrencyFromCents } from "~/lib/formatter";
import { useCartStore, type CartItem } from "~/store/cart";

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const handleIncrease = () => {
    updateQuantity(item.productId, item.quantity + 1, item.variantId);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.quantity - 1, item.variantId);
    }
  };

  const handleRemove = () => {
    removeItem(item.productId, item.variantId);
  };

  return (
    <div className="flex gap-4 py-6 border-b border-gray-100 relative">
      {/* Product Image */}
      <div className="w-24 h-24 bg-gray-100 shrink-0">
        <img
          src={item.image}
          alt={item.productName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start pr-6">
            <h3 className="font-serif text-lg leading-tight mb-1">{item.productName}</h3>
          </div>
          {item.variantName && (
            <p className="text-sm text-gray-500 mb-2">{item.variantName}</p>
          )}
          <div className="font-serif text-base">
            {formatCurrencyFromCents(item.price, { symbol: '$' })}
          </div>
        </div>

        <div className="flex justify-between items-end mt-2">
          <QuantitySelector
            quantity={item.quantity}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            className="h-8 w-24"
          />
          <div className="font-serif font-medium">
            {formatCurrencyFromCents(item.price * item.quantity, { symbol: '$' })}
          </div>
        </div>
      </div>

      {/* Remove Button - Absolute positioned top right */}
      <button
        onClick={handleRemove}
        className="absolute top-6 right-0 text-gray-300 hover:text-gray-500 transition-colors p-1"
      >
        <X size={20} />
      </button>
    </div>
  );
}
