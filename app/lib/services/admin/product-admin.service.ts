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
  sortOrder: number;
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
    image?: string;
  };
  howToUse?: {
    steps: { title: string; description: string; icon?: string }[];
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
  whyItWorks?: string;
  feelsLike?: string;
  smellsLike?: string;
  goodFor?: string;
  realUserReviews?: {
    image?: string;
    content?: string;
  };
  setItems?: {
    setProductId: string;
    includedProductId: string;
    quantity: number;
    sortOrder: number;
  }[];
  benefits?: string[];
  // CTA Hero Section
  ctaBackgroundUrl?: string;
  ctaBackgroundType?: 'image' | 'video';
  // Scrolling Experience
  scrollingExperience?: {
    id: string;
    title: string;
    imageUrl?: string;
  }[];
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
  isSecondary: boolean;
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  variantType: string; // e.g., "Size", "Color", "Volume"
  sku?: string;
  name: string;
  value: string;
  price: number;
  compareAtPrice?: number | null;
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

/**
 * Get all available tags
 */
export async function getTags(headers?: HeadersInit): Promise<Tag[]> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<Tag[]>>('/api/admin/tags', getAxiosConfig(headers));
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
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
  options: {
    altText?: string;
    description?: string;
    sortOrder?: number;
    isPrimary?: boolean;
  } = {},
  headers?: HeadersInit
): Promise<ProductImage> {
  try {
    const formData = new FormData();
    formData.append('image', file);

    if (options.altText) formData.append('altText', options.altText);
    if (options.description) formData.append('description', options.description);
    if (options.sortOrder !== undefined) formData.append('sortOrder', options.sortOrder.toString());
    if (options.isPrimary !== undefined) formData.append('isPrimary', String(options.isPrimary));

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

/**
 * Update a product image
 */
export async function updateProductImage(
  productId: string,
  imageId: string,
  data: {
    altText?: string;
    description?: string;
    sortOrder?: number;
    isPrimary?: boolean;
    isSecondary?: boolean;
  },
  headers?: HeadersInit
): Promise<ProductImage> {
  try {
    const response = await apiClient.put<SuccessResponseWrapper<ProductImage>>(
      `/api/admin/products/${productId}/images/${imageId}`,
      data,
      getAxiosConfig(headers)
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Delete a product image
 */
export async function deleteProductImage(
  productId: string,
  imageId: string,
  headers?: HeadersInit
): Promise<void> {
  try {
    await apiClient.delete(
      `/api/admin/products/${productId}/images/${imageId}`,
      getAxiosConfig(headers)
    );
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Upload a generic image (for ingredients, complimentary gifts, real user reviews, etc.)
 * Returns the uploaded image URL
 */
export async function uploadGenericImage(
  file: File,
  headers?: HeadersInit
): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const config = getAxiosConfig(headers);
    config.headers = {
      ...config.headers,
      'Content-Type': 'multipart/form-data',
    };

    const response = await apiClient.post<SuccessResponseWrapper<{ url: string }>>(
      `/api/admin/upload-image`,
      formData,
      config
    );
    return response.data.data.url;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Variant CRUD functions
export async function getProductVariants(
  productId: string,
  headers?: HeadersInit
): Promise<ProductVariant[]> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<ProductVariant[]>>(
      `/api/admin/products/${productId}/variants`,
      getAxiosConfig(headers)
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function createProductVariant(
  productId: string,
  data: Omit<ProductVariant, 'id' | 'productId' | 'createdAt' | 'updatedAt'>,
  headers?: HeadersInit
): Promise<ProductVariant> {
  try {
    const response = await apiClient.post<SuccessResponseWrapper<ProductVariant>>(
      `/api/admin/products/${productId}/variants`,
      data,
      getAxiosConfig(headers)
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateProductVariant(
  productId: string,
  variantId: string,
  data: Partial<Omit<ProductVariant, 'id' | 'productId' | 'createdAt' | 'updatedAt'>>,
  headers?: HeadersInit
): Promise<ProductVariant> {
  try {
    const response = await apiClient.put<SuccessResponseWrapper<ProductVariant>>(
      `/api/admin/products/${productId}/variants/${variantId}`,
      data,
      getAxiosConfig(headers)
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function deleteProductVariant(
  productId: string,
  variantId: string,
  headers?: HeadersInit
): Promise<void> {
  try {
    await apiClient.delete(
      `/api/admin/products/${productId}/variants/${variantId}`,
      getAxiosConfig(headers)
    );
  } catch (error) {
    throw handleApiError(error);
  }
}

// ============================================================================
// Sequence/Sort Order Functions
// ============================================================================

/**
 * Update a single product's sort order/sequence
 */
export async function updateProductSequence(
  productId: string,
  sortOrder: number,
  headers?: HeadersInit
): Promise<Product> {
  try {
    const response = await apiClient.patch<SuccessResponseWrapper<Product>>(
      `/api/admin/products/${productId}/sequence`,
      { sortOrder },
      getAxiosConfig(headers)
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Bulk update product sequences (for drag-and-drop reordering)
 */
export async function updateProductSequences(
  updates: { productId: string; sortOrder: number }[],
  headers?: HeadersInit
): Promise<{ updated: number }> {
  try {
    const response = await apiClient.patch<SuccessResponseWrapper<{ updated: number }>>(
      '/api/admin/products/sequences',
      { updates },
      getAxiosConfig(headers)
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
