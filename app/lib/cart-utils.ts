import type { CartItem } from '~/store/cart';

const CART_BACKUP_KEY = 'cart-backup';

/**
 * Save cart state to a backup location before authentication redirect
 * This ensures cart is preserved even if the main cart storage is cleared
 */
export function saveCartBackup(items: CartItem[]): void {
  try {
    localStorage.setItem(CART_BACKUP_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart backup:', error);
  }
}

/**
 * Restore cart from backup after authentication
 * Returns the backed up cart items or null if no backup exists
 */
export function restoreCartBackup(): CartItem[] | null {
  try {
    const backup = localStorage.getItem(CART_BACKUP_KEY);
    if (!backup) return null;
    
    return JSON.parse(backup) as CartItem[];
  } catch (error) {
    console.error('Failed to restore cart backup:', error);
    return null;
  }
}

/**
 * Clear cart backup after successful restoration
 */
export function clearCartBackup(): void {
  try {
    localStorage.removeItem(CART_BACKUP_KEY);
  } catch (error) {
    console.error('Failed to clear cart backup:', error);
  }
}

/**
 * Merge two cart arrays, combining items with same productId and size
 */
export function mergeCartItems(existingItems: CartItem[], newItems: CartItem[]): CartItem[] {
  const merged = [...existingItems];
  
  for (const newItem of newItems) {
    const existingIndex = merged.findIndex(
      (item) => item.productId === newItem.productId && item.size === newItem.size
    );
    
    if (existingIndex > -1) {
      // Combine quantities for duplicate items
      merged[existingIndex].quantity += newItem.quantity;
    } else {
      // Add new item
      merged.push(newItem);
    }
  }
  
  return merged;
}
