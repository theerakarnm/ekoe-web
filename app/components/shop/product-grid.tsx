import { PackageOpen } from "lucide-react";
import { ProductCard } from "~/components/share/product-card";
import { Skeleton } from "~/components/ui/skeleton";
import type { IProduct } from "~/interface/product.interface";

interface ProductGridProps {
  products: IProduct[];
  loading?: boolean;
}

export function ProductGrid({ products, loading = false }: ProductGridProps) {
  // Loading state - show skeleton loaders
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
        {Array.from({ length: 24 }).map((_, index) => (
          <ProductGridSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Empty state - no products found
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-gray-100 rounded-full p-6 mb-6">
          <PackageOpen className="h-16 w-16 text-gray-400" />
        </div>
        <h3 className="text-xl font-serif text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600 text-center max-w-md mb-6">
          We couldn't find any products matching your search criteria.
        </p>
        <div className="text-sm text-gray-500 text-center">
          <p className="mb-2">Try adjusting your filters or search terms:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Clear some filters to see more results</li>
            <li>Try different keywords</li>
            <li>Check your spelling</li>
          </ul>
        </div>
      </div>
    );
  }

  // Product grid - display products
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  );
}

/**
 * Skeleton loader for product card
 */
function ProductGridSkeleton() {
  return (
    <div className="w-full bg-white border border-gray-200">
      {/* Image skeleton */}
      <Skeleton className="w-full aspect-4/5" />
      
      {/* Content skeleton */}
      <div className="border-t border-gray-200 p-4">
        {/* Product name */}
        <Skeleton className="h-6 w-3/4 mb-2" />
        
        {/* Subtitle */}
        <Skeleton className="h-4 w-1/2 mb-4" />
        
        {/* Price */}
        <Skeleton className="h-5 w-1/3" />
      </div>
    </div>
  );
}
