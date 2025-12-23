import { create } from 'zustand';
import { getProducts, type Product } from '~/lib/services/product.service';

interface MenuProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  fetchProducts: () => Promise<void>;
}

export const useMenuProductsStore = create<MenuProductsState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  isInitialized: false,

  fetchProducts: async () => {
    // If already initialized or currently loading, skip
    if (get().isInitialized || get().isLoading) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const result = await getProducts({ limit: 10, productType: 'single' });
      set({ products: result.data, isInitialized: true, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch products for menu', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        isLoading: false
      });
    }
  },
}));
