/**
 * Site Settings Public Service
 * Fetches site settings for public frontend pages
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

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get all site settings (for SSR)
 */
export async function getSiteSettings(headers?: HeadersInit): Promise<SiteSettings> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<SiteSettings>>(
      '/api/site-settings',
      getAxiosConfig(headers)
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get hero slides
 */
export async function getHeroSlides(headers?: HeadersInit): Promise<HeroSlide[]> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<{ key: string; value: HeroSlide[] }>>(
      '/api/site-settings/hero_slides',
      getAxiosConfig(headers)
    );
    return response.data.data.value;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get feature section settings
 */
export async function getFeatureSection(headers?: HeadersInit): Promise<FeatureSectionSetting> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<{ key: string; value: FeatureSectionSetting }>>(
      '/api/site-settings/feature_section',
      getAxiosConfig(headers)
    );
    return response.data.data.value;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get online executive settings
 */
export async function getOnlineExecutive(headers?: HeadersInit): Promise<OnlineExecutiveSetting> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<{ key: string; value: OnlineExecutiveSetting }>>(
      '/api/site-settings/online_executive',
      getAxiosConfig(headers)
    );
    return response.data.data.value;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Get welcome popup settings
 */
export async function getWelcomePopup(headers?: HeadersInit): Promise<WelcomePopupSetting> {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<{ key: string; value: WelcomePopupSetting }>>(
      '/api/site-settings/welcome_popup',
      getAxiosConfig(headers)
    );
    return response.data.data.value;
  } catch (error) {
    throw handleApiError(error);
  }
}
