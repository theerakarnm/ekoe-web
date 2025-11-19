export interface IProduct {
  productId: number;
  image: {
    description: string;
    url: string;
  };
  productName: string;
  priceTitle: string;
  quickCartPrice: number;
  // Detail page optional fields
  galleryImages?: { description: string; url: string }[];
  subtitle?: string;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  description?: string[];
  benefits?: string[];
  sizes?: { label: string; value: string; price: number }[];
  ingredients?: {
    keyIngredients: { name: string; description: string }[];
    fullList: string;
  };
  howToUse?: {
    steps: { title: string; description: string; icon?: string }[];
    note?: string;
  };
  userStats?: {
    percentage: number;
    description: string;
    subtext?: string;
  }[];
  discountCodes?: { title: string; condition: string; code: string }[];
  complimentaryGift?: {
    name: string;
    description: string;
    image: string;
    value?: string;
  };
}