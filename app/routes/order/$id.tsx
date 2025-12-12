import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, Package, MapPin, Mail, Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { Badge } from '~/components/ui/badge';
import { formatCurrencyFromCents } from '~/lib/formatter';
import { apiClient, type SuccessResponseWrapper } from '~/lib/api-client';
import { showError } from '~/lib/toast';
import { OrderStatusTracker } from '~/components/order/order-status-tracker';
import { OrderStatusTimeline } from '~/components/order/order-status-timeline';
import type { OrderDetail } from '~/lib/services/order.service';
import { useCartStore } from '~/store/cart';
import { useNavigate } from 'react-router';

interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  note?: string | null;
  changedBy?: string | null;
  changedByName?: string;
  createdAt: Date | string;
}

export function meta() {
  return [
    { title: 'Order Details - Ekoe' },
    { name: 'description', content: 'View your order details and track status' },
  ];
}

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

const paymentStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [statusHistory, setStatusHistory] = useState<OrderStatusHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCartStore();
  const navigate = useNavigate();
  const [isReordering, setIsReordering] = useState(false);

  useEffect(() => {
    if (id) {
      loadOrderDetails();
    }
  }, [id]);

  const loadOrderDetails = async () => {
    setIsLoading(true);
    try {
      // Fetch order details
      const orderResponse = await apiClient.get<SuccessResponseWrapper<OrderDetail>>(
        `/api/orders/${id}`
      );
      const orderData = orderResponse.data.data;
      setOrder(orderData);

      // Fetch status history
      try {
        const historyResponse = await apiClient.get<
          SuccessResponseWrapper<{ history: OrderStatusHistory[] }>
        >(`/api/orders/${id}/status-history`);
        setStatusHistory(historyResponse.data.data.history);
      } catch (error) {
        console.error('Failed to load status history:', error);
        // Continue even if history fails
      }
    } catch (error) {
      console.error('Load order error:', error);
      showError('Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get cancellation or refund reason from status history
  const getCancellationReason = () => {
    const cancelEntry = statusHistory.find((entry) => entry.status === 'cancelled');
    return cancelEntry?.note || null;
  };

  const getRefundReason = () => {
    const refundEntry = statusHistory.find((entry) => entry.status === 'refunded');
    return refundEntry?.note || null;
  };

  // Calculate estimated delivery (example: 5-7 days from shipped date)
  const getEstimatedDelivery = () => {
    if (order?.status === 'shipped' && order.shippedAt) {
      const shippedDate = new Date(order.shippedAt);
      const estimatedDate = new Date(shippedDate);
      estimatedDate.setDate(estimatedDate.getDate() + 7); // Add 7 days
      return estimatedDate;
    }
    return null;
  };

  const handleReOrder = async () => {
    if (!order) return;
    setIsReordering(true);
    try {
      let addedCount = 0;
      for (const item of order.items) {
        // Use product snapshot for image if available, or fallback
        const image = item.productSnapshot?.images?.[0] || '';

        await addItem({
          productId: item.productId || '',
          variantId: item.variantId || undefined,
          productName: item.productName,
          variantName: item.variantName || undefined,
          image,
          price: item.unitPrice,
          quantity: item.quantity,
        });
        addedCount++;
      }

      if (addedCount > 0) {
        // Redirect to cart
        navigate('/cart');
      } else {
        showError('No available items to re-order');
      }
    } catch (error) {
      console.error('Re-order error:', error);
      showError('Failed to add items to cart');
    } finally {
      setIsReordering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the order you're looking for.
          </p>
          <Button asChild>
            <Link to="/account">View Order History</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/account"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Account
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
              <p className="text-gray-600 mt-1">Order #{order.orderNumber}</p>
            </div>
            <Badge className={paymentStatusColors[order.paymentStatus as keyof typeof paymentStatusColors]}>
              Payment: {order.paymentStatus}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Status Tracking */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Tracker */}
            <OrderStatusTracker
              currentStatus={order.status as OrderStatus}
              estimatedDelivery={getEstimatedDelivery()}
              cancelledReason={getCancellationReason()}
              refundedReason={getRefundReason()}
            />

            {/* Status Timeline */}
            {statusHistory.length > 0 && (
              <OrderStatusTimeline history={statusHistory} showNotes={true} />
            )}

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start pb-4 border-b last:border-b-0 last:pb-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        {item.variantName && (
                          <p className="text-sm text-gray-500">{item.variantName}</p>
                        )}
                        {item.sku && (
                          <p className="text-xs text-gray-400 mt-1">SKU: {item.sku}</p>
                        )}
                        <p className="text-sm text-gray-600 mt-1">
                          Quantity: {item.quantity} × {formatCurrencyFromCents(item.unitPrice, { symbol: '฿' })}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {formatCurrencyFromCents(item.subtotal, { symbol: '฿' })}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary & Addresses */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {formatCurrencyFromCents(order.subtotal, { symbol: '฿' })}
                  </span>
                </div>
                {order.shippingCost !== null && order.shippingCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {formatCurrencyFromCents(order.shippingCost, { symbol: '฿' })}
                    </span>
                  </div>
                )}
                {order.taxAmount !== null && order.taxAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">
                      {formatCurrencyFromCents(order.taxAmount, { symbol: '฿' })}
                    </span>
                  </div>
                )}
                {order.discountAmount !== null && order.discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">
                      -{formatCurrencyFromCents(order.discountAmount, { symbol: '฿' })}
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{formatCurrencyFromCents(order.totalAmount, { symbol: '฿' })}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MapPin className="w-4 h-4" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p className="font-medium">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                    {order.shippingAddress.company && (
                      <p>{order.shippingAddress.company}</p>
                    )}
                    <p>{order.shippingAddress.addressLine1}</p>
                    {order.shippingAddress.addressLine2 && (
                      <p>{order.shippingAddress.addressLine2}</p>
                    )}
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.province}{' '}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                    <p className="pt-2">{order.shippingAddress.phone}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Mail className="w-4 h-4" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{order.email}</p>
              </CardContent>
            </Card>

            {/* Order Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Important Dates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Placed</span>
                  <span className="font-medium">{formatDate(order.createdAt)}</span>
                </div>
                {order.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Received</span>
                    <span className="font-medium">{formatDate(order.paidAt)}</span>
                  </div>
                )}
                {order.shippedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipped</span>
                    <span className="font-medium">{formatDate(order.shippedAt)}</span>
                  </div>
                )}
                {order.deliveredAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivered</span>
                    <span className="font-medium">{formatDate(order.deliveredAt)}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Note */}
            {order.customerNote && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Order Note</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{order.customerNote}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <Button asChild variant="outline">
            <Link to="/shop">Continue Shopping</Link>
          </Button>
          <Button
            onClick={handleReOrder}
            disabled={isReordering}
          >
            {isReordering ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding to Cart...
              </>
            ) : (
              'Re-order'
            )}
          </Button>
          <Button asChild variant="outline">
            <Link to="/account">View All Orders</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
