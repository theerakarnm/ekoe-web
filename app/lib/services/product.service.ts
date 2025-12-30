/**
 * Public Product Service
 * Handles all public product-related API calls
 */

import { apiClient, handleApiError, type SuccessResponseWrapper } from '../api-client';

// ============================================================================
// Types
// ============================================================================

/**
 * Product variant (size, color, etc.)
 */
export interface ProductVariant {
  id: string;
  productId: string;
  variantType: string; // e.g., "Size", "Color", "Volume"
  sku: string | null;
  name: string;
  value: string;
  price: number; // in cents
  compareAtPrice: number | null;
  stockQuantity: number;
  lowStockThreshold: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Product image
 */
export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText: string | null;
  description: string | null;
  variantId: string | null;
  sortOrder: number;
  isPrimary: boolean;
  isSecondary: boolean;
  mediaType?: 'image' | 'video';
  createdAt: string;
}

/**
 * Product data structure
 */
export interface Product {
  id: string;
  name: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  shortDescription: string | null;
  basePrice: number; // in cents
  compareAtPrice: number | null;
  productType: 'single' | 'set' | 'bundle';
  status: 'draft' | 'active' | 'archived';
  featured: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  rating: string | null;
  reviewCount: number;
  viewCount: number;
  soldCount: number;
  trackInventory: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  deletedAt: string | null;
  variants?: ProductVariant[];
  images?: ProductImage[];
  // Additional product details
  ingredients?: {
    keyIngredients?: { name: string; description: string }[];
    fullList?: string;
    image?: string;
  };
  howToUse?: {
    steps?: { title: string; description: string; icon?: string }[];
    proTips?: string[];
    note?: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
  };
  complimentaryGift?: {
    name?: string;
    description?: string;
    image?: string;
    value?: string;
  };
  goodFor?: string;
  whyItWorks?: string;
  feelsLike?: string;
  smellsLike?: string;
  realUserReviews?: {
    image?: string;
    content?: string;
  };
  // Product set data
  setItems?: {
    productId: string;
    name: string;
    description: string | null;
    subtitle: string | null;
    image: string | null;
    quantity: number | null;
  }[];
  benefits?: string[];
  tags?: {
    id: string;
    name: string;
    slug: string;
  }[];
  // CTA Hero Section
  ctaBackgroundUrl?: string;
  ctaBackgroundType?: 'image' | 'video';
  // Scrolling Experience
  scrollingExperience?: {
    id: string;
    title: string;
    imageUrl?: string;
  }[];
  // Category for breadcrumb
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

/**
 * Query parameters for getting products
 */
export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'name' | 'basePrice' | 'soldCount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Product filter parameters for advanced filtering
 */
export interface ProductFilterParams {
  search?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  productType?: 'single' | 'set' | 'bundle';
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated products response with pagination metadata
 */
export interface PaginatedProducts {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Product category
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

/**
 * Price range for filtering
 */
export interface PriceRange {
  min: number;
  max: number;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get a paginated list of products with advanced filtering
 * 
 * @param params - Query parameters for filtering and pagination
 * @returns Paginated list of products with pagination metadata
 */
export async function getProducts(params: ProductFilterParams = {}): Promise<PaginatedProducts> {
  try {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append('search', params.search);
    if (params.categories?.length) queryParams.append('categories', params.categories.join(','));
    if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params.productType) queryParams.append('productType', params.productType);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await apiClient.get<SuccessResponseWrapper<PaginatedProducts>>(
      `/api/products?${queryParams.toString()}`
    );

    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Get a single product by ID
 * 
 * @param id - Product ID
 * @returns Product details with variants and images
 */
export async function getProduct(id: string): Promise<Product> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<Product>>(
      `/api/products/${id}`
    );

    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Get related products for a given product
 * 
 * @param productId - Product ID to find related products for
 * @param limit - Maximum number of related products to return (default: 4)
 * @returns Array of related products
 */
export async function getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<Product[]>>(
      `/api/products/${productId}/related?limit=${limit}`
    );

    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Frequently bought together bundle
 */
export interface FrequentlyBoughtTogether {
  products: Product[];
  totalPrice: number;
  savings: number;
}

/**
 * Get frequently bought together products for a given product
 * 
 * @param productId - Product ID to find frequently bought together products for
 * @returns Bundle object with products, totalPrice, and savings
 */
export async function getFrequentlyBoughtTogether(productId: string): Promise<FrequentlyBoughtTogether> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<FrequentlyBoughtTogether>>(
      `/api/products/${productId}/frequently-bought-together`
    );

    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Get best-selling products
 * Helper function that fetches products sorted by sold count
 * 
 * @param limit - Maximum number of products to return (default: 8)
 * @returns Array of best-selling products
 */
export async function getBestSellers(limit: number = 8): Promise<Product[]> {
  try {
    const result = await getProducts({
      limit,
    });

    return result.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Get newest products (new arrivals)
 * Helper function that fetches products sorted by creation date
 * 
 * @param limit - Maximum number of products to return (default: 8)
 * @returns Array of newest products
 */
export async function getNewArrivals(limit: number = 8): Promise<Product[]> {
  try {
    const result = await getProducts({
      sortBy: 'createdAt',
      sortOrder: 'desc',
      limit,
    });

    return result.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Get all product categories
 * 
 * @returns Array of categories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<Category[]>>(
      '/api/products/categories'
    );

    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Get price range for filters
 * 
 * @returns Price range object with min and max prices
 */
export async function getPriceRange(): Promise<PriceRange> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<PriceRange>>(
      '/api/products/price-range'
    );

    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Coupon data for product detail page
 */
export interface LinkedCoupon {
  code: string;
  title: string;
  description: string | null;
  discountType: 'percentage' | 'fixed_amount' | 'free_shipping';
  discountValue: number;
  minPurchaseAmount?: number;
}

/**
 * Get coupons linked to a specific product
 */
export async function getLinkedCoupons(productId: string): Promise<LinkedCoupon[]> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<LinkedCoupon[]>>(
      `/api/coupons/by-product/${productId}`
    );
    return response.data.data;
  } catch (error) {
    // Don't throw, just return empty array for coupons
    return [];
  }
}
