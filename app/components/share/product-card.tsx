import { Link } from "react-router";
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
      productId: String(product.productId),
      productName: product.productName,
      image: product.image.url,
      price: product.quickCartPrice,
      quantity: 1,
      // Use variantName instead of size for display
      variantName: product.sizes?.[0]?.value
    });

    toast.success(`Added ${product.productName} to cart`);
  };

  return (
    <Link to={`/product-detail/${product.productId}`} className="block w-full">
      <div className="w-full bg-white border border-gray-200 group cursor-pointer transition-all duration-300 hover:shadow-lg">
        <div className="w-full aspect-4/5 overflow-hidden relative">
          {/* Primary Image */}
          <img
            alt={product.image.description}
            className={`w-full h-full object-cover transition-all duration-500 ${product.secondaryImage
              ? 'group-hover:opacity-0'
              : 'group-hover:scale-105'
              }`}
            src={product.image.url}
          />
          {/* Secondary Image (shown on hover) */}
          {product.secondaryImage && (
            <img
              alt={product.secondaryImage.description}
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              src={product.secondaryImage.url}
            />
          )}
        </div>
        <div className="border-t border-gray-200 text-left">
          <h3 className="font-serif text-lg text-gray-900 mb-1 truncate px-4 pt-4">{product.productName}</h3>
          <p className="text-sm text-gray-400 mb-4 px-4">
            {product.sizes?.map((s) => s.value).join(" / ") || "\u00A0"}
          </p>
          <div className="relative h-8 overflow-hidden px-4">
            <p className="text-sm text-gray-900 font-serif transition-all duration-300 group-hover:-translate-y-full">
              {product.priceTitle}
            </p>
            <button
              className="w-full h-full text-sm text-white bg-black font-serif absolute inset-0 transition-all duration-300 translate-y-full group-hover:translate-y-0 flex items-center justify-center decoration-1 underline-offset-4"
              onClick={handleAddToCart}
            >
              Add to cart — {formatCurrencyFromCents(product.quickCartPrice, { symbol: '$' })}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export { ProductCard }