# ReviewsTab Component

## Overview

The ReviewsTab component displays product reviews with filtering, pagination, and a rating summary. It's designed to be used within the ProductTabs component on product detail pages.

## Features

### 1. Rating Summary (Requirement 5.1)
- Displays overall average rating
- Shows star distribution with visual bars
- Displays total review count

### 2. Review Display (Requirement 5.2, 5.4)
- Shows individual reviews with:
  - Star rating (1-5 stars)
  - Reviewer name
  - Review date
  - Review title (if provided)
  - Review text with proper formatting
  - Verified purchase badge for confirmed buyers

### 3. Star Rating Filter (Requirement 5.3)
- Filter buttons for each star rating (5, 4, 3, 2, 1)
- Shows count of reviews for each rating
- Visual indication of active filter
- Clear filter button to show all reviews

### 4. Pagination (Requirement 5.5)
- Maximum 10 reviews per page
- Previous/Next buttons
- Page number buttons with ellipsis for large page counts
- Scrolls to top of reviews section on page change
- Resets to page 1 when filter changes

## Usage

```tsx
import { ReviewsTab } from "~/components/product/reviews-tab";

<ReviewsTab productId="product-123" />
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| productId | string | Yes | The ID of the product to display reviews for |

## States

### Loading State
- Displays skeleton loaders while fetching reviews
- Shows 3 skeleton cards for reviews

### Empty State
- Displays when no reviews exist
- Shows a "No Reviews Yet" message
- Includes a "Write a Review" button

### Error State
- Logs errors to console
- Gracefully handles API failures

## Data Structure

### Review Interface
```typescript
interface Review {
  id: string;
  productId: string;
  userId: string | null;
  orderId: string | null;
  rating: number; // 1-5
  title: string | null;
  comment: string | null;
  reviewerName: string | null;
  reviewerEmail: string | null;
  status: "pending" | "approved" | "rejected";
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
}
```

### ReviewsSummary Interface
```typescript
interface ReviewsSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
```

## Backend Integration

Currently uses mock data. To integrate with the backend API:

1. Create a reviews service in `web/app/lib/services/reviews.service.ts`
2. Add API endpoints:
   - `GET /api/products/:productId/reviews` - Get paginated reviews
   - `GET /api/products/:productId/reviews/summary` - Get rating summary
3. Replace the mock data fetch in the `useEffect` hook with actual API calls

Example service implementation:

```typescript
export async function getProductReviews(
  productId: string,
  page: number = 1,
  limit: number = 10,
  rating?: number
): Promise<{ reviews: Review[]; summary: ReviewsSummary }> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (rating) {
    params.append('rating', rating.toString());
  }

  const response = await apiClient.get(
    `/api/products/${productId}/reviews?${params.toString()}`
  );
  
  return response.data.data;
}
```

## Accessibility

- Proper semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- Focus management on page changes

## Styling

Uses Tailwind CSS utility classes with:
- Responsive design (mobile-first)
- Consistent spacing and typography
- Hover states for interactive elements
- Visual feedback for active filters

## Future Enhancements

- Add "Write a Review" functionality
- Implement "Helpful" voting system
- Add review images support
- Sort reviews by date, rating, or helpfulness
- Add review moderation for admin users
