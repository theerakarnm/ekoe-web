/**
 * Site Settings Admin Service
 * Handles admin API calls for CMS settings
 */

import { apiClient, handleApiError, getAxiosConfig, type SuccessResponseWrapper } from '~/lib/api-client';

// ============================================================================
// Types
// ============================================================================

export interface HeroSlideMedia {
  type: 'image' | 'video';
  url: string;
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  media: HeroSlideMedia;
}

export interface FeatureSectionSetting {
  leftImage: string;
  rightImage: string;
}

export interface OnlineExecutiveSetting {
  mainImage: string;
  quoteImage: string;
  quoteText: string;
}

export interface WelcomePopupSetting {
  image: string;
  title: string;
  subtitle: string;
  description: string;
  terms: string[];
}

export interface SiteSettings {
  hero_slides: HeroSlide[];
  feature_section: FeatureSectionSetting;
  online_executive: OnlineExecutiveSetting;
  welcome_popup: WelcomePopupSetting;
}

export type SiteSettingKey = keyof SiteSettings;

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get all site settings
 */
export async function getAllSiteSettings(headers?: HeadersInit): Promise<SiteSettings> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<SiteSettings>>(
      '/api/site-settings/admin/all',
      getAxiosConfig(headers)
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get a single site setting by key
 */
export async function getSiteSetting<K extends SiteSettingKey>(
  key: K,
  headers?: HeadersInit
): Promise<SiteSettings[K]> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<{ key: K; value: SiteSettings[K] }>>(
      `/api/site-settings/${key}`,
      getAxiosConfig(headers)
    );
    return response.data.data.value;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Update a site setting
 */
export async function updateSiteSetting<K extends SiteSettingKey>(
  key: K,
  value: SiteSettings[K],
  headers?: HeadersInit
): Promise<SiteSettings[K]> {
  try {
    const response = await apiClient.put<SuccessResponseWrapper<{ key: K; value: SiteSettings[K] }>>(
      `/api/site-settings/admin/${key}`,
      { value },
      getAxiosConfig(headers)
    );
    return response.data.data.value;
  } catch (error) {
    throw handleApiError(error);
  }
}
