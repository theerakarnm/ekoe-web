/**
 * Payment Service
 * Handles all payment-related API calls for PromptPay and 2C2P payments
 */

import { apiClient, handleApiError, getAxiosConfig, type SuccessResponseWrapper } from '../api-client';

// ============================================================================
// Types
// ============================================================================

/**
 * Payment status enum
 */
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

/**
 * Payment method types
 */
export type PaymentMethod = 'promptpay' | 'credit_card' | 'bank_transfer';

/**
 * Payment transaction data
 */
export interface Payment {
  id: string;
  orderId: string;
  paymentMethod: PaymentMethod;
  paymentProvider: string | null;
  amount: number;
  currency: string;
  transactionId: string | null;
  status: PaymentStatus;
  cardLast4: string | null;
  cardBrand: string | null;
  providerResponse: any;
  createdAt: string;
  completedAt: string | null;
  failedAt: string | null;
}

/**
 * Payment status response for polling
 */
export interface PaymentStatusResponse {
  paymentId: string;
  orderId: string;
  status: PaymentStatus;
  transactionId: string | null;
  amount: number;
  qrCode?: string;
  expiresAt?: string;
  createdAt: string;
  completedAt: string | null;
}

/**
 * PromptPay payment creation response
 */
export interface PromptPayPaymentResponse {
  paymentId: string;
  qrCode: string;
  expiresAt: string;
}

/**
 * 2C2P payment initiation response
 */
export interface TwoC2PPaymentResponse {
  paymentId: string;
  paymentUrl: string;
}

/**
 * 2C2P return URL result
 */
export interface TwoC2PReturnResult {
  paymentId: string;
  status: PaymentStatus;
  transactionRef: string | null;
  message: string;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Create a PromptPay payment and generate QR code
 * 
 * @param orderId - Order ID to create payment for
 * @param amount - Payment amount in cents
 * @returns Payment ID, QR code image (base64), and expiration time
 * @throws {ApiClientError} - On validation errors or server errors
 */
export async function createPromptPayPayment(
  orderId: string,
  amount: number,
  headers?: HeadersInit
): Promise<PromptPayPaymentResponse> {
  try {
    const config = getAxiosConfig(headers);
    const response = await apiClient.post<SuccessResponseWrapper<PromptPayPaymentResponse>>(
      '/api/payments/promptpay',
      { orderId, amount },
      config
    );

    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Initiate a 2C2P credit card payment
 * 
 * @param orderId - Order ID to create payment for
 * @param amount - Payment amount in cents
 * @param returnUrl - URL to return to after payment
 * @returns Payment ID and payment URL for redirect
 * @throws {ApiClientError} - On validation errors or server errors
 */
export async function initiate2C2PPayment(
  orderId: string,
  amount: number,
  returnUrl: string,
  headers?: HeadersInit
): Promise<TwoC2PPaymentResponse> {
  try {
    const config = getAxiosConfig(headers);
    const response = await apiClient.post<SuccessResponseWrapper<TwoC2PPaymentResponse>>(
      '/api/payments/2c2p/initiate',
      { orderId, amount, returnUrl },
      config
    );

    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Get payment status for polling
 * Used to check if a payment has been completed
 * 
 * @param paymentId - Payment ID to check status for
 * @returns Current payment status and details
 * @throws {ApiClientError} - On not found or server errors
 */
export async function getPaymentStatus(
  paymentId: string
): Promise<PaymentStatusResponse> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<PaymentStatusResponse>>(
      `/api/payments/${paymentId}/status`
    );

    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Handle 2C2P return URL after payment
 * Called when user returns from 2C2P payment page
 * 
 * @param orderId - Order ID from return URL
 * @param paymentStatus - Payment status from return URL
 * @param transactionRef - Transaction reference from return URL (optional)
 * @returns Payment result with status and message
 * @throws {ApiClientError} - On validation errors or server errors
 */
export async function handle2C2PReturn(
  orderId: string,
  paymentStatus: string,
  transactionRef?: string
): Promise<TwoC2PReturnResult> {
  try {
    const params = new URLSearchParams({
      order_id: orderId,
      payment_status: paymentStatus,
    });

    if (transactionRef) {
      params.append('transaction_ref', transactionRef);
    }

    const response = await apiClient.get<SuccessResponseWrapper<TwoC2PReturnResult>>(
      `/api/payments/2c2p/return?${params.toString()}`
    );

    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Manually verify a payment (admin only)
 * Used by administrators to manually mark a payment as completed
 * 
 * @param paymentId - Payment ID to verify
 * @param note - Optional note explaining the manual verification
 * @param headers - Optional headers for SSR authentication
 * @returns Success message
 * @throws {ApiClientError} - On unauthorized, not found, or server errors
 */
export async function manuallyVerifyPayment(
  paymentId: string,
  note?: string,
  headers?: HeadersInit
): Promise<{ message: string; paymentId: string }> {
  try {
    const config = getAxiosConfig(headers);

    const response = await apiClient.post<SuccessResponseWrapper<{ message: string; paymentId: string }>>(
      `/api/admin/payments/${paymentId}/verify`,
      { note },
      config
    );

    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Get payment details by ID (admin only)
 * 
 * @param paymentId - Payment ID to retrieve
 * @param headers - Optional headers for SSR authentication
 * @returns Full payment details
 * @throws {ApiClientError} - On unauthorized, not found, or server errors
 */
export async function getPaymentById(
  paymentId: string,
  headers?: HeadersInit
): Promise<Payment> {
  try {
    const config = getAxiosConfig(headers);

    const response = await apiClient.get<SuccessResponseWrapper<Payment>>(
      `/api/admin/payments/${paymentId}`,
      config
    );

    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Get payments for an order (admin only)
 * 
 * @param orderId - Order ID to get payments for
 * @param headers - Optional headers for SSR authentication
 * @returns List of payments for the order
 * @throws {ApiClientError} - On unauthorized or server errors
 */
export async function getPaymentsByOrderId(
  orderId: string,
  headers?: HeadersInit
): Promise<Payment[]> {
  try {
    const config = getAxiosConfig(headers);

    const response = await apiClient.get<SuccessResponseWrapper<{ data: Payment[] }>>(
      `/api/admin/payments?orderId=${orderId}`,
      config
    );

    return response.data.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Process 2C2P return data via backend (POST)
 * Used when we receive a POST payload from 2C2P
 * 
 * @param paymentResponse - Raw payment response string (base64 or JWT)
 * @returns Payment result from backend
 */
export async function process2C2PReturnData(
  paymentResponse: string
): Promise<TwoC2PReturnResult> {
  try {
    const response = await apiClient.post<SuccessResponseWrapper<TwoC2PReturnResult>>(
      '/api/payments/2c2p/return-data',
      { paymentResponse }
    );

    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

