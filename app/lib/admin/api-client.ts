/**
 * Admin API Client
 * Provides wrapper functions for all admin CRUD operations with error handling and authentication
 */

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

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      const errorData: ApiError = await response.json();
      
      // Handle authentication errors
      if (response.status === 401) {
        window.location.href = '/admin/login';
        throw new ApiClientError('Unauthorized', 401);
      }
      
      // Handle validation errors
      if (response.status === 422) {
        throw new ApiClientError(
          errorData.message || 'Validation failed',
          422,
          errorData.code,
          errorData.field,
          errorData.errors
        );
      }
      
      // Generic error
      throw new ApiClientError(
        errorData.message || 'An error occurred',
        response.status,
        errorData.code
      );
    }
    
    // Non-JSON error response
    throw new ApiClientError(
      `Request failed with status ${response.status}`,
      response.status
    );
  }
  
  return response.json();
}

// ============================================================================
// Dashboard API
// ============================================================================

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const response = await fetch('/api/admin/dashboard/metrics', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return handleResponse<DashboardMetrics>(response);
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
  params: GetProductsParams = {}
): Promise<PaginatedResponse<Product>> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.search) searchParams.set('search', params.search);
  if (params.status) searchParams.set('status', params.status);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  
  const response = await fetch(`/api/admin/products?${searchParams}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return handleResponse<PaginatedResponse<Product>>(response);
}

export async function getProduct(id: number): Promise<Product> {
  const response = await fetch(`/api/admin/products/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return handleResponse<Product>(response);
}

export async function createProduct(data: Partial<Product>): Promise<Product> {
  const response = await fetch('/api/admin/products', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  return handleResponse<Product>(response);
}

export async function updateProduct(
  id: number,
  data: Partial<Product>
): Promise<Product> {
  const response = await fetch(`/api/admin/products/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  return handleResponse<Product>(response);
}

export async function deleteProduct(id: number): Promise<void> {
  const response = await fetch(`/api/admin/products/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return handleResponse<void>(response);
}

export async function uploadProductImage(
  productId: number,
  file: File
): Promise<ProductImage> {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch(`/api/admin/products/${productId}/images`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  
  return handleResponse<ProductImage>(response);
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
  params: GetBlogPostsParams = {}
): Promise<PaginatedResponse<BlogPost>> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.search) searchParams.set('search', params.search);
  if (params.status) searchParams.set('status', params.status);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  
  const response = await fetch(`/api/admin/blog?${searchParams}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return handleResponse<PaginatedResponse<BlogPost>>(response);
}

export async function getBlogPost(id: number): Promise<BlogPost> {
  const response = await fetch(`/api/admin/blog/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return handleResponse<BlogPost>(response);
}

export async function createBlogPost(data: Partial<BlogPost>): Promise<BlogPost> {
  const response = await fetch('/api/admin/blog', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  return handleResponse<BlogPost>(response);
}

export async function updateBlogPost(
  id: number,
  data: Partial<BlogPost>
): Promise<BlogPost> {
  const response = await fetch(`/api/admin/blog/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  return handleResponse<BlogPost>(response);
}

export async function deleteBlogPost(id: number): Promise<void> {
  const response = await fetch(`/api/admin/blog/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return handleResponse<void>(response);
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
  params: GetDiscountCodesParams = {}
): Promise<PaginatedResponse<DiscountCode>> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.search) searchParams.set('search', params.search);
  if (params.status) searchParams.set('status', params.status);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  
  const response = await fetch(`/api/admin/coupons?${searchParams}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return handleResponse<PaginatedResponse<DiscountCode>>(response);
}

export async function getDiscountCode(id: number): Promise<DiscountCode> {
  const response = await fetch(`/api/admin/coupons/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return handleResponse<DiscountCode>(response);
}

export async function createDiscountCode(
  data: Partial<DiscountCode>
): Promise<DiscountCode> {
  const response = await fetch('/api/admin/coupons', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  return handleResponse<DiscountCode>(response);
}

export async function updateDiscountCode(
  id: number,
  data: Partial<DiscountCode>
): Promise<DiscountCode> {
  const response = await fetch(`/api/admin/coupons/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  return handleResponse<DiscountCode>(response);
}

export async function deactivateDiscountCode(id: number): Promise<void> {
  const response = await fetch(`/api/admin/coupons/${id}/deactivate`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return handleResponse<void>(response);
}

export async function getCouponUsageStats(id: number): Promise<CouponUsageStats> {
  const response = await fetch(`/api/admin/coupons/${id}/stats`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return handleResponse<CouponUsageStats>(response);
}
