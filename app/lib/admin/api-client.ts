/**
 * Admin API Client
 * Provides wrapper functions for all admin CRUD operations with error handling and authentication
 */

import { redirect } from "react-router";
import axios, { type AxiosRequestConfig } from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

// Create Axios instance
const apiClient = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================================
// Types
// ============================================================================

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  ordersByStatus: {
    status: string;
    count: number;
  }[];
  revenueByDate: {
    date: string;
    revenue: number;
  }[];
}

export interface Product {
  id: number;
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
  id: number;
  productId: number;
  url: string;
  altText?: string;
  description?: string;
  variantId?: number;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: string;
}

export interface ProductVariant {
  id: number;
  productId: number;
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
  id: number;
  name: string;
  slug: string;
  description?: string;
  parentId?: number;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  authorId?: number;
  authorName?: string;
  categoryId?: number;
  categoryName?: string;
  metaTitle?: string;
  metaDescription?: string;
  status: 'draft' | 'published' | 'archived';
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface DiscountCode {
  id: number;
  code: string;
  title: string;
  description?: string;
  discountType: 'percentage' | 'fixed_amount' | 'free_shipping';
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageLimitPerCustomer: number;
  currentUsageCount: number;
  applicableToProducts?: number[];
  applicableToCategories?: number[];
  isActive: boolean;
  startsAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CouponUsageStats {
  totalUses: number;
  uniqueCustomers: number;
  totalDiscountAmount: number;
  averageOrderValue: number;
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
  }
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

      console.log({
        status,
        data
      });


      // Handle authentication errors
      if (status === 401) {
        if (typeof window === 'undefined') {
          throw redirect("/admin/login");
        } else {
          window.location.href = '/admin/login';
          throw new ApiClientError('Unauthorized', 401);
        }
      }

      // Handle validation errors
      if (status === 422) {
        throw new ApiClientError(
          data.message || 'Validation failed',
          422,
          data.code,
          data.field,
          data.errors
        );
      }

      // Generic error
      throw new ApiClientError(
        data.message || error.message || 'An error occurred',
        status,
        data.code
      );
    }

    // Network error or no response
    throw new ApiClientError(
      error.message || 'Network error',
      0
    );
  }

  // Non-Axios error
  if (error instanceof Error) {
    throw new ApiClientError(error.message, 500);
  }

  throw new ApiClientError('An unknown error occurred', 500);
}

// Helper to merge headers
function getAxiosConfig(headers?: HeadersInit): AxiosRequestConfig {
  if (!headers) return {};

  // Convert HeadersInit to Axios headers
  const axiosHeaders: Record<string, string> = {};

  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      axiosHeaders[key] = value;
    });
  } else if (Array.isArray(headers)) {
    headers.forEach(([key, value]) => {
      axiosHeaders[key] = value;
    });
  } else {
    Object.assign(axiosHeaders, headers);
  }

  return { headers: axiosHeaders };
}

// ============================================================================
// Dashboard API
// ============================================================================

export async function getDashboardMetrics(headers?: HeadersInit): Promise<DashboardMetrics> {
  try {
    const response = await apiClient.get<DashboardMetrics>('/api/admin/dashboard/metrics', getAxiosConfig(headers));
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
}

// ============================================================================
// Products API
// ============================================================================

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

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
    throw handleAxiosError(error);
  }
}

export async function getProduct(id: number, headers?: HeadersInit): Promise<Product> {
  try {
    const response = await apiClient.get<Product>(`/api/admin/products/${id}`, getAxiosConfig(headers));
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
}

export async function createProduct(data: Partial<Product>): Promise<Product> {
  try {
    const response = await apiClient.post<Product>('/api/admin/products', data);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
}

export async function updateProduct(
  id: number,
  data: Partial<Product>
): Promise<Product> {
  try {
    const response = await apiClient.put<Product>(`/api/admin/products/${id}`, data);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
}

export async function deleteProduct(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/admin/products/${id}`);
  } catch (error) {
    throw handleAxiosError(error);
  }
}

export async function uploadProductImage(
  productId: number,
  file: File
): Promise<ProductImage> {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post<ProductImage>(`/api/admin/products/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
}

// ============================================================================
// Blog API
// ============================================================================

export interface GetBlogPostsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export async function getBlogPosts(
  params: GetBlogPostsParams = {},
  headers?: HeadersInit
): Promise<PaginatedResponse<BlogPost>> {
  try {
    const response = await apiClient.get<PaginatedResponse<BlogPost>>('/api/admin/blog', {
      params,
      ...getAxiosConfig(headers)
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
}

export async function getBlogPost(id: number, headers?: HeadersInit): Promise<BlogPost> {
  try {
    const response = await apiClient.get<BlogPost>(`/api/admin/blog/${id}`, getAxiosConfig(headers));
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
}

export async function createBlogPost(data: Partial<BlogPost>): Promise<BlogPost> {
  try {
    const response = await apiClient.post<BlogPost>('/api/admin/blog', data);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
}

export async function updateBlogPost(
  id: number,
  data: Partial<BlogPost>
): Promise<BlogPost> {
  try {
    const response = await apiClient.put<BlogPost>(`/api/admin/blog/${id}`, data);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
}

export async function deleteBlogPost(id: number): Promise<void> {
  try {
    await apiClient.delete(`/api/admin/blog/${id}`);
  } catch (error) {
    throw handleAxiosError(error);
  }
}

// ============================================================================
// Coupons API
// ============================================================================

export interface GetDiscountCodesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export async function getDiscountCodes(
  params: GetDiscountCodesParams = {},
  headers?: HeadersInit
): Promise<PaginatedResponse<DiscountCode>> {
  try {
    const response = await apiClient.get<PaginatedResponse<DiscountCode>>('/api/admin/coupons', {
      params,
      ...getAxiosConfig(headers)
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
}

export async function getDiscountCode(id: number, headers?: HeadersInit): Promise<DiscountCode> {
  try {
    const response = await apiClient.get<DiscountCode>(`/api/admin/coupons/${id}`, getAxiosConfig(headers));
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
}

export async function createDiscountCode(
  data: Partial<DiscountCode>
): Promise<DiscountCode> {
  try {
    const response = await apiClient.post<DiscountCode>('/api/admin/coupons', data);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
}

export async function updateDiscountCode(
  id: number,
  data: Partial<DiscountCode>
): Promise<DiscountCode> {
  try {
    const response = await apiClient.put<DiscountCode>(`/api/admin/coupons/${id}`, data);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
}

export async function deactivateDiscountCode(id: number): Promise<void> {
  try {
    await apiClient.patch(`/api/admin/coupons/${id}/deactivate`);
  } catch (error) {
    throw handleAxiosError(error);
  }
}

export async function getCouponUsageStats(id: number, headers?: HeadersInit): Promise<CouponUsageStats> {
  try {
    const response = await apiClient.get<CouponUsageStats>(`/api/admin/coupons/${id}/stats`, getAxiosConfig(headers));
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
}
