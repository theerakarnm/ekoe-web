import { ProductCard } from "~/components/share/product-card"
import type { Product } from "~/lib/services/product.service"
import { transformProductToIProduct } from "~/lib/product-utils"
import { Skeleton } from "~/components/ui/skeleton"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel"

interface BestSellerSectionProps {
  products?: Product[];
  isLoading?: boolean;
  error?: string | null;
}

function BestSellerSection({ products = [], isLoading = false, error = null }: BestSellerSectionProps) {
  // Show loading skeleton
  console.dir(products, { depth: null });

  if (isLoading) {
    return (
      <div className="mx-auto *:mt-16 sm:*:mt-20 md:*:mt-24 mb-8 sm:mb-12 md:mb-16 container px-4 sm:px-6">
        <div className="relative">
          <h2 className="font-serif text-3xl text-left mb-6 sm:mb-8 md:mb-10 ">Our Best Seller</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="w-full aspect-4/5" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error message
  if (error) {
    return (
      <div className="mx-auto *:mt-16 sm:*:mt-20 md:*:mt-24 mb-8 sm:mb-12 md:mb-16 container px-4 sm:px-6">
        <div className="relative">
          <h2 className="font-serif text-3xl text-left mb-6 sm:mb-8 md:mb-10 ">Our Best Seller</h2>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Unable to load products at this time.</p>
            <p className="text-sm text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (products.length === 0) {
    return (
      <div className="mx-auto *:mt-16 sm:*:mt-20 md:*:mt-24 mb-8 sm:mb-12 md:mb-16 container px-4 sm:px-6">
        <div className="relative">
          <h2 className="font-serif text-3xl text-left mb-6 sm:mb-8 md:mb-10 ">Our Best Seller</h2>
          <div className="text-center py-12">
            <p className="text-gray-600">No products available at this time.</p>
          </div>
        </div>
      </div>
    );
  }

  // Transform products for display
  const displayProducts = products.map(p => transformProductToIProduct(p));

  return (
    <div className="mx-auto *:mt-16 sm:*:mt-20 md:*:mt-24 mb-8 sm:mb-12 md:mb-16 container px-4 sm:px-6">
      <div className="relative">
        <h2 className="font-serif text-3xl text-left mb-6 sm:mb-8 md:mb-10 ">Our Best Seller</h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
            slidesToScroll: 1,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 sm:-ml-3 md:-ml-4">
            {displayProducts.map((product) => (
              <CarouselItem
                key={product.productId}
                className="pl-2 sm:pl-3 md:pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex left-2 cursor-pointer" />
          <CarouselNext className="hidden sm:flex right-2 cursor-pointer" />
        </Carousel>
      </div>
    </div>
  )
}

export {
  BestSellerSection
}