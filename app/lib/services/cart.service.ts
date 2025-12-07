/**
 * Cart Service
 * Handles cart validation, discount validation, and free gift eligibility
 */

import { apiClient, handleApiError, type SuccessResponseWrapper } from '../api-client';

// ============================================================================
// Types
// ============================================================================

export interface CartItemInput {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface ValidatedCartItem {
  productId: string;
  variantId?: string;
  productName: string;
  variantName?: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  inStock: boolean;
  availableQuantity: number;
  sku?: string;
  image?: string;
}

export interface CartValidationError {
  productId: string;
  variantId?: string;
  type: 'out_of_stock' | 'product_inactive' | 'product_not_found' | 'insufficient_stock';
  message: string;
}

export interface ValidatedCart {
  items: ValidatedCartItem[];
  subtotal: number;
  isValid: boolean;
  errors: CartValidationError[];
}

export interface FreeGift {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  value: number;
  minPurchaseAmount?: number;
  associatedProductIds?: string[];
}

export interface AppliedDiscount {
  code: string;
  type: 'percentage' | 'fixed_amount' | 'free_shipping';
  value: number;
  amount: number;
}

export interface CartPricing {
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  discount?: AppliedDiscount;
  freeGifts: FreeGift[];
}

export interface DiscountValidation {
  isValid: boolean;
  code?: string;
  discountType?: 'percentage' | 'fixed_amount' | 'free_shipping';
  discountValue?: number;
  discountAmount?: number;
  error?: string;
  errorCode?: 'INVALID_CODE' | 'EXPIRED' | 'USAGE_LIMIT_REACHED' | 'MIN_PURCHASE_NOT_MET' | 'NOT_APPLICABLE' | 'NOT_STARTED';
}

// ============================================================================
// Cart Validation
// ============================================================================

/**
 * Validate cart items against database
 * Checks product availability, stock levels, and pricing
 * 
 * @param items - Cart items to validate
 * @returns Validated cart with accurate pricing and stock information
 */
export async function validateCart(items: CartItemInput[]): Promise<ValidatedCart> {
  try {
    const response = await apiClient.post<SuccessResponseWrapper<ValidatedCart>>(
      '/api/cart/validate',
      { items }
    );
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

// ============================================================================
// Cart Pricing Calculation
// ============================================================================

/**
 * Calculate cart totals with discount and shipping
 * 
 * @param items - Cart items
 * @param discountCode - Optional discount code to apply
 * @param shippingMethod - Optional shipping method
 * @returns Complete pricing breakdown
 */
export async function calculateCart(
  items: CartItemInput[],
  discountCode?: string,
  shippingMethod?: string
): Promise<CartPricing> {
  try {
    const response = await apiClient.post<SuccessResponseWrapper<CartPricing>>(
      '/cart/calculate',
      { items, discountCode, shippingMethod }
    );
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

// ============================================================================
// Free Gift Eligibility
// ============================================================================

/**
 * Get eligible free gifts for cart
 * 
 * @param items - Cart items
 * @param subtotal - Cart subtotal
 * @returns List of eligible free gifts
 */
export async function getEligibleGifts(
  items: CartItemInput[],
  subtotal: number
): Promise<FreeGift[]> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<FreeGift[]>>(
      '/api/cart/gifts',
      {
        params: {
          items: JSON.stringify(items),
          subtotal,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

// ============================================================================
// Discount Code Validation
// ============================================================================

/**
 * Validate discount code
 * 
 * @param code - Discount code to validate
 * @param subtotal - Cart subtotal
 * @param items - Optional cart items for product-specific discounts
 * @returns Discount validation result
 */
export async function validateDiscountCode(
  code: string,
  subtotal: number,
  items?: CartItemInput[]
): Promise<DiscountValidation> {
  try {
    const response = await apiClient.post<SuccessResponseWrapper<DiscountValidation>>(
      '/cart/discount/validate',
      { code, subtotal, items }
    );
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}
