export interface IProduct {
  productId: string | number;
  image: {
    description: string;
    url: string;
  };
  secondaryImage?: {
    description: string;
    url: string;
  };
  productName: string;
  priceTitle: string;
  quickCartPrice: number;
  // Detail page optional fields
  galleryImages?: { description: string; url: string; associatedSize?: string }[];
  subtitle?: string;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  description?: string[];
  benefits?: string[];
  sizes?: { label: string; value: string; price: number }[];
  variants?: {
    label: string;
    details: {
      id: string;
      label: string;
      value: string;
      price: number;
      stockQuantity: number;
    }[];
  }[];
  ingredients?: {
    keyIngredients?: { name: string; description: string }[];
    fullList?: string;
    image?: string;
  };
  howToUse?: {
    steps?: { title: string; description: string; icon?: string }[];
    proTips?: string[];
    note?: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
  };
  userStats?: string;
  discountCodes?: { title: string; condition: string; code: string }[];
  complimentaryGift?: {
    name?: string;
    description?: string;
    image?: string;
    value?: string;
  };
  whyItWorks?: string;
  goodFor?: string;
  feelsLike?: string;
  smellsLike?: string;
  realUserReviews?: {
    image?: string;
    content?: string;
  };
  // CTA Hero Section
  ctaBackgroundUrl?: string;
  ctaBackgroundType?: 'image' | 'video';
  // Scrolling Experience
  scrollingExperience?: {
    id: string;
    title: string;
    imageUrl?: string;
  }[];
}