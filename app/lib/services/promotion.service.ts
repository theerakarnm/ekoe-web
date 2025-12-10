import { apiClient } from '../api-client';

export interface PublicPromotion {
  id: string;
  name: string;
  description?: string;
  type: 'percentage_discount' | 'fixed_discount' | 'free_gift';
  startsAt: string;
  endsAt: string;
  priority: number;
  rules: {
    id: string;
    ruleType: 'condition' | 'benefit';
    conditionType?: 'cart_value' | 'product_quantity' | 'specific_products' | 'category_products';
    operator?: 'gte' | 'lte' | 'eq' | 'in' | 'not_in';
    numericValue?: number;
    textValue?: string;
    benefitType?: 'percentage_discount' | 'fixed_discount' | 'free_gift';
    benefitValue?: number;
    maxDiscountAmount?: number;
    giftProductIds?: string[];
    giftQuantities?: number[];
  }[];
}

export interface PromotionDisplayData {
  promotions: {
    id: string;
    name: string;
    description?: string;
    benefits: string[];
    conditions: string[];
    type: string;
  dateRange: string;
  }[];
}

export async function getActivePromotions(): Promise<PromotionDisplayData> {
  try {
    const response = await apiClient.get('/api/promotions/active');
    const promotions: PublicPromotion[] = response.data.data;

    if (!promotions || promotions.length === 0) {
      return {
        promotions: []
      };
    }

    // Find the date range from all active promotions
    const startDates = promotions.map(p => new Date(p.startsAt));
    const endDates = promotions.map(p => new Date(p.endsAt));
    const earliestStart = new Date(Math.min(...startDates.map(d => d.getTime())));
    const latestEnd = new Date(Math.max(...endDates.map(d => d.getTime())));

    const dateRange = `${formatThaiDate(earliestStart)} - ${formatThaiDate(latestEnd)}`;

    const processedPromotions = promotions.map(promotion => ({
      id: promotion.id,
      name: promotion.name,
      description: promotion.description,
      type: promotion.type,
      benefits: [],
      conditions: [],
      dateRange: `${formatThaiDate(new Date(promotion.startsAt))} - ${formatThaiDate(new Date(promotion.endsAt))}`
    }));
    return {
      promotions: processedPromotions
    };
  } catch (error) {
    console.error('Failed to fetch active promotions:', error);
    return {
      promotions: []
    };
  }
}

function extractBenefits(promotion: PublicPromotion): string[] {
  const benefits: string[] = [];
  
  promotion.rules
    .filter(rule => rule.ruleType === 'benefit')
    .forEach(rule => {
      if (rule.benefitType === 'percentage_discount' && rule.benefitValue) {
        const maxDiscount = rule.maxDiscountAmount 
          ? ` (สูงสุด ${rule.maxDiscountAmount} บาท)`
          : '';
        benefits.push(`ลด ${rule.benefitValue}% ทุกคำสั่งซื้อ${maxDiscount}`);
      } else if (rule.benefitType === 'fixed_discount' && rule.benefitValue) {
        benefits.push(`ลด ${rule.benefitValue} บาท`);
      } else if (rule.benefitType === 'free_gift') {
        benefits.push('รับของขวัญฟรี');
      }
    });

  return benefits;
}

function extractConditions(promotion: PublicPromotion): string[] {
  const conditions: string[] = [];
  
  promotion.rules
    .filter(rule => rule.ruleType === 'condition')
    .forEach(rule => {
      if (rule.conditionType === 'cart_value' && rule.numericValue && rule.operator === 'gte') {
        conditions.push(`เมื่อซื้อครบ ${rule.numericValue} บาท`);
      } else if (rule.conditionType === 'product_quantity' && rule.numericValue && rule.operator === 'gte') {
        conditions.push(`เมื่อซื้อครบ ${rule.numericValue} ชิ้น`);
      }
    });

  return conditions;
}

function formatThaiDate(date: Date): string {
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = date.getFullYear() + 543; // Convert to Buddhist Era

  return `${day} ${month} ${year}`;
}