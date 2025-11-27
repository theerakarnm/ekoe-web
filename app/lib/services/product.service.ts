/**
 * Public Product Service
 * Handles all public product-related API calls
 */

import { apiClient, handleApiError, type PaginatedResponse, type SuccessResponseWrapper } from '../api-client';

// ============================================================================
// Types
// ============================================================================

/**
 * Product variant (size, color, etc.)
 */
export interface ProductVariant {
  id: string;
  productId: string;
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

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get a paginated list of products
 * 
 * @param params - Query parameters for filtering and pagination
 * @returns Paginated list of products
 */
export async function getProducts(params: GetProductsParams = {}): Promise<PaginatedResponse<Product>> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await apiClient.get<SuccessResponseWrapper<PaginatedResponse<Product>>>(
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
      `/api/products/related/${productId}?limit=${limit}`
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
      sortBy: 'soldCount',
      sortOrder: 'desc',
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
