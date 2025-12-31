import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getEligibleGifts } from '~/lib/services/cart.service';

export interface FreeGift {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  value: number;
}

// Gift option for user-selectable gifts
export interface GiftOption {
  id: string;
  name: string;
  price?: number;
  imageUrl?: string;
  quantity: number;
  productId?: string;
}

// Pending gift selection for promotions with multiple options
export interface PendingGiftSelection {
  promotionId: string;
  promotionName: string;
  availableOptions: GiftOption[];
  selectionsRemaining: number;
  selectedOptionIds: string[];
}

export interface ComplimentaryGiftInfo {
  name: string;
  description: string;
  image: string;
  value: number;
}

export interface CartItemComplimentaryGift {
  name: string;
  description: string;
  imageUrl: string;
  value: number;
  productId: string;
  productName: string;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  productName: string;
  variantName?: string;
  image: string;
  price: number; // in cents
  quantity: number;
  sku?: string;
  complimentaryGift?: ComplimentaryGiftInfo;
}

interface CartState {
  items: CartItem[];
  discountCode?: string;
  discountAmount: number;
  eligibleGifts: FreeGift[];

  // Item management actions
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;

  // Discount actions
  applyDiscountCode: (code: string, amount: number) => void;
  removeDiscountCode: () => void;

  // Free gift actions
  setEligibleGifts: (gifts: FreeGift[]) => void;
  fetchEligibleGifts: () => Promise<void>;

  // Gift selection actions (for promotions with multiple gift options)
  giftSelections: Record<string, string[]>;  // promotionId -> selectedOptionIds[]
  pendingGiftSelections: PendingGiftSelection[];
  selectGift: (promotionId: string, optionId: string) => void;
  deselectGift: (promotionId: string, optionId: string) => void;
  setPendingGiftSelections: (selections: PendingGiftSelection[]) => void;
  hasCompletedGiftSelections: () => boolean;
  getGiftSelections: () => Record<string, string[]>;
  clearGiftSelections: () => void;

  // Calculation methods
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getTotal: (shippingCost?: number, taxAmount?: number) => number;
  getTotalItems: () => number;

  // Complimentary gifts from cart items
  getComplimentaryGifts: () => CartItemComplimentaryGift[];

  // Legacy method for backward compatibility
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      discountCode: undefined,
      discountAmount: 0,
      eligibleGifts: [],
      giftSelections: {},
      pendingGiftSelections: [],

      // Item management actions
      addItem: (newItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.productId === newItem.productId && item.variantId === newItem.variantId
          );

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += newItem.quantity || 1;
            return { items: newItems };
          }

          return { items: [...state.items, { ...newItem, quantity: newItem.quantity || 1 }] };
        });
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.variantId === variantId)
          ),
        }));
      },

      updateQuantity: (productId, quantity, variantId) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.productId === productId && item.variantId === variantId) {
              return { ...item, quantity: Math.max(1, quantity) };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({
        items: [],
        discountCode: undefined,
        discountAmount: 0,
        eligibleGifts: [],
        giftSelections: {},
        pendingGiftSelections: [],
      }),

      // Discount actions
      applyDiscountCode: (code, amount) => {
        set({ discountCode: code, discountAmount: amount });
      },

      removeDiscountCode: () => {
        set({ discountCode: undefined, discountAmount: 0 });
      },

      // Free gift actions
      setEligibleGifts: (gifts) => {
        set({ eligibleGifts: gifts });
      },

      fetchEligibleGifts: async () => {
        const state = get();
        const items = state.items.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        }));

        if (items.length === 0) {
          set({ eligibleGifts: [] });
          return;
        }

        try {
          const subtotal = state.getSubtotal();
          const gifts = await getEligibleGifts(items, subtotal);
          set({ eligibleGifts: gifts });
        } catch (error) {
          console.error('Failed to fetch eligible gifts:', error);
          // Don't throw - just log the error and keep existing gifts
        }
      },

      // Gift selection actions
      selectGift: (promotionId, optionId) => {
        set((state) => {
          const currentSelections = state.giftSelections[promotionId] || [];
          if (currentSelections.includes(optionId)) {
            return state; // Already selected
          }
          return {
            giftSelections: {
              ...state.giftSelections,
              [promotionId]: [...currentSelections, optionId],
            },
          };
        });
      },

      deselectGift: (promotionId, optionId) => {
        set((state) => {
          const currentSelections = state.giftSelections[promotionId] || [];
          return {
            giftSelections: {
              ...state.giftSelections,
              [promotionId]: currentSelections.filter((id) => id !== optionId),
            },
          };
        });
      },

      setPendingGiftSelections: (selections) => {
        set({ pendingGiftSelections: selections });
      },

      hasCompletedGiftSelections: () => {
        const state = get();
        // Check if all pending selections are complete
        return state.pendingGiftSelections.every((pending) => {
          const selected = state.giftSelections[pending.promotionId] || [];
          const totalRequired = selected.length + pending.selectionsRemaining;
          return selected.length >= totalRequired;
        });
      },

      getGiftSelections: () => {
        return get().giftSelections;
      },

      clearGiftSelections: () => {
        set({ giftSelections: {}, pendingGiftSelections: [] });
      },

      // Calculation methods
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getDiscountAmount: () => {
        return get().discountAmount;
      },

      getTotal: (shippingCost = 0, taxAmount = 0) => {
        const subtotal = get().getSubtotal();
        const discount = get().discountAmount;
        return subtotal + shippingCost + taxAmount - discount;
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // Get all complimentary gifts from cart items
      getComplimentaryGifts: () => {
        return get().items
          .filter(item => item.complimentaryGift)
          .map(item => ({
            name: item.complimentaryGift!.name,
            description: item.complimentaryGift!.description,
            imageUrl: item.complimentaryGift!.image,
            value: item.complimentaryGift!.value,
            productId: item.productId,
            productName: item.productName,
          }));
      },

      // Legacy method for backward compatibility
      getTotalPrice: () => {
        return get().getSubtotal();
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
