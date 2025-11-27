/**
 * Admin Product Service
 * Handles all admin product management API calls
 */

import { apiClient, handleApiError, getAxiosConfig, type PaginatedResponse, type SuccessResponseWrapper } from '~/lib/api-client';

// ============================================================================
// Types
// ============================================================================

export interface Product {
  id: string;
  name: string;
  slug: string;
  subtitle?: string;
  description?: string;
  shortDescription?: string;
  basePrice: number;
  compareAtPrice?: number;
  productType: 'single' | 'set' | 'bundle';
  status: 'draft' | 'active' | 'archived';
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  rating: string;
  reviewCount: number;
  viewCount: number;
  soldCount: number;
  trackInventory: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
  categories?: Category[];
  tags?: Tag[];
  ingredients?: {
    keyIngredients: { name: string; description: string }[];
    fullList: string;
  };
  howToUse?: {
    steps: { title: string; description: string; icon?: string }[];
    note?: string;
  };
  complimentaryGift?: {
    name: string;
    description: string;
    image: string;
    value?: string;
  };
  whyItWorks?: string;
  goodFor?: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText?: string;
  description?: string;
  variantId?: number;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku?: string;
  name: string;
  value: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  lowStockThreshold: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get paginated list of products with optional filtering and sorting
 */
export async function getProducts(
  params: GetProductsParams = {},
  headers?: HeadersInit
): Promise<PaginatedResponse<Product>> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<PaginatedResponse<Product>>>('/api/admin/products', {
      params,
      ...getAxiosConfig(headers)
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get a single product by ID
 */
export async function getProduct(id: string, headers?: HeadersInit): Promise<Product> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<Product>>(`/api/admin/products/${id}`, getAxiosConfig(headers));
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Create a new product
 */
export async function createProduct(data: Partial<Product>, headers?: HeadersInit): Promise<Product> {
  try {
    const response = await apiClient.post<SuccessResponseWrapper<Product>>('/api/admin/products', data, getAxiosConfig(headers));
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Update an existing product
 */
export async function updateProduct(
  id: string,
  data: Partial<Product>,
  headers?: HeadersInit
): Promise<Product> {
  try {
    const response = await apiClient.put<SuccessResponseWrapper<Product>>(`/api/admin/products/${id}`, data, getAxiosConfig(headers));
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Delete a product (soft delete)
 */
export async function deleteProduct(id: string, headers?: HeadersInit): Promise<void> {
  try {
    await apiClient.delete(`/api/admin/products/${id}`, getAxiosConfig(headers));
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Upload a product image
 */
export async function uploadProductImage(
  productId: string,
  file: File,
  headers?: HeadersInit
): Promise<ProductImage> {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const config = getAxiosConfig(headers);
    config.headers = {
      ...config.headers,
      'Content-Type': 'multipart/form-data',
    };

    const response = await apiClient.post<SuccessResponseWrapper<ProductImage>>(
      `/api/admin/products/${productId}/images`,
      formData,
      config
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
