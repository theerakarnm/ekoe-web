# Promotion Display Components

This directory contains React components for displaying promotional information to customers throughout their shopping experience.

## Components Overview

### 1. PromotionBanner
Displays promotional offers as eye-catching banners on product and category pages.

**Features:**
- Support for different promotion types (percentage, fixed discount, free gift)
- Urgency indicators for expiring promotions
- Time remaining countdown
- Call-to-action buttons

**Usage:**
```tsx
import { PromotionBanner } from '~/components/promotion';

<PromotionBanner
  promotion={{
    id: "promo-1",
    name: "Summer Sale",
    description: "Get amazing discounts on all products",
    type: "percentage_discount",
    discountValue: 20,
    minCartValue: 100000, // ฿1,000 in cents
    endsAt: "2024-12-31T23:59:59Z",
    isUrgent: true
  }}
  onViewDetails={() => console.log('View details')}
/>
```

### 2. CartPromotionDisplay
Shows applied promotions in the shopping cart with detailed savings breakdown.

**Features:**
- Lists all applied promotions
- Shows discount amounts and free gifts
- Displays total savings
- Optional promotion removal functionality

**Usage:**
```tsx
import { CartPromotionDisplay } from '~/components/promotion';

<CartPromotionDisplay
  appliedPromotions={[
    {
      promotionId: "promo-1",
      promotionName: "Summer Sale",
      discountAmount: 5000, // ฿50 in cents
      freeGifts: [],
      appliedAt: "2024-12-10T10:00:00Z"
    }
  ]}
  totalDiscount={5000}
  totalGiftValue={0}
/>
```

### 3. NearQualificationMessage
Encourages customers to add more items to qualify for promotions.

**Features:**
- Progress bar showing qualification progress
- Amount needed to qualify
- Suggested products to reach threshold
- Motivational messaging

**Usage:**
```tsx
import { NearQualificationMessage } from '~/components/promotion';

<NearQualificationMessage
  promotion={{
    id: "promo-1",
    name: "Free Shipping",
    type: "free_gift",
    minCartValue: 150000 // ฿1,500 in cents
  }}
  currentCartValue={120000} // ฿1,200 in cents
  amountNeeded={30000} // ฿300 in cents
  progressPercentage={80}
  suggestedProducts={[
    {
      id: "prod-1",
      name: "The Serum",
      price: 35000,
      imageUrl: "/images/serum.jpg"
    }
  ]}
  onContinueShopping={() => navigate('/products')}
/>
```

### 4. UrgencyMessage
Creates urgency for time-sensitive promotions with countdown timers.

**Features:**
- Real-time countdown timer
- Different urgency levels (high, medium, low)
- Animated elements for high urgency
- Motivational messaging based on time remaining

**Usage:**
```tsx
import { UrgencyMessage } from '~/components/promotion';

<UrgencyMessage
  promotion={{
    id: "promo-1",
    name: "Flash Sale",
    type: "percentage_discount",
    discountValue: 30,
    endsAt: "2024-12-10T23:59:59Z"
  }}
  urgencyLevel="high"
  onTakeAction={() => navigate('/products')}
  actionText="Shop Now"
/>
```

### 5. PromotionExplanation
Provides detailed explanation of promotion conditions and benefits.

**Features:**
- Shows promotion requirements and current status
- Explains why a promotion was selected
- Displays conflict resolution information
- Usage limit tracking

**Usage:**
```tsx
import { PromotionExplanation } from '~/components/promotion';

<PromotionExplanation
  promotion={{
    id: "promo-1",
    name: "Buy 2 Get 1 Free",
    type: "free_gift",
    isApplied: true,
    priority: 1
  }}
  conditions={[
    {
      type: "product_quantity",
      description: "Add 2 or more items to cart",
      isMet: true,
      currentValue: "3 items",
      requiredValue: "2 items"
    }
  ]}
  benefits={{
    freeGifts: [
      { name: "The Oil Bar", quantity: 1, value: 21200 }
    ]
  }}
  selectionReason="This promotion provides the highest value for your cart"
/>
```

### 6. PromotionBenefitExplanation
Shows detailed calculation of promotion benefits and savings.

**Features:**
- Mathematical breakdown of discount calculations
- Capping and limit explanations
- Free gift value display
- Total savings summary

