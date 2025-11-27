/**
 * Admin Order Service
 * Handles all admin order management API calls
 */

import { apiClient, handleApiError, getAxiosConfig, type PaginatedResponse, type SuccessResponseWrapper } from '~/lib/api-client';

// ============================================================================
// Types
// ============================================================================

export interface Order {
  id: string;
  orderNumber: string;
  email: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  customerNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  statusHistory: StatusHistory[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  variantId?: string;
  variantName?: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface StatusHistory {
  id: string;
  orderId: string;
  status: string;
  note?: string;
  createdAt: string;
  createdBy?: string;
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get paginated list of orders with optional filtering and sorting
 */
export async function getOrders(
  params: GetOrdersParams = {},
  headers?: HeadersInit
): Promise<PaginatedResponse<Order>> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<PaginatedResponse<Order>>>('/api/admin/orders', {
      params,
      ...getAxiosConfig(headers)
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get detailed order information by ID
 */
export async function getOrder(id: string, headers?: HeadersInit): Promise<OrderDetail> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<OrderDetail>>(`/api/admin/orders/${id}`, getAxiosConfig(headers));
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  id: string,
  status: string,
  note?: string,
  headers?: HeadersInit
): Promise<Order> {
  try {
    const response = await apiClient.patch<SuccessResponseWrapper<Order>>(
      `/api/admin/orders/${id}`,
      { status, note },
      getAxiosConfig(headers)
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get order status history
 */
export async function getOrderStatusHistory(id: string, headers?: HeadersInit): Promise<StatusHistory[]> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<StatusHistory[]>>(
      `/api/admin/orders/${id}/history`,
      getAxiosConfig(headers)
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
