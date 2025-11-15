import type { IProduct } from "~/interface/product.interface"
import { formatCurrencyFromCents } from "~/lib/formatter"

function ProductCard({ product }: { product: IProduct }) {
  return (
    <div className="w-full hover:bg-gray-100 transition-all rounded-b pb-2 group cursor-pointer">
      <div className="bg-secondary-light dark:bg-secondary-dark rounded">
        <img alt={product.image.description} className="w-full h-auto object-cover rounded-t" src={product.image.url} />
      </div>
      <div className="mt-4 text-center">
        <h3 className="font-serif text-xl mb-1">{product.productName}</h3>
        <p className="text-sm text-gray-400 dark:text-gray-400 mb-2">50 ml. / 120 ml.</p>
        <div className="relative h-8 overflow-hidden">
          <p className="text-sm text-text-light/70 font-serif transition-all duration-300 group-hover:-translate-y-full">
            {product.priceTitle}
          </p>
          <p className="text-sm text-text-light/70 pt-1 bg-black text-white font-serif absolute inset-0 transition-all duration-300 translate-y-full group-hover:translate-y-0">
            Add to cart {formatCurrencyFromCents(product.quickCartPrice)}
          </p>
        </div>
      </div>
    </div>
  )
}

export { ProductCard }