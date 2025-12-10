import { apiClient, handleApiError } from "../api-client";
import type { BlogPost } from "~/interface/blog.interface";

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
  getBlogs: async (params: GetBlogsParams = {}): Promise<GetBlogsResponse> => {
    try {
      const response = await apiClient.get('/blog', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getBlogPost: async (id: string): Promise<BlogPost> => {
    try {
      const response = await apiClient.get(`/blog/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};
