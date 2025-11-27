/**
 * Shared API Client Utilities
 * Provides shared axios instance, error handling, types, and interceptors
 * for all API requests (both public and admin)
 */

import axios, { type AxiosRequestConfig, type AxiosError } from 'axios';
import { redirect } from 'react-router';

const baseUrl = import.meta.env.VITE_API_URL;

// ============================================================================
// Shared Types
// ============================================================================

/**
 * Paginated response wrapper for list endpoints
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Success response wrapper from API
 */
export interface SuccessResponseWrapper<T> {
  success: boolean;
  data: T;
  meta: {
    timestamp: string;
    requestId?: string;
  };
}

/**
 * API error response structure
 */
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  errors?: Record<string, string[]>;
}

/**
 * Custom API client error class with structured error information
 */
export class ApiClientError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public field?: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

// ============================================================================
// Axios Instance Configuration
// ============================================================================

/**
 * Shared axios instance with base configuration
 * Used by both public and admin API clients
 */
export const apiClient = axios.create({
  baseURL: baseUrl,
  withCredentials: true, // Include cookies for authentication
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// ============================================================================
// Request Interceptors
// ============================================================================

/**
 * Request interceptor to add authentication headers
 * Automatically includes session cookies via withCredentials
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add any additional headers or authentication tokens here if needed
    // For now, we rely on cookies for authentication
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================================
// Response Interceptors
// ============================================================================

/**
 * Response interceptor for global error handling
 * Handles common error scenarios like authentication failures
 */
apiClient.interceptors.response.use(
  (response) => {
    // Pass through successful responses
    return response;
  },
  (error: AxiosError) => {
    // Handle authentication errors globally
    if (error.response?.status === 401) {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined') {
        // Determine if this is an admin or customer route
        const isAdminRoute = window.location.pathname.startsWith('/admin');
        const loginPath = isAdminRoute ? '/admin/login' : '/auth/login';
        
        // Only redirect if not already on login page
        if (window.location.pathname !== loginPath) {
          window.location.href = loginPath;
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// ============================================================================
// Error Handling Utilities
// ============================================================================

/**
 * Centralized error handler for consistent error handling across all API calls
 * Transforms axios errors into structured ApiClientError instances
 * 
 * @param error - The error to handle (typically from axios)
 * @throws {ApiClientError} - Structured error with status code and details
 */
export function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const response = error.response;

    if (response) {
      const status = response.status;
      const data = response.data as ApiError;

      // Handle authentication errors (401)
      if (status === 401) {
        // In SSR context, throw redirect
        if (typeof window === 'undefined') {
          throw redirect('/auth/login');
        }
        
        throw new ApiClientError(
          data.message || 'Unauthorized',
          401,
          data.code
        );
      }

      // Handle validation errors (422)
      if (status === 422) {
        throw new ApiClientError(
          data.message || 'Validation failed',
          422,
          data.code,
          data.field,
          data.errors
        );
      }

      // Handle not found errors (404)
      if (status === 404) {
        throw new ApiClientError(
          data.message || 'Resource not found',
          404,
          data.code
        );
      }

      // Handle conflict errors (409)
      if (status === 409) {
        throw new ApiClientError(
          data.message || 'Conflict',
          409,
          data.code
        );
      }

      // Generic error with status code
      throw new ApiClientError(
        data.message || error.message || 'An error occurred',
        status,
        data.code
      );
    }

    // Network error or no response
    throw new ApiClientError(
      error.message || 'Network error. Please check your connection.',
      0
    );
  }

  // Non-Axios error
  if (error instanceof Error) {
    throw new ApiClientError(error.message, 500);
  }

  // Unknown error
  throw new ApiClientError('An unknown error occurred', 500);
}

// ============================================================================
// Header Utilities
// ============================================================================

/**
 * Helper to convert HeadersInit to Axios config
 * Useful for SSR when passing request headers to API calls
 * 
 * @param headers - Headers from Request object or plain object
 * @returns Axios config with headers
 */
export function getAxiosConfig(headers?: HeadersInit): AxiosRequestConfig {
  if (!headers) return {};

  const axiosHeaders: Record<string, string> = {};

  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      axiosHeaders[key] = value;
    });
  } else if (Array.isArray(headers)) {
    headers.forEach(([key, value]) => {
      axiosHeaders[key] = value;
    });
  } else {
    Object.assign(axiosHeaders, headers);
  }

  return { headers: axiosHeaders };
}

// ============================================================================
// Request Cancellation Support
// ============================================================================

/**
 * Create an abort controller for request cancellation
 * Useful for cancelling requests when components unmount
 * 
 * @returns AbortController instance
 */
export function createAbortController(): AbortController {
  return new AbortController();
}

/**
 * Helper to add abort signal to axios config
 * 
 * @param config - Existing axios config
 * @param signal - AbortSignal from AbortController
 * @returns Updated axios config with signal
 */
export function withAbortSignal(
  config: AxiosRequestConfig,
  signal: AbortSignal
): AxiosRequestConfig {
  return {
    ...config,
    signal,
  };
}
