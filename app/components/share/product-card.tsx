import type { IProduct } from "~/interface/product.interface"
import { formatCurrencyFromCents } from "~/lib/formatter"
import { useCartStore } from "~/store/cart"
import { toast } from "sonner"

function ProductCard({ product }: { product: IProduct }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation if the card is clickable
    e.preventDefault();

    addItem({
      productId: product.productId,
      productName: product.productName,
      image: product.image.url,
      price: product.quickCartPrice,
      quantity: 1,
      // Default to first size if available, otherwise undefined
      size: product.sizes?.[0]?.value
    });

    toast.success(`Added ${product.productName} to cart`);
  };

  return (
    <div className="w-full bg-white border border-gray-200 group cursor-pointer transition-all duration-300 hover:shadow-lg">
      <div className="w-full aspect-4/5 overflow-hidden relative">
        <img
          alt={product.image.description}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={product.image.url}
        />
      </div>
      <div className="border-t border-gray-200 p-4 text-left">
        <h3 className="font-serif text-lg text-gray-900 mb-1 truncate">{product.productName}</h3>
        <p className="text-sm text-gray-400 mb-4">50 ml. / 120 ml.</p>
        <div className="relative h-6 overflow-hidden">
          <p className="text-sm text-gray-900 font-serif transition-all duration-300 group-hover:-translate-y-full">
            {product.priceTitle}
          </p>
          <button
            className="w-full h-full text-sm text-gray-900 font-serif absolute inset-0 transition-all duration-300 translate-y-full group-hover:translate-y-0 flex items-center justify-start underline decoration-1 underline-offset-4"
            onClick={handleAddToCart}
          >
            Add to cart — {formatCurrencyFromCents(product.quickCartPrice, { symbol: '$' })}
          </button>
        </div>
      </div>
    </div>
  )
}

export { ProductCard }