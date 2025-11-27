/**
 * Toast notification utilities for customer-facing pages
 * Provides consistent toast notifications using Sonner
 */

import { toast } from 'sonner';

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

/**
 * Parse API error response and display appropriate error message
 */
export function handleApiError(error: any, defaultMessage: string = 'An error occurred') {
  let message = defaultMessage;
  let description: string | undefined;

  // Handle different error formats
  if (error?.response?.data) {
    // Axios-style error
    const data = error.response.data;
    if (data.error?.message) {
      message = data.error.message;
      if (data.error.details) {
        description = Array.isArray(data.error.details)
          ? data.error.details.map((d: any) => d.message || d).join(', ')
          : String(data.error.details);
      }
    }
  } else if (error?.message) {
    // Standard Error object
    message = error.message;
  } else if (typeof error === 'string') {
    // String error
    message = error;
  }

  showError(message, description);
}

/**
 * Handle network errors gracefully
 */
export function handleNetworkError(error: any) {
  if (!navigator.onLine) {
    showError('No internet connection', 'Please check your network and try again');
  } else if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    showError('Request timeout', 'The request took too long. Please try again');
  } else if (error?.response?.status === 0) {
    showError('Network error', 'Unable to reach the server. Please try again');
  } else {
    handleApiError(error, 'Network error occurred');
  }
}
