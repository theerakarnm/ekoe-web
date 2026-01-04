/**
 * Marketing Campaigns Public Service
 * Fetches active marketing campaigns for public display
 */

import { apiClient, handleApiError, type SuccessResponseWrapper } from '~/lib/api-client';

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
}

/**
 * Get active marketing campaign by slug
 */
export async function getMarketingCampaignBySlug(
  slug: string,
  headers?: HeadersInit
): Promise<MarketingCampaign> {
  try {
    const config = headers ? { headers: Object.fromEntries(new Headers(headers).entries()) } : undefined;
    const response = await apiClient.get<SuccessResponseWrapper<MarketingCampaign>>(
      `/api/marketing-campaigns/${slug}`,
      config
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
