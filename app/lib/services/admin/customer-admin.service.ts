/**
 * Admin Customer Service
 * Handles all admin customer management API calls
 */

import { apiClient, handleApiError, getAxiosConfig, type PaginatedResponse, type SuccessResponseWrapper } from '~/lib/api-client';
import type { Order } from './order-admin.service';

// ============================================================================
// Types
// ============================================================================

export interface Customer {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  orderCount: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
  lastOrderAt?: string;
}

export interface CustomerDetail extends Customer {
  orders: Order[];
  addresses: CustomerAddress[];
  emailVerified: boolean;
  accountStatus: 'active' | 'inactive' | 'suspended';
}

export interface CustomerAddress {
  id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  createdAt: string;
}

export interface GetCustomersParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minOrders?: number;
  minSpent?: number;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get paginated list of customers with order statistics
 */
export async function getCustomers(
  params: GetCustomersParams = {},
  headers?: HeadersInit
): Promise<PaginatedResponse<Customer>> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<PaginatedResponse<Customer>>>('/api/admin/customers', {
      params,
      ...getAxiosConfig(headers)
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get detailed customer information including order history
 */
export async function getCustomer(id: string, headers?: HeadersInit): Promise<CustomerDetail> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<CustomerDetail>>(`/api/admin/customers/${id}`, getAxiosConfig(headers));
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get customer's order history
 */
export async function getCustomerOrders(
  id: string,
  params?: { page?: number; limit?: number },
  headers?: HeadersInit
): Promise<PaginatedResponse<Order>> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<PaginatedResponse<Order>>>(
      `/api/admin/customers/${id}/orders`,
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
