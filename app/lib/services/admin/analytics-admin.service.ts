/**
 * Admin Analytics Service
 * Handles all admin analytics and dashboard metrics API calls
 */

import { apiClient, handleApiError, getAxiosConfig, type SuccessResponseWrapper } from '~/lib/api-client';

// ============================================================================
// Types
// ============================================================================

export interface RevenueMetrics {
  total: number;
  byDate: Array<{ date: string; amount: number }>;
  growth: number;
  previousPeriod: number;
}

export interface OrderStatistics {
  total: number;
  byStatus: Array<{ status: string; count: number }>;
  averageValue: number;
  growth: number;
}

export interface CustomerMetrics {
  total: number;
  new: number;
  returning: number;
  growth: number;
  averageOrderValue: number;
}

export interface DashboardMetrics {
  revenue: RevenueMetrics;
  orders: OrderStatistics;
  customers: CustomerMetrics;
  topProducts?: Array<{
    id: string;
    name: string;
    soldCount: number;
    revenue: number;
    imageUrl?: string;
  }>;
}

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
  period?: 'day' | 'week' | 'month' | 'year';
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get revenue metrics with optional date range filtering
 */
export async function getRevenueMetrics(
  params: DateRangeParams = {},
  headers?: HeadersInit
): Promise<RevenueMetrics> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<RevenueMetrics>>('/api/admin/analytics/revenue', {
      params,
      ...getAxiosConfig(headers)
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get order statistics with status breakdown
 */
export async function getOrderStatistics(
  params: DateRangeParams = {},
  headers?: HeadersInit
): Promise<OrderStatistics> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<OrderStatistics>>('/api/admin/analytics/orders', {
      params,
      ...getAxiosConfig(headers)
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get customer metrics with growth data
 */
export async function getCustomerMetrics(
  params: DateRangeParams = {},
  headers?: HeadersInit
): Promise<CustomerMetrics> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<CustomerMetrics>>('/api/admin/analytics/customers', {
      params,
      ...getAxiosConfig(headers)
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get combined dashboard metrics for admin dashboard
 */
export async function getDashboardMetrics(
  params: DateRangeParams = {},
  headers?: HeadersInit
): Promise<DashboardMetrics> {
  try {
    console.log('[Analytics Service] Calling API with params:', params);
    const response = await apiClient.get<SuccessResponseWrapper<DashboardMetrics>>('/api/admin/dashboard/metrics', {
      params,
      ...getAxiosConfig(headers)
    });
    console.log('[Analytics Service] Response status:', response.status);
    console.log('[Analytics Service] Response data:', JSON.stringify(response.data).substring(0, 500));
    return response.data.data;
  } catch (error) {
    console.error('[Analytics Service] Error:', error);
    throw handleApiError(error);
  }
}
