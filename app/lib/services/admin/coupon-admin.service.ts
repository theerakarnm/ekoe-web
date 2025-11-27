/**
 * Admin Coupon Service
 * Handles all admin coupon/discount code management API calls
 */

import { apiClient, handleApiError, getAxiosConfig, type PaginatedResponse, type SuccessResponseWrapper } from '~/lib/api-client';

// ============================================================================
// Types
// ============================================================================

export interface DiscountCode {
  id: string;
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
  applicableToProducts?: string[];
  applicableToCategories?: string[];
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
  recentOrders?: Array<{
    orderId: string;
    orderNumber: string;
    customerEmail: string;
    discountAmount: number;
    orderTotal: number;
    createdAt: string;
  }>;
}

export interface GetDiscountCodesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  discountType?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get paginated list of discount codes with optional filtering and sorting
 */
export async function getDiscountCodes(
  params: GetDiscountCodesParams = {},
  headers?: HeadersInit
): Promise<PaginatedResponse<DiscountCode>> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<PaginatedResponse<DiscountCode>>>('/api/admin/coupons', {
      params,
      ...getAxiosConfig(headers)
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get a single discount code by ID
 */
export async function getDiscountCode(id: string, headers?: HeadersInit): Promise<DiscountCode> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<DiscountCode>>(`/api/admin/coupons/${id}`, getAxiosConfig(headers));
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Create a new discount code
 */
export async function createDiscountCode(
  data: Partial<DiscountCode>,
  headers?: HeadersInit
): Promise<DiscountCode> {
  try {
    const response = await apiClient.post<SuccessResponseWrapper<DiscountCode>>('/api/admin/coupons', data, getAxiosConfig(headers));
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Update an existing discount code
 */
export async function updateDiscountCode(
  id: string,
  data: Partial<DiscountCode>,
  headers?: HeadersInit
): Promise<DiscountCode> {
  try {
    const response = await apiClient.put<SuccessResponseWrapper<DiscountCode>>(`/api/admin/coupons/${id}`, data, getAxiosConfig(headers));
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Deactivate a discount code
 */
export async function deactivateDiscountCode(id: string, headers?: HeadersInit): Promise<void> {
  try {
    await apiClient.patch(`/api/admin/coupons/${id}/deactivate`, {}, getAxiosConfig(headers));
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get usage statistics for a discount code
 */
export async function getCouponUsageStats(id: string, headers?: HeadersInit): Promise<CouponUsageStats> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<CouponUsageStats>>(`/api/admin/coupons/${id}/stats`, getAxiosConfig(headers));
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
