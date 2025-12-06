/**
 * Admin Blog Service
 * Handles all admin blog management API calls
 */

import { apiClient, handleApiError, getAxiosConfig, type PaginatedResponse, type SuccessResponseWrapper } from '~/lib/api-client';

// ============================================================================
// Types
// ============================================================================

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  authorId?: string;
  authorName?: string;
  categoryId?: string;
  categoryName?: string;
  metaTitle?: string;
  metaDescription?: string;
  status: 'draft' | 'published' | 'archived';
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface GetBlogPostsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get paginated list of blog posts with optional filtering and sorting
 */
export async function getBlogPosts(
  params: GetBlogPostsParams = {},
  headers?: HeadersInit
): Promise<PaginatedResponse<BlogPost>> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<PaginatedResponse<BlogPost>>>('/api/admin/blog', {
      params,
      ...getAxiosConfig(headers)
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get a single blog post by ID
 */
export async function getBlogPost(id: number, headers?: HeadersInit): Promise<BlogPost> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<BlogPost>>(`/api/admin/blog/${id}`, getAxiosConfig(headers));
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Create a new blog post
 */
export async function createBlogPost(data: Partial<BlogPost>, headers?: HeadersInit): Promise<BlogPost> {
  try {
    const response = await apiClient.post<SuccessResponseWrapper<BlogPost>>('/api/admin/blog', data, getAxiosConfig(headers));
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Update an existing blog post
 */
export async function updateBlogPost(
  id: number,
  data: Partial<BlogPost>,
  headers?: HeadersInit
): Promise<BlogPost> {
  try {
    const response = await apiClient.put<SuccessResponseWrapper<BlogPost>>(`/api/admin/blog/${id}`, data, getAxiosConfig(headers));
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Delete a blog post (soft delete)
 */
export async function deleteBlogPost(id: number, headers?: HeadersInit): Promise<void> {
  try {
    await apiClient.delete(`/api/admin/blog/${id}`, getAxiosConfig(headers));
  } catch (error) {
    throw handleApiError(error);
  }
}
