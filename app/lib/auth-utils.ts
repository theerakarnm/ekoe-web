/**
 * Auth utility functions for managing return URLs and route checks
 */

const RETURN_URL_KEY = 'auth_return_url';

/**
 * Get the saved return URL from localStorage
 * @returns The saved return URL or null if not found
 */
export function getReturnUrl(): string | null {
  try {
    return localStorage.getItem(RETURN_URL_KEY);
  } catch (error) {
    console.error('Error getting return URL:', error);
    return null;
  }
}

/**
 * Save a return URL to localStorage
 * @param url - The URL to save
 */
export function setReturnUrl(url: string): void {
  try {
    localStorage.setItem(RETURN_URL_KEY, url);
  } catch (error) {
    console.error('Error setting return URL:', error);
  }
}

/**
 * Clear the saved return URL from localStorage
 */
export function clearReturnUrl(): void {
  try {
    localStorage.removeItem(RETURN_URL_KEY);
  } catch (error) {
    console.error('Error clearing return URL:', error);
  }
}

/**
 * Check if a pathname is an auth-related route
 * @param pathname - The pathname to check
 * @returns True if the pathname is an auth route
 */
export function isAuthRoute(pathname: string): boolean {
  const authRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/verify-email',
    '/auth/reset-password',
    '/auth/reset-password-confirm',
    '/auth/callback',
  ];

  return authRoutes.some(route => pathname.startsWith(route));
}
