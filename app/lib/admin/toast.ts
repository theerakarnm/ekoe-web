/**
 * Toast notification utilities for admin portal
 * Provides consistent toast notifications using Sonner
 */

import { toast } from 'sonner';

// Re-export toast for direct usage
export { toast };

/**
 * Display a success toast notification
 */
export function showSuccess(message: string, description?: string) {
  if (description) {
    toast.success(message, {
      description,
    });
  } else {
    toast.success(message);
  }
}

/**
 * Display an error toast notification
 */
export function showError(message: string, description?: string) {
  if (description) {
    toast.error(message, {
      description,
    });
  } else {
    toast.error(message);
  }
}

/**
 * Display an info toast notification
 */
export function showInfo(message: string, description?: string) {
  if (description) {
    toast.info(message, {
      description,
    });
  } else {
    toast.info(message);
  }
}

/**
 * Display a warning toast notification
 */
export function showWarning(message: string, description?: string) {
  if (description) {
    toast.warning(message, {
      description,
    });
  } else {
    toast.warning(message);
  }
}

/**
 * Display a loading toast notification
 * Returns a function to dismiss the toast
 */
export function showLoading(message: string) {
  const toastId = toast.loading(message);
  
  return {
    dismiss: () => toast.dismiss(toastId),
    update: (newMessage: string) => {
      toast.dismiss(toastId);
      return toast.loading(newMessage);
    },
  };
}

/**
 * Display a promise toast that shows loading, success, and error states
 */
export function showPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: any) => string);
  }
) {
  return toast.promise(promise, messages);
}
