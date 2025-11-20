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
    <div className="w-full hover:bg-gray-100 transition-all rounded-b pb-2 group cursor-pointer">
      <div className="bg-secondary-light dark:bg-secondary-dark rounded overflow-hidden">
        <img
          alt={product.image.description}
          className="w-full h-48 sm:h-56 object-cover rounded-t"
          src={product.image.url}
        />
      </div>
      <div className="mt-3 sm:mt-4 text-center px-2">
        <h3 className="font-serif text-lg sm:text-xl mb-1 truncate">{product.productName}</h3>
        <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-400 mb-2">50 ml. / 120 ml.</p>
        <div className="relative h-6 sm:h-8 overflow-hidden">
          <p className="text-xs sm:text-sm text-text-light/70 font-serif transition-all duration-300 group-hover:-translate-y-full">
            {product.priceTitle}
          </p>
          <button
            className="w-full h-full text-xs sm:text-sm text-text-light/70 pt-1 bg-black text-white font-serif absolute inset-0 transition-all duration-300 translate-y-full group-hover:translate-y-0 flex items-center justify-center"
            onClick={handleAddToCart}
          >
            Add to cart {formatCurrencyFromCents(product.quickCartPrice, { symbol: '$' })}
          </button>
        </div>
      </div>
    </div>
  )
}

export { ProductCard }