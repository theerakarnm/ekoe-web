import type { IProduct } from "~/interface/product.interface"

function ProductCard({ product }: { product: IProduct }) {
  return (
    <div className="shrink-0 w-3/4 sm:w-1/3 lg:w-1/4 hover:bg-gray-100 transition-all rounded-b pb-2">
      <div className="bg-secondary-light dark:bg-secondary-dark rounded">
        <img alt={product.image.description} className="w-full h-auto object-cover rounded-t" src={product.image.url} />
      </div>
      <div className="mt-4 text-center">
        <h3 className="font-serif text-xl mb-1">{product.productName}</h3>
        <p className="text-sm text-gray-400 dark:text-gray-400 mb-2">50 ml. / 120 ml.</p>
        <p className="text-sm text-text-light/70 font-serif">{product.priceTitle}</p>
      </div>
      {/* Quick cart price when hover */}
      <div className="w-full bg-black py-1 flex justify-center items-center">
        <span className="text-white font-serif text-sm">
          {product.quickCartPrice}
        </span>
      </div>
    </div>
  )
}

export { ProductCard }