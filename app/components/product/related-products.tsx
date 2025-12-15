import { useState, useEffect } from "react";
import { ProductCard } from "~/components/share/product-card";
import { Skeleton } from "~/components/ui/skeleton";
import type { IProduct } from "~/interface/product.interface";
import type { Product } from "~/lib/services/product.service";
import { getRelatedProducts } from "~/lib/services/product.service";
import { formatCurrencyFromCents } from "~/lib/formatter";

/**
 * Transform API Product to IProduct format for ProductCard
 */
function transformProduct(product: Product): IProduct {
  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
  // Get secondary image (explicitly marked, or first non-primary image)
  const secondaryImage = product.images?.find(img => img.isSecondary)
    || product.images?.find(img => !img.isPrimary && img.url !== primaryImage?.url)
    || (product.images && product.images.length > 1 ? product.images[1] : undefined);
  const variants = product.variants || [];

  // Calculate price range from variants or use base price
  let priceTitle: string;
  if (variants.length > 0) {
    const prices = variants.map(v => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) {
      priceTitle = formatCurrencyFromCents(minPrice);
    } else {
      priceTitle = `${formatCurrencyFromCents(minPrice)} - ${formatCurrencyFromCents(maxPrice)}`;
    }
  } else {
    priceTitle = formatCurrencyFromCents(product.basePrice);
  }

  return {
    productId: product.id,
    image: {
      description: primaryImage?.altText || primaryImage?.description || product.name,
      url: primaryImage?.url || '/placeholder-product.jpg'
    },
    secondaryImage: secondaryImage ? {
      description: secondaryImage.altText || secondaryImage.description || product.name,
      url: secondaryImage.url,
    } : undefined,
    productName: product.name,
    priceTitle,
    quickCartPrice: variants[0]?.price || product.basePrice
  };
}

interface RelatedProductsProps {
  productId: string;
  title?: string;
  limit?: number;
}

/**
 * RelatedProducts Component
 * 
 * Displays a grid of related products based on category and tags.
 * Shows loading skeletons while fetching and hides section if no products found.
 * 
 * @param productId - The ID of the current product to find related products for
 * @param title - Optional custom title (default: "You May Also Like")
 * @param limit - Maximum number of related products to display (default: 4)
 */
export function RelatedProducts({
  productId,
  title = "You May Also Like",
  limit = 4
}: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRelated() {
      try {
        setLoading(true);
        setError(null);
        const products = await getRelatedProducts(productId, limit);
        setRelatedProducts(products);
      } catch (err) {
        console.error('Failed to load related products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load related products');
      } finally {
        setLoading(false);
      }
    }

    fetchRelated();
  }, [productId, limit]);

  // Show loading skeletons
  if (loading) {
    return (
      <div className="py-12">
        <h2 className="text-2xl font-serif mb-8">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="w-full aspect-4/5" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Hide section if no related products found
  if (relatedProducts.length === 0 && !error) {
    return null;
  }

  // Show error state gracefully (but still hide section)
  if (error) {
    console.error('Related products error:', error);
    return null;
  }

  // Transform products for display
  const displayProducts = relatedProducts.map(transformProduct);

  return (
    <div className="py-12">
      <h2 className="text-2xl font-serif mb-8">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {displayProducts.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
    </div>
  );
}
