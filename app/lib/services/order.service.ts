/**
 * Public Order Service
 * Handles order creation and cart validation for checkout flow
 */

import { apiClient, handleApiError, getAxiosConfig, type SuccessResponseWrapper } from '../api-client';
import type { Product, ProductVariant } from './product.service';

// ============================================================================
// Types
// ============================================================================

/**
 * Address information for shipping and billing
 */
export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone: string;
}

/**
 * Order item for order creation
 */
export interface OrderItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

/**
 * Order item detail in response
 */
export interface OrderItemDetail {
  id: string;
  orderId: string;
  productId: string | null;
  variantId: string | null;
  productName: string;
  variantName: string | null;
  sku: string | null;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  productSnapshot: any;
  createdAt: string;
}

/**
 * Shipping address in response
 */
export interface ShippingAddress {
  id: string;
  orderId: string;
  firstName: string;
  lastName: string;
  company: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone: string;
  createdAt: string;
}

/**
 * Billing address in response
 */
export interface BillingAddress {
  id: string;
  orderId: string;
  firstName: string;
  lastName: string;
  company: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone: string | null;
  createdAt: string;
}

/**
 * Order data structure
 */
export interface Order {
  id: string;
  orderNumber: string;
  userId: string | null;
  email: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  fulfillmentStatus: string | null;
  subtotal: number;
  shippingCost: number | null;
  taxAmount: number | null;
  discountAmount: number | null;
  totalAmount: number;
  currency: string | null;
  customerNote: string | null;
  internalNote: string | null;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
}

/**
 * Order status history entry
 */
export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: string;
  note?: string | null;
  changedBy?: string | null;
  changedByName?: string;
  createdAt: Date | string;
}

/**
 * Order detail with items and addresses
 */
export interface OrderDetail extends Order {
  items: OrderItemDetail[];
  shippingAddress: ShippingAddress | null;
  billingAddress: BillingAddress | null;
  statusHistory?: OrderStatusHistory[];
}

/**
 * Request payload for creating an order
 */
export interface CreateOrderRequest {
  email: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  customerNote?: string;
  discountCode?: string;
}

/**
 * Cart item for validation (from cart store)
 */
export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

/**
 * Validation result for a single cart item
 */
export interface ItemValidationResult {
  productId: string;
  variantId?: string;
  isValid: boolean;
  availableStock: number;
  requestedQuantity: number;
  error?: string;
}

/**
 * Overall cart validation result
 */
export interface ValidationResult {
  isValid: boolean;
  items: ItemValidationResult[];
  errors: string[];
}

/**
 * Shipping method information
 */
export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  cost: number; // in cents
  estimatedDays: number;
  carrier?: string;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Create a new order
 * 
 * @param orderData - Order creation request with items, addresses, and customer info
 * @returns Created order with order number and details
 * @throws {ApiClientError} - On validation errors, stock issues, or server errors
 */
