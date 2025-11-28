# API Client Migration Notes

## Overview

The monolithic `web/app/lib/admin/api-client.ts` file has been successfully deprecated and removed. All functionality has been migrated to a modular service layer architecture.

## Migration Summary

### Old Structure (Deprecated)
- **Single file**: `web/app/lib/admin/api-client.ts`
- **Size**: ~700+ lines
- **Pattern**: All admin API functions in one file
- **Issues**: Hard to maintain, difficult to navigate, tight coupling

### New Structure (Current)

#### Shared Utilities
- **File**: `web/app/lib/api-client.ts`
- **Exports**: 
  - `apiClient` - Configured axios instance
  - `handleApiError()` - Centralized error handling
  - `getAxiosConfig()` - Header conversion utility
  - Types: `PaginatedResponse`, `SuccessResponseWrapper`, `ApiError`, `ApiClientError`

#### Admin Services
All admin services are in `web/app/lib/services/admin/`:

1. **product-admin.service.ts** - Product management
   - `getProducts()`, `getProduct()`, `createProduct()`, `updateProduct()`, `deleteProduct()`
   - `uploadProductImage()`
   - Types: `Product`, `ProductImage`, `ProductVariant`, `Category`, `Tag`

2. **blog-admin.service.ts** - Blog management
   - `getBlogPosts()`, `getBlogPost()`, `createBlogPost()`, `updateBlogPost()`, `deleteBlogPost()`
   - Types: `BlogPost`

3. **coupon-admin.service.ts** - Coupon management
   - `getDiscountCodes()`, `getDiscountCode()`, `createDiscountCode()`, `updateDiscountCode()`
   - `deactivateDiscountCode()`, `getCouponUsageStats()`
   - Types: `DiscountCode`, `CouponUsageStats`

4. **order-admin.service.ts** - Order management (NEW)
   - `getOrders()`, `getOrder()`, `updateOrderStatus()`, `getOrderStatusHistory()`
   - Types: `Order`, `OrderDetail`, `OrderItem`, `StatusHistory`

5. **customer-admin.service.ts** - Customer management (NEW)
   - `getCustomers()`, `getCustomer()`, `getCustomerOrders()`
   - Types: `Customer`, `CustomerDetail`, `CustomerStats`

6. **analytics-admin.service.ts** - Analytics and dashboard (NEW)
   - `getRevenueMetrics()`, `getOrderStatistics()`, `getCustomerMetrics()`, `getDashboardMetrics()`
   - Types: `RevenueMetrics`, `OrderStatistics`, `CustomerMetrics`, `DashboardMetrics`

#### Public Services
Located in `web/app/lib/services/`:

1. **product.service.ts** - Public product API
   - `getProducts()`, `getProduct()`, `getRelatedProducts()`, `getBestSellers()`, `getNewArrivals()`

2. **order.service.ts** - Public order API
   - `createOrder()`, `validateCartItems()`

## Benefits of New Architecture

1. **Modularity**: Each service handles a specific domain
2. **Maintainability**: Easier to find and update specific functionality
3. **Type Safety**: Types are co-located with their service
4. **Reusability**: Shared utilities in one place
5. **Scalability**: Easy to add new services without bloating existing files
6. **Testing**: Easier to test individual services in isolation

## Migration Checklist

- [x] Create shared API client utilities (`api-client.ts`)
- [x] Create product service (public)
- [x] Create order service (public)
- [x] Create admin product service
- [x] Create admin blog service
- [x] Create admin coupon service
- [x] Create admin order service
- [x] Create admin customer service
- [x] Create admin analytics service
- [x] Update all route files to use new services
- [x] Update all component files to use new services
- [x] Verify no imports from old api-client
- [x] Remove old api-client file
- [x] Verify typecheck passes

## Usage Examples

### Before (Old Pattern)
```typescript
import { getProducts, createProduct } from '~/lib/admin/api-client';

// In loader
const products = await getProducts({ page: 1 }, request.headers);
```

### After (New Pattern)
```typescript
import { getProducts, createProduct } from '~/lib/services/admin/product-admin.service';

// In loader
const products = await getProducts({ page: 1 }, request.headers);
```

## Notes

- All service functions maintain the same API signatures
- Error handling is consistent across all services
- SSR support via optional `headers` parameter is preserved
- All types are exported from their respective service files
