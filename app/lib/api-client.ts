/**
 * Public API Client
 * Provides wrapper functions for public API endpoints (no authentication required)
 */

import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL;

// Create Axios instance for public API
const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface SuccessResponseWrapper<T> {
  success: boolean;
  data: T;
  meta: {
    timestamp: string;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  errors?: Record<string, string[]>;
}

// ============================================================================
// Error Handling
// ============================================================================

export class ApiClientError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public field?: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

// Helper to handle Axios errors
function handleAxiosError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const response = error.response;

    if (response) {
      const status = response.status;
      const data = response.data as ApiError;

      throw new ApiClientError(
        data.message || error.message || 'An error occurred',
        status,
        data.code
      );
    }

    // Network error or no response
    throw new ApiClientError(error.message || 'Network error', 0);
  }

  // Non-Axios error
  if (error instanceof Error) {
    throw new ApiClientError(error.message, 500);
  }

  throw new ApiClientError('An unknown error occurred', 500);
}

// ============================================================================
// Products API
// ============================================================================

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Fetch a list of products with optional filtering and pagination
 */
export async function getProducts(
  params: GetProductsParams = {}
): Promise<PaginatedResponse<Product>> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<PaginatedResponse<Product>>>(
      '/api/products',
      { params }
    );
    return response.data.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
}

/**
 * Fetch a single product by ID
 */
export async function getProduct(id: string): Promise<Product> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<Product>>(
      `/api/products/${id}`
    );
    return response.data.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
}
