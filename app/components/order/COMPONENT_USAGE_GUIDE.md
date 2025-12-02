# Customer Order Status Components - Usage Guide

## Quick Start

### Import Components

```typescript
import { OrderStatusTracker, OrderStatusTimeline } from '~/components/order';
```

## OrderStatusTracker

Visual progress indicator showing order lifecycle stages.

### Basic Usage

```typescript
<OrderStatusTracker
  currentStatus="shipped"
  estimatedDelivery={new Date('2024-12-10')}
/>
```

### With Cancellation Reason

```typescript
<OrderStatusTracker
  currentStatus="cancelled"
  cancelledReason="Customer requested cancellation"
/>
```

### With Refund Reason

```typescript
<OrderStatusTracker
  currentStatus="refunded"
  refundedReason="Product was damaged during shipping"
/>
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentStatus` | `OrderStatus` | Yes | Current order status |
| `estimatedDelivery` | `Date \| string \| null` | No | Estimated delivery date (shown for shipped orders) |
| `cancelledReason` | `string \| null` | No | Reason for cancellation (shown for cancelled orders) |
| `refundedReason` | `string \| null` | No | Reason for refund (shown for refunded orders) |

### Visual States

**Normal Flow (pending → processing → shipped → delivered)**
```
[✓] Order Placed → [✓] Processing → [○] Shipped → [○] Delivered
```

**Cancelled**
```
┌─────────────────────────────────────┐
│ ⚠️  Order Cancelled                 │
│ This order has been cancelled       │
│                                     │
│ Reason: [cancellation reason]       │
└─────────────────────────────────────┘
```

**Refunded**
```
┌─────────────────────────────────────┐
│ 💰 Order Refunded                   │
│ This order has been refunded        │
│                                     │
│ Reason: [refund reason]             │
└─────────────────────────────────────┘
```

## OrderStatusTimeline

Chronological timeline of all status changes.

### Basic Usage

```typescript
<OrderStatusTimeline
  history={statusHistory}
  showNotes={true}
/>
```

### Without Notes

```typescript
<OrderStatusTimeline
  history={statusHistory}
  showNotes={false}
/>
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `history` | `StatusHistoryEntry[]` | Yes | Array of status history entries |
| `showNotes` | `boolean` | No | Whether to display notes (default: true) |

### StatusHistoryEntry Interface

```typescript
interface StatusHistoryEntry {
  id: string;
  status: OrderStatus;
  note?: string | null;
  changedBy?: string | null;
  changedByName?: string;
  createdAt: Date | string;
}
```

### Visual Layout

```
┌─────────────────────────────────────────────────┐
│ Status History                                  │
├─────────────────────────────────────────────────┤
│                                                 │
│ ● [Processing] Current Status    Dec 2, 2:30 PM│
│ │ 👤 Updated by Administrator                   │
│ │ Note: Order is being prepared                 │
│ │                                               │
│ ● [Pending]                      Dec 1, 10:15 AM│
│   🤖 Updated automatically by system            │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Complete Example

### Order Detail Page Integration

```typescript
import { useState, useEffect } from 'react';
import { OrderStatusTracker, OrderStatusTimeline } from '~/components/order';

export default function OrderDetailPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistoryEntry[]>([]);

  // Load order and history...

  return (
    <div className="space-y-6">
      {/* Status Tracker */}
      <OrderStatusTracker
        currentStatus={order.status}
        estimatedDelivery={order.shippedAt ? calculateEstimatedDelivery(order.shippedAt) : null}
        cancelledReason={getCancellationReason()}
        refundedReason={getRefundReason()}
      />

      {/* Status Timeline */}
      {statusHistory.length > 0 && (
        <OrderStatusTimeline
          history={statusHistory}
          showNotes={true}
        />
      )}
    </div>
  );
}
```

## Styling

Both components use Tailwind CSS and follow the Ekoe design system:

