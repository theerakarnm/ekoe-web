/**
 * Admin Promotion Service
 * Handles all admin promotion management API calls
 */

import { apiClient, handleApiError, getAxiosConfig, type PaginatedResponse, type SuccessResponseWrapper } from '~/lib/api-client';

// ============================================================================
// Types
// ============================================================================

export type PromotionType = 'percentage_discount' | 'fixed_discount' | 'free_gift';
export type PromotionStatus = 'draft' | 'scheduled' | 'active' | 'paused' | 'expired';
export type RuleType = 'condition' | 'benefit';
export type ConditionType = 'cart_value' | 'product_quantity' | 'specific_products' | 'category_products';
export type Operator = 'gte' | 'lte' | 'eq' | 'in' | 'not_in';
export type BenefitType = 'percentage_discount' | 'fixed_discount' | 'free_gift';

export interface Promotion {
  id: string;
  name: string;
  description?: string;
  type: PromotionType;
  status: PromotionStatus;
  priority: number;
  startsAt: string;
  endsAt: string;
  usageLimit?: number;
  usageLimitPerCustomer: number;
  currentUsageCount: number;
  exclusiveWith?: string[];
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PromotionRule {
  id: string;
  promotionId: string;
  ruleType: RuleType;
  conditionType?: ConditionType;
  operator?: Operator;
  numericValue?: number;
  textValue?: string;
  jsonValue?: any;
  benefitType?: BenefitType;
  benefitValue?: number;
  maxDiscountAmount?: number;
  applicableProductIds?: string[];
  applicableCategoryIds?: string[];
  giftProductIds?: string[];
  giftQuantities?: number[];
  giftName?: string;
  giftPrice?: number;
  giftImageUrl?: string;
  giftQuantity?: number;
  createdAt: string;
}

export interface PromotionDetail extends Promotion {
  rules: PromotionRule[];
}

export interface PromotionListItem {
  id: string;
  name: string;
  type: PromotionType;
  status: PromotionStatus;
  startsAt: string;
  endsAt: string;
  currentUsageCount: number;
  usageLimit?: number;
  priority: number;
}

export interface PromotionUsageStats {
  totalUsage: number;
  totalDiscount: number;
  totalRevenue: number;
  conversionRate: number;
  averageOrderValue: number;
  topCustomers: Array<{
    customerId: string;
    usageCount: number;
    totalDiscount: number;
  }>;
}

export interface PromotionAnalytics {
  id: string;
  promotionId: string;
  date: string;
  hour?: number;
  views: number;
  applications: number;
  totalDiscountAmount: number;
  totalOrders: number;
  totalRevenue: number;
  conversionRate?: number;
  averageOrderValue?: number;
  createdAt: string;
}

export interface PromotionDashboard {
  totalActive: number;
  totalScheduled: number;
  totalExpired: number;
  recentPromotions: PromotionListItem[];
  upcomingPromotions: PromotionListItem[];
}

export interface CreatePromotionDto {
  name: string;
  description?: string;
  type: PromotionType;
  priority?: number;
  startsAt: string;
  endsAt: string;
  usageLimit?: number;
  usageLimitPerCustomer?: number;
  exclusiveWith?: string[];
}

export interface UpdatePromotionDto extends Partial<CreatePromotionDto> {
  id: string;
}

export interface CreatePromotionRuleDto {
  ruleType: RuleType;
  conditionType?: ConditionType;
  operator?: Operator;
  numericValue?: number;
  textValue?: string;
  jsonValue?: any;
  benefitType?: BenefitType;
  benefitValue?: number;
  maxDiscountAmount?: number;
  applicableProductIds?: string[];
  applicableCategoryIds?: string[];
  giftProductIds?: string[];
  giftQuantities?: number[];
  giftName?: string;
  giftPrice?: number;
  giftImageUrl?: string;
  giftQuantity?: number;
}

export interface GetPromotionsParams {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get promotion dashboard summary
 */
export async function getPromotionDashboard(headers?: HeadersInit): Promise<PromotionDashboard> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<PromotionDashboard>>(
      '/api/promotions/admin/dashboard',
      getAxiosConfig(headers)
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get paginated list of promotions with optional filtering and sorting
 */
export async function getPromotions(
  params: GetPromotionsParams = {},
  headers?: HeadersInit
): Promise<{ promotions: PromotionListItem[]; pagination: any }> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<{ promotions: PromotionListItem[]; pagination: any }>>(
      '/api/promotions',
      {
        params,
        ...getAxiosConfig(headers)
      }
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get a single promotion by ID with rules
 */
export async function getPromotion(id: string, headers?: HeadersInit): Promise<PromotionDetail> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<PromotionDetail>>(
      `/api/promotions/${id}`,
      getAxiosConfig(headers)
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Create a new promotion
 */
export async function createPromotion(data: CreatePromotionDto, headers?: HeadersInit): Promise<Promotion> {
  try {
    const response = await apiClient.post<SuccessResponseWrapper<Promotion>>(
      '/api/promotions',
      data,
      getAxiosConfig(headers)
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Update an existing promotion
 */
export async function updatePromotion(
  id: string,
  data: Partial<UpdatePromotionDto>,
  headers?: HeadersInit
): Promise<Promotion> {
  try {
    const response = await apiClient.put<SuccessResponseWrapper<Promotion>>(
      `/api/promotions/${id}`,
      data,
      getAxiosConfig(headers)
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Delete a promotion (soft delete)
 */
export async function deletePromotion(id: string, headers?: HeadersInit): Promise<void> {
  try {
    await apiClient.delete(`/api/promotions/${id}`, getAxiosConfig(headers));
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Duplicate a promotion
 */
export async function duplicatePromotion(id: string, headers?: HeadersInit): Promise<Promotion> {
  try {
    const response = await apiClient.post<SuccessResponseWrapper<Promotion>>(
      `/api/promotions/admin/${id}/duplicate`,
      {},
      getAxiosConfig(headers)
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Add rules to a promotion
 */
export async function addPromotionRules(
  promotionId: string,
  rules: CreatePromotionRuleDto[],
  headers?: HeadersInit
): Promise<PromotionRule[]> {
  try {
    const response = await apiClient.post<SuccessResponseWrapper<PromotionRule[]>>(
      `/api/promotions/${promotionId}/rules`,
      rules,
      getAxiosConfig(headers)
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Activate a promotion
 */
export async function activatePromotion(id: string, headers?: HeadersInit): Promise<void> {
  try {
    await apiClient.post(`/api/promotions/${id}/activate`, {}, getAxiosConfig(headers));
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Deactivate a promotion
 */
export async function deactivatePromotion(id: string, headers?: HeadersInit): Promise<void> {
  try {
    await apiClient.post(`/api/promotions/${id}/deactivate`, {}, getAxiosConfig(headers));
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Pause a promotion
 */
export async function pausePromotion(id: string, headers?: HeadersInit): Promise<void> {
  try {
    await apiClient.post(`/api/promotions/${id}/pause`, {}, getAxiosConfig(headers));
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Resume a promotion
 */
export async function resumePromotion(id: string, headers?: HeadersInit): Promise<void> {
  try {
    await apiClient.post(`/api/promotions/${id}/resume`, {}, getAxiosConfig(headers));
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Bulk update promotion status
 */
export async function bulkUpdatePromotionStatus(
  promotionIds: string[],
  status: 'active' | 'paused' | 'expired',
  headers?: HeadersInit
): Promise<{ results: any[]; summary: any }> {
  try {
    const response = await apiClient.patch<SuccessResponseWrapper<{ results: any[]; summary: any }>>(
      '/api/promotions/admin/bulk-status',
      { promotionIds, status },
      getAxiosConfig(headers)
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get promotion conflicts
 */
export async function getPromotionConflicts(id: string, headers?: HeadersInit): Promise<{
  promotionId: string;
  conflicts: any[];
  hasConflicts: boolean;
}> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<{
      promotionId: string;
      conflicts: any[];
      hasConflicts: boolean;
    }>>(`/api/promotions/admin/${id}/conflicts`, getAxiosConfig(headers));
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

// ============================================================================
// Analytics Functions
// ============================================================================

/**
 * Get promotion usage statistics
 */
export async function getPromotionStats(id: string, headers?: HeadersInit): Promise<PromotionUsageStats> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<PromotionUsageStats>>(
      `/api/promotions/${id}/stats`,
      getAxiosConfig(headers)
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get promotion analytics for date range
 */
export async function getPromotionAnalytics(
  id: string,
  startDate?: string,
  endDate?: string,
  headers?: HeadersInit
): Promise<{
  analytics: PromotionAnalytics[];
  summary: {
    totalViews: number;
    totalApplications: number;
    totalDiscountAmount: number;
    totalOrders: number;
    totalRevenue: number;
    conversionRate: number;
    averageOrderValue: number;
    roi: number;
    dateRange: {
      startDate?: string;
      endDate?: string;
      totalDays: number;
    };
  };
}> {
  try {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await apiClient.get<SuccessResponseWrapper<any>>(
      `/api/promotions/${id}/analytics`,
      {
        params,
        ...getAxiosConfig(headers)
      }
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get promotion performance comparison
 */
export async function getPromotionComparison(
  promotionIds: string[],
  startDate?: string,
  endDate?: string,
  headers?: HeadersInit
): Promise<{
  comparisons: any[];
  dateRange: { startDate?: string; endDate?: string };
  totalPromotions: number;
}> {
  try {
    const params: any = {
      promotionIds: promotionIds.join(',')
    };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await apiClient.get<SuccessResponseWrapper<any>>(
      '/api/promotions/analytics/comparison',
      {
        params,
        ...getAxiosConfig(headers)
      }
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Export promotion analytics as CSV
 */
export async function exportPromotionAnalytics(
  id: string,
  startDate?: string,
  endDate?: string,
  headers?: HeadersInit
): Promise<Blob> {
  try {
    const params: any = { format: 'csv' };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await apiClient.get(
      `/api/promotions/${id}/analytics/export`,
      {
        params,
        responseType: 'blob',
        ...getAxiosConfig(headers)
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get overall promotion system analytics
 */
export async function getSystemAnalytics(
  startDate?: string,
  endDate?: string,
  headers?: HeadersInit
): Promise<{
  systemMetrics: {
    totalPromotions: number;
    activePromotions: number;
    scheduledPromotions: number;
    expiredPromotions: number;
    totalUsage: number;
    totalDiscountGiven: number;
    totalRevenueGenerated: number;
    averageConversionRate: number;
    roi: number;
    topPerformingPromotions: any[];
  };
  dateRange: { startDate?: string; endDate?: string };
  generatedAt: string;
}> {
  try {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await apiClient.get<SuccessResponseWrapper<any>>(
      '/api/promotions/analytics/overview',
      {
        params,
        ...getAxiosConfig(headers)
      }
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}