**Usage:**
```tsx
import { PromotionBenefitExplanation } from '~/components/promotion';

<PromotionBenefitExplanation
  promotion={{
    id: "promo-1",
    name: "20% Off Everything",
    type: "percentage_discount",
    discountValue: 20,
    maxDiscountAmount: 10000 // ฿100 max discount
  }}
  cartValue={60000} // ฿600 in cents
  calculatedDiscount={10000} // ฿100 (capped)
  savings={{
    discountSavings: 10000,
    giftValue: 0,
    totalSavings: 10000
  }}
  explanation="You've reached the maximum discount amount for this promotion"
/>
```

### 7. OrderPromotionDisplay
Shows promotion details on order confirmation pages.

**Features:**
- Order-specific promotion summary
- Savings statistics and percentages
- Gift breakdown with images
- Thank you messaging

**Usage:**
```tsx
import { OrderPromotionDisplay } from '~/components/promotion';

<OrderPromotionDisplay
  appliedPromotions={orderPromotions}
  totalDiscountAmount={order.promotionDiscountAmount}
  totalGiftValue={order.promotionGiftValue}
  orderSubtotal={order.subtotal}
  showSavingsPercentage={true}
/>
```

### 8. PromotionSavingsSummary
Compact summary component suitable for emails and small spaces.

**Features:**
- Compact and email-friendly formats
- Inline styles for email compatibility
- Configurable detail levels
- Responsive design

**Usage:**
```tsx
import { PromotionSavingsSummary } from '~/components/promotion';

// For web display
<PromotionSavingsSummary
  appliedPromotions={promotions}
  totalDiscountAmount={5000}
  totalGiftValue={2000}
  compact={true}
/>

// For email templates
<PromotionSavingsSummary
  appliedPromotions={promotions}
  totalDiscountAmount={5000}
  totalGiftValue={2000}
  emailFormat={true}
/>
```

### 9. OrderPromotionTracking
Displays promotion history in customer order tracking.

**Features:**
- Order history integration
- Expandable details
- Savings tracking over time
- Quick order access

**Usage:**
```tsx
import { OrderPromotionTracking } from '~/components/promotion';

<OrderPromotionTracking
  orderId={order.id}
  orderDate={order.createdAt}
  appliedPromotions={order.appliedPromotions}
  totalSavings={order.totalPromotionSavings}
  orderTotal={order.totalAmount}
  compact={false}
  onViewOrder={() => navigate(`/orders/${order.id}`)}
/>
```

## Integration Guidelines

### Requirements Mapping

These components fulfill the following requirements from the promotional system specification:

- **Requirement 8.1**: Promotion banners on relevant pages
- **Requirement 8.2**: Cart promotion display with savings information
- **Requirement 8.3**: Near-qualification messaging
- **Requirement 8.4**: Promotion explanation and selection reasoning
- **Requirement 8.6**: Urgency messaging for expiring promotions
- **Requirement 8.7**: Promotion benefit explanation displays
- **Requirement 8.8**: Order confirmation promotion display

### Best Practices

1. **Performance**: Components are optimized for fast rendering and minimal re-renders
2. **Accessibility**: All components include proper ARIA labels and keyboard navigation
3. **Responsive**: Components work well on mobile and desktop devices
4. **Theming**: Components use consistent design tokens and can be customized
5. **Error Handling**: Components gracefully handle missing or invalid data

### Styling

All components use:
- Tailwind CSS for styling
- Consistent color scheme (green for promotions, red for urgency)
- Lucide React icons for consistency
- Responsive design patterns
- Proper contrast ratios for accessibility

### Data Flow

Components expect data in the format defined by the promotional system interfaces:
- `AppliedPromotion` for applied promotion data
- `FreeGift` for gift item information
- Monetary values in cents (Thai Baht)
- ISO date strings for timestamps

### Testing

Each component should be tested for:
- Proper rendering with valid data
- Graceful handling of missing data
- Responsive behavior
- Accessibility compliance
- User interaction handling

## Future Enhancements

Potential improvements for these components:
- Animation and transition effects
- A/B testing integration
- Personalization based on customer data
- Multi-language support
- Advanced analytics tracking
- Real-time promotion updates via WebSocket