export async function createOrder(
  orderData: CreateOrderRequest,
  headers?: HeadersInit
): Promise<OrderDetail> {
  try {
    const config = getAxiosConfig(headers);
    const response = await apiClient.post<SuccessResponseWrapper<OrderDetail>>(
      '/api/orders',
      orderData,
      config
    );

    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Validate cart items against current inventory
 * Checks if all items are available in the requested quantities
 * 
 * @param items - Array of cart items to validate
 * @returns Validation result with details for each item
 */
export async function validateCartItems(items: CartItem[]): Promise<ValidationResult> {
  const validationResults: ItemValidationResult[] = [];
  const errors: string[] = [];

  try {
    // Fetch product details for all items in parallel
    const productPromises = items.map(async (item) => {
      try {
        const response = await apiClient.get<SuccessResponseWrapper<Product>>(
          `/api/products/${item.productId}`
        );
        return { item, product: response.data.data };
      } catch (error) {
        return { item, product: null, error };
      }
    });

    const results = await Promise.all(productPromises);

    // Validate each item
    for (const result of results) {
      const { item, product, error } = result;

      if (error || !product) {
        validationResults.push({
          productId: item.productId,
          variantId: item.variantId,
          isValid: false,
          availableStock: 0,
          requestedQuantity: item.quantity,
          error: 'Product not found or unavailable',
        });
        errors.push(`Product ${item.productId} is not available`);
        continue;
      }

      // Check if product is active
      if (product.status !== 'active') {
        validationResults.push({
          productId: item.productId,
          variantId: item.variantId,
          isValid: false,
          availableStock: 0,
          requestedQuantity: item.quantity,
          error: 'Product is not available for purchase',
        });
        errors.push(`${product.name} is not available for purchase`);
        continue;
      }

      // If variant is specified, validate variant stock
      if (item.variantId) {
        const variant = product.variants?.find((v) => v.id === item.variantId);

        if (!variant) {
          validationResults.push({
            productId: item.productId,
            variantId: item.variantId,
            isValid: false,
            availableStock: 0,
            requestedQuantity: item.quantity,
            error: 'Product variant not found',
          });
          errors.push(`Variant for ${product.name} not found`);
          continue;
        }

        if (!variant.isActive) {
          validationResults.push({
            productId: item.productId,
            variantId: item.variantId,
            isValid: false,
            availableStock: 0,
            requestedQuantity: item.quantity,
            error: 'Product variant is not available',
          });
          errors.push(`${product.name} (${variant.name}) is not available`);
          continue;
        }

        // Check variant stock
        if (product.trackInventory && variant.stockQuantity < item.quantity) {
          validationResults.push({
            productId: item.productId,
            variantId: item.variantId,
            isValid: false,
            availableStock: variant.stockQuantity,
            requestedQuantity: item.quantity,
            error: `Insufficient stock. Only ${variant.stockQuantity} available`,
          });
          errors.push(
            `${product.name} (${variant.name}): Only ${variant.stockQuantity} available, but ${item.quantity} requested`
          );
          continue;
        }

        // Variant is valid
        validationResults.push({
          productId: item.productId,
          variantId: item.variantId,
          isValid: true,
          availableStock: variant.stockQuantity,
          requestedQuantity: item.quantity,
        });
      } else {
        // No variant specified, check if product has variants
        if (product.variants && product.variants.length > 0) {
          validationResults.push({
            productId: item.productId,
            isValid: false,
            availableStock: 0,
            requestedQuantity: item.quantity,
            error: 'Please select a product variant',
          });
          errors.push(`${product.name} requires a variant selection`);
          continue;
        }

        // For products without variants, we can't validate stock without variant info
        // Assume valid if product is active
        validationResults.push({
          productId: item.productId,
          isValid: true,
          availableStock: 999, // Unknown stock for products without variants
          requestedQuantity: item.quantity,
        });
      }
    }

    const isValid = validationResults.every((result) => result.isValid);

    return {
      isValid,
      items: validationResults,
      errors,
    };
  } catch (error) {
    // If validation fails completely, return invalid result
    return {
      isValid: false,
      items: items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        isValid: false,
        availableStock: 0,
        requestedQuantity: item.quantity,
        error: 'Unable to validate item',
      })),
      errors: ['Unable to validate cart items. Please try again.'],
    };
  }
}


/**
 * Get available shipping methods
 * 
 * @returns List of available shipping methods with costs and delivery estimates
 */
export async function getShippingMethods(): Promise<ShippingMethod[]> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<ShippingMethod[]>>(
      '/api/orders/shipping-methods'
    );
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Get order details by invoice number (from 2C2P payment return)
 * 
 * @param invoiceNo - Invoice number from payment provider
 * @returns Order details including items, addresses, and status history
 */
export async function getOrderByInvoiceNo(invoiceNo: string): Promise<OrderDetail> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<OrderDetail>>(
      `/api/orders/invoice/${invoiceNo}`
    );
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

