/**
 * Marketing Campaigns Admin Service
 * Handles admin API calls for marketing campaigns
 */

import { apiClient, handleApiError, getAxiosConfig, type SuccessResponseWrapper } from '~/lib/api-client';

// ============================================================================
// Types
// ============================================================================

export interface MarketingCampaign {
  id: string;
  name: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  heroImageUrl: string | null;
  heroImageMobileUrl: string | null;
  logoUrl: string | null;
  contentBlocks: unknown;
  ctaText: string | null;
  ctaUrl: string | null;
  isActive: boolean | null;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MarketingCampaignListItem {
  id: string;
  name: string;
  slug: string;
  title: string;
  isActive: boolean | null;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
}

export interface CreateMarketingCampaignInput {
  name: string;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  heroImageUrl?: string;
  heroImageMobileUrl?: string;
  logoUrl?: string;
  contentBlocks?: unknown;
  ctaText?: string;
  ctaUrl?: string;
  isActive?: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
}

export type UpdateMarketingCampaignInput = Partial<CreateMarketingCampaignInput>;

interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get all marketing campaigns (admin)
 */
export async function getAllMarketingCampaigns(
  params?: { page?: number; limit?: number; search?: string; status?: string },
  headers?: HeadersInit
): Promise<PaginatedResponse<MarketingCampaignListItem>> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.search) searchParams.set('search', params.search);
    if (params?.status) searchParams.set('status', params.status);

    const response = await apiClient.get<SuccessResponseWrapper<PaginatedResponse<MarketingCampaignListItem>>>(
      `/api/marketing-campaigns/admin/list?${searchParams.toString()}`,
      getAxiosConfig(headers)
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get a single marketing campaign by ID
 */
export async function getMarketingCampaign(
  id: string,
  headers?: HeadersInit
): Promise<MarketingCampaign> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<MarketingCampaign>>(
      `/api/marketing-campaigns/admin/${id}`,
      getAxiosConfig(headers)
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Create a new marketing campaign
 */
export async function createMarketingCampaign(
  data: CreateMarketingCampaignInput,
  headers?: HeadersInit
): Promise<MarketingCampaign> {
  try {
    const response = await apiClient.post<SuccessResponseWrapper<MarketingCampaign>>(
      '/api/marketing-campaigns/admin',
      data,
      getAxiosConfig(headers)
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Update a marketing campaign
 */
export async function updateMarketingCampaign(
  id: string,
  data: UpdateMarketingCampaignInput,
  headers?: HeadersInit
): Promise<MarketingCampaign> {
  try {
    const response = await apiClient.put<SuccessResponseWrapper<MarketingCampaign>>(
      `/api/marketing-campaigns/admin/${id}`,
      data,
      getAxiosConfig(headers)
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Delete a marketing campaign
 */
export async function deleteMarketingCampaign(
  id: string,
  headers?: HeadersInit
): Promise<void> {
  try {
    await apiClient.delete(
      `/api/marketing-campaigns/admin/${id}`,
      getAxiosConfig(headers)
    );
  } catch (error) {
    throw handleApiError(error);
  }
}

// ============================================================
// Registration Functions
// ============================================================

export interface CampaignRegistration {
  id: string;
  campaignId: string;
  phoneNumber: string;
  createdAt: string;
}

/**
 * Get registrations for a campaign
 */
export async function getCampaignRegistrations(
  campaignId: string,
  headers?: HeadersInit
): Promise<CampaignRegistration[]> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<CampaignRegistration[]>>(
      `/api/marketing-campaigns/admin/${campaignId}/registrations`,
      getAxiosConfig(headers)
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Delete a campaign registration
 */
export async function deleteCampaignRegistration(
  registrationId: string,
  headers?: HeadersInit
): Promise<void> {
  try {
    await apiClient.delete(
      `/api/marketing-campaigns/admin/registrations/${registrationId}`,
      getAxiosConfig(headers)
    );
  } catch (error) {
    throw handleApiError(error);
  }
}
