import { apiClient } from '../api-client';

export interface PromotionalCartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  isPromotionalGift?: boolean;
  sourcePromotionId?: string;
  giftValue?: number;
}

export interface AppliedPromotion {
  promotionId: string;
  promotionName: string;
  discountAmount: number;
  freeGifts: FreeGift[];
  appliedAt: string;
}

export interface FreeGift {
  productId: string;
  variantId?: string;
  quantity: number;
  name: string;
  imageUrl?: string;
  value: number;
}

export interface CartPricing {
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  discount?: {
    code: string;
    type: 'percentage' | 'fixed_amount' | 'free_shipping';
    value: number;
    amount: number;
  };
  freeGifts: FreeGift[];
  promotionalDiscount?: number;
  appliedPromotions?: AppliedPromotion[];
}

export interface PromotionalCartResult {
  items: PromotionalCartItem[];
  appliedPromotions: AppliedPromotion[];
  totalDiscount: number;
  freeGifts: FreeGift[];
  pricing: CartPricing;
}

export interface GiftDisplayInfo {
  productId: string;
  variantId?: string;
  isGift: boolean;
  giftLabel?: string;
  promotionName?: string;
  giftValue?: number;
}

export interface GiftSummary {
  totalGifts: number;
  totalGiftValue: number;
  giftsByPromotion: Record<string, {
    count: number;
    value: number;
    items: PromotionalCartItem[];
  }>;
}

export interface GiftRemovalValidation {
  canRemove: boolean;
  reason?: string;
}

export interface CartValidationResult {
  isValid: boolean;
  updatedItems: PromotionalCartItem[];
  errors: string[];
}

class PromotionalCartService {
  /**
   * Evaluate cart with automatic promotion application
   */
  async evaluateCartWithPromotions(
    items: PromotionalCartItem[],
    customerId?: string,
    discountCode?: string,
    shippingMethod?: string
  ): Promise<PromotionalCartResult> {
    const response = await apiClient.post('/api/cart/promotional/evaluate', {
      items,
      customerId,
      discountCode,
      shippingMethod,
    });

    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to evaluate promotional cart');
    }

    return response.data.data;
  }

  /**
   * Validate promotional cart and remove ineligible gifts
   */
  async validatePromotionalCart(
    items: PromotionalCartItem[],
    customerId?: string
  ): Promise<CartValidationResult> {
    const response = await apiClient.post('/api/cart/promotional/validate', {
      items,
      customerId,
    });

    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to validate promotional cart');
    }

    return response.data.data;
  }

  /**
   * Check if a gift item can be removed
   */
  async canRemoveGift(
    productId: string,
    variantId?: string
  ): Promise<GiftRemovalValidation> {
    const response = await apiClient.post('/api/cart/promotional/gift/can-remove', {
      productId,
      variantId,
    });

    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to validate gift removal');
    }

    return response.data.data;
  }

  /**
   * Get gift display information for cart items
   */
  async getGiftDisplayInfo(items: PromotionalCartItem[]): Promise<{ items: GiftDisplayInfo[] }> {
    const response = await apiClient.post('/api/cart/promotional/gift/display-info', {
      items,
    });

    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to get gift display info');
    }

    return response.data.data;
  }

  /**
   * Get promotional gift summary
   */
  async getGiftSummary(items: PromotionalCartItem[]): Promise<GiftSummary> {
    const response = await apiClient.post('/api/cart/promotional/gift/summary', {
      items,
    });

    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to get gift summary');
    }

    return response.data.data;
  }

  /**
   * Helper method to identify promotional gifts in cart
   */
  isPromotionalGift(item: PromotionalCartItem): boolean {
    return item.isPromotionalGift === true;
  }

  /**
   * Helper method to get regular (non-gift) items from cart
   */
  getRegularItems(items: PromotionalCartItem[]): PromotionalCartItem[] {
    return items.filter(item => !this.isPromotionalGift(item));
  }

  /**
   * Helper method to get promotional gift items from cart
   */
  getPromotionalGifts(items: PromotionalCartItem[]): PromotionalCartItem[] {
    return items.filter(item => this.isPromotionalGift(item));
  }

  /**
   * Helper method to add a regular item to cart
   */
  addRegularItem(
    items: PromotionalCartItem[],
    productId: string,
    variantId?: string,
    quantity: number = 1
  ): PromotionalCartItem[] {
    const existingItemIndex = items.findIndex(
      item =>
        item.productId === productId &&
        item.variantId === variantId &&
        !this.isPromotionalGift(item)
    );

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const updatedItems = [...items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity,
      };
      return updatedItems;
    } else {
      // Add new item
      return [
        ...items,
        {
          productId,
          variantId,
          quantity,
          isPromotionalGift: false,
        },
      ];
    }
  }

  /**
   * Helper method to remove a regular item from cart
   */
  removeRegularItem(
    items: PromotionalCartItem[],
    productId: string,
    variantId?: string
  ): PromotionalCartItem[] {
    return items.filter(
      item =>
        !(item.productId === productId &&
          item.variantId === variantId &&
          !this.isPromotionalGift(item))
    );
  }

  /**
   * Helper method to update regular item quantity
   */
  updateRegularItemQuantity(
    items: PromotionalCartItem[],
    productId: string,
    variantId: string | undefined,
    quantity: number
  ): PromotionalCartItem[] {
    if (quantity <= 0) {
      return this.removeRegularItem(items, productId, variantId);
    }

    return items.map(item => {
      if (
        item.productId === productId &&
        item.variantId === variantId &&
        !this.isPromotionalGift(item)
      ) {
        return { ...item, quantity };
      }
      return item;
    });
  }
}

export const promotionalCartService = new PromotionalCartService();