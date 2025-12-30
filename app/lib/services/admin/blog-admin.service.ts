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
  subtitle?: string;
  slug: string;
  excerpt?: string;
  content?: string;
  contentBlocks?: ContentBlock[];
  tableOfContents?: TableOfContentsItem[];
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
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// Content block types
interface ContentBlock {
  id: string;
  anchorId?: string;
  type: 'text' | 'image' | 'product' | 'heading' | 'quote';
  content?: string;
  url?: string;
  alt?: string;
  caption?: string;
  productId?: string;
  productName?: string;
  productSlug?: string;
  productPrice?: number;
  productImage?: string;
  level?: 1 | 2 | 3;
  author?: string;
}

interface TableOfContentsItem {
  id: string;
  level: number;
  text: string;
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
export async function getBlogPost(id: string, headers?: HeadersInit): Promise<BlogPost> {
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
  id: string,
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
export async function deleteBlogPost(id: string, headers?: HeadersInit): Promise<void> {
  try {
    await apiClient.delete(`/api/admin/blog/${id}`, getAxiosConfig(headers));
  } catch (error) {
    throw handleApiError(error);
  }
}

// ============================================================================
// Sequence/Sort Order Functions
// ============================================================================

/**
 * Update a single blog post's sort order/sequence
 */
export async function updateBlogSequence(
  blogId: string,
  sortOrder: number,
  headers?: HeadersInit
): Promise<BlogPost> {
  try {
    const response = await apiClient.patch<SuccessResponseWrapper<BlogPost>>(
      `/api/admin/blog/${blogId}/sequence`,
      { sortOrder },
      getAxiosConfig(headers)
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Bulk update blog sequences (for drag-and-drop reordering)
 */
export async function updateBlogSequences(
  updates: { blogId: string; sortOrder: number }[],
  headers?: HeadersInit
): Promise<{ updated: number }> {
  try {
    const response = await apiClient.patch<SuccessResponseWrapper<{ updated: number }>>(
      '/api/admin/blog/sequences',
      { updates },
      getAxiosConfig(headers)
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
