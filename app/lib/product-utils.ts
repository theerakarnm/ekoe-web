/**
 * Shared product transformation utilities
 * Used to convert API Product objects to IProduct format for ProductCard components
 */

import type { Product } from '~/lib/services/product.service';
import type { IProduct } from '~/interface/product.interface';
import { formatCurrencyFromCents } from '~/lib/formatter';

/**
 * Options for transforming a Product to IProduct
 */
export interface TransformProductOptions {
  /**
   * Whether to include variant sizes in the output
   * @default true
   */
  includeSizes?: boolean;

  /**
   * Whether to include subtitle, rating, and reviewCount
   * @default false
   */
  includeExtendedInfo?: boolean;

  /**
   * How to calculate prices from variants
   * - 'price': Use variant price (default for shop page)
   * - 'compareAtPrice': Use compareAtPrice with fallback to price
   * - 'compareAtPriceOnly': Use compareAtPrice only (falls back to 0 if not set)
   * @default 'compareAtPrice'
   */
  priceStrategy?: 'price' | 'compareAtPrice' | 'compareAtPriceOnly';

  /**
   * Fallback image URL when no product image is available
   * @default '/placeholder-product.jpg'
   */
  fallbackImageUrl?: string;
}

const DEFAULT_OPTIONS: Required<TransformProductOptions> = {
  includeSizes: true,
  includeExtendedInfo: false,
  priceStrategy: 'compareAtPrice',
  fallbackImageUrl: '/placeholder-product.jpg',
};

/**
 * Transform an API Product to IProduct format for ProductCard
 * 
 * @param product - The API Product object
 * @param options - Optional configuration for the transformation
 * @returns IProduct formatted for ProductCard component
 */
export function transformProductToIProduct(
  product: Product,
  options: TransformProductOptions = {}
): IProduct {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Get primary and secondary images
  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
  const secondaryImage = product.images?.find(img => img.isSecondary)
    || product.images?.find(img => !img.isPrimary && img.url !== primaryImage?.url)
    || (product.images && product.images.length > 1 ? product.images[1] : undefined);

  const variants = product.variants || [];

  // Calculate price title based on strategy
  let priceTitle: string;
  if (variants.length > 0) {
    const prices = variants.map(v => {
      switch (opts.priceStrategy) {
        case 'price':
          return v.price;
        case 'compareAtPriceOnly':
          return v.compareAtPrice || 0;
        case 'compareAtPrice':
        default:
          return v.compareAtPrice || v.price;
      }
    });

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

  // Calculate quickCartPrice - always use first variant price or base price
  const quickCartPrice = variants.length > 0
    ? (opts.priceStrategy === 'price' ? Math.min(...variants.map(v => v.price)) : variants[0]?.price)
    : product.basePrice;

  // Map variants to sizes if enabled
  const sizes = opts.includeSizes
    ? variants.map(v => ({
      label: v.name,
      value: v.id,
      price: v.price
    }))
    : undefined;

  // Build the result object
  const result: IProduct = {
    productId: product.id,
    image: {
      description: primaryImage?.altText || primaryImage?.description || product.name,
      url: primaryImage?.url || opts.fallbackImageUrl,
    },
    secondaryImage: secondaryImage
      ? {
        description: secondaryImage.altText || secondaryImage.description || product.name,
        url: secondaryImage.url,
      }
      : undefined,
    productName: product.name,
    priceTitle,
    quickCartPrice: quickCartPrice || product.basePrice,
    sizes,
    slug: product.slug,
  };

  // Add extended info if requested
  if (opts.includeExtendedInfo) {
    result.subtitle = product.subtitle ?? undefined;
    result.rating = parseFloat(product.rating || '0') || 0;
    result.reviewCount = product.reviewCount;
  }

  return result;
}
