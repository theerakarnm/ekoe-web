import { apiClient, handleApiError, type SuccessResponseWrapper, getAxiosConfig } from '~/lib/api-client';
import type { BlogPost } from '~/interface/blog.interface';

export interface GetBlogsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface GetBlogsResponse {
  data: BlogPost[];
  total: number;
  page: number;
  limit: number;
}

export const blogService = {
  getBlogs: async (params: GetBlogsParams = {}, headers?: HeadersInit): Promise<GetBlogsResponse> => {
    try {
      // Adjusted path to /api/blog based on admin service using /api/admin/blog
      const response = await apiClient.get<SuccessResponseWrapper<GetBlogsResponse>>('/api/blog', {
        params,
        ...getAxiosConfig(headers)
      });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getBlogPost: async (id: string, headers?: HeadersInit): Promise<BlogPost> => {
    try {
      const response = await apiClient.get<SuccessResponseWrapper<BlogPost>>(`/api/blog/${id}`, getAxiosConfig(headers));
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