- **Cards**: White background with gray border
- **Spacing**: Consistent padding and margins
- **Typography**: Clear hierarchy with appropriate font sizes
- **Colors**: Status-specific color coding
- **Responsive**: Works on mobile and desktop

## Status Colors

| Status | Background | Text | Border |
|--------|-----------|------|--------|
| Pending | Yellow 100 | Yellow 800 | Yellow 200 |
| Processing | Blue 100 | Blue 800 | Blue 200 |
| Shipped | Purple 100 | Purple 800 | Purple 200 |
| Delivered | Green 100 | Green 800 | Green 200 |
| Cancelled | Red 100 | Red 800 | Red 200 |
| Refunded | Gray 100 | Gray 800 | Gray 200 |

## Accessibility

- Semantic HTML structure
- Color is not the only indicator (icons and text labels)
- Proper heading hierarchy
- Screen reader friendly
- Keyboard navigable

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires JavaScript enabled

## Performance

- Lightweight components with minimal re-renders
- No external dependencies beyond React and Lucide icons
- Efficient date formatting
- Optimized for large status histories

## Common Patterns

### Calculating Estimated Delivery

```typescript
const getEstimatedDelivery = (shippedDate: Date) => {
  const estimated = new Date(shippedDate);
  estimated.setDate(estimated.getDate() + 7); // Add 7 days
  return estimated;
};
```

### Extracting Reasons from History

```typescript
const getCancellationReason = () => {
  const cancelEntry = statusHistory.find(entry => entry.status === 'cancelled');
  return cancelEntry?.note || null;
};

const getRefundReason = () => {
  const refundEntry = statusHistory.find(entry => entry.status === 'refunded');
  return refundEntry?.note || null;
};
```

### Formatting Dates

```typescript
const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatTime = (date: Date | string) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
```

## Troubleshooting

### Timeline Not Showing

**Problem**: Timeline component renders but shows "No status history available"

**Solution**: Ensure `history` prop is not empty and contains valid entries

```typescript
// Check if history is loaded
if (statusHistory.length === 0) {
  console.log('No status history loaded');
}
```

### Estimated Delivery Not Showing

**Problem**: Estimated delivery date not displayed for shipped orders

**Solution**: Ensure `estimatedDelivery` prop is provided and order status is "shipped"

```typescript
// Only show for shipped orders
{order.status === 'shipped' && (
  <OrderStatusTracker
    currentStatus={order.status}
    estimatedDelivery={calculateEstimatedDelivery(order.shippedAt)}
  />
)}
```

### Progress Bar Not Updating

**Problem**: Progress bar doesn't reflect current status

**Solution**: Ensure `currentStatus` prop is correctly typed and matches one of the valid statuses

```typescript
// Valid statuses
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
```

## Best Practices

1. **Always provide status history**: Even if empty, pass an empty array
2. **Handle loading states**: Show skeleton or spinner while loading
3. **Error boundaries**: Wrap components in error boundaries for graceful failures
4. **Memoization**: Use `useMemo` for expensive calculations like date formatting
5. **Accessibility**: Ensure proper ARIA labels for screen readers
6. **Testing**: Test all status transitions and edge cases

## Related Components

- `Badge` - Used for status indicators
- `Card` - Container components
- `Separator` - Visual dividers
- Lucide Icons - Icon library

## API Integration

### Fetching Order Details

```typescript
const response = await apiClient.get<SuccessResponseWrapper<OrderDetail>>(
  `/api/orders/${orderId}`
);
const order = response.data.data;
```

### Fetching Status History

```typescript
const response = await apiClient.get<SuccessResponseWrapper<{ history: OrderStatusHistory[] }>>(
  `/api/orders/${orderId}/status-history`
);
const history = response.data.data.history;
```

## Support

For issues or questions:
1. Check this usage guide
2. Review the implementation summary
3. Check the design document
4. Contact the development team
