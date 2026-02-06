import { useEffect, useRef } from "react";
import { Link, redirect, useLoaderData } from "react-router";
import { CheckCircle, Package, MapPin, CreditCard, Calendar } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { apiClient, type SuccessResponseWrapper } from "~/lib/api-client";
import type { OrderDetail, OrderItemDetail } from "~/lib/services/order.service";
import { formatCurrencyFromCents } from "~/lib/formatter";
import { useCartStore } from "~/store/cart";
import { OrderPromotionDisplay } from "~/components/promotion/order-promotion-display";
import * as fbq from "~/lib/fpixel";

export function meta() {
  return [
    { title: "Order Confirmation - Ekoe" },
    { name: "description", content: "Your order has been confirmed" },
  ];
}

/**
 * Loader function to fetch order details
 */
export async function loader({ params }: { params: { orderId: string } }) {
  const { orderId } = params;

  if (!orderId) {
    throw redirect("/");
  }

  try {
    const response = await apiClient.get<SuccessResponseWrapper<OrderDetail>>(
      `/api/orders/${orderId}`
    );

    return { order: response.data.data };
  } catch (error) {
    console.error("Failed to load order:", error);
    throw redirect("/");
  }
}

/**
 * Calculate estimated delivery date based on order creation date and shipping method
 */
function calculateEstimatedDelivery(createdAt: string, estimatedDays: number = 7): string {
  const orderDate = new Date(createdAt);
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + estimatedDays);

  return deliveryDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Get shipping method estimated days from shipping cost
 * This is a fallback - ideally we'd store the shipping method in the order
 */
function getEstimatedDaysFromCost(shippingCost: number | null): number {
  if (!shippingCost) return 7; // Default to standard shipping

  // Based on shipping.config.ts
  if (shippingCost >= 15000) return 1; // Next day
  if (shippingCost >= 10000) return 3; // Express
  return 7; // Standard
}

export default function OrderConfirmation() {
  const { order } = useLoaderData<{ order: OrderDetail }>();
  const clearCart = useCartStore((state) => state.clearCart);

  // Clear cart on successful order
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  // 📊 Meta Pixel: Track Purchase เมื่อสั่งซื้อสำเร็จ (ใช้ order.id เป็น eventId เพื่อ dedup กับ server)
  const hasTrackedPurchase = useRef(false);
  useEffect(() => {
    if (hasTrackedPurchase.current) return;

    hasTrackedPurchase.current = true;
    // Use order.id as eventId for deduplication with server-side CAPI
    const eventId = `purchase-${order.id}`;

    fbq.purchase({
      content_ids: order.items.map((item: OrderItemDetail) => item.productId).filter((id): id is string => id !== null),
      content_type: 'product',
      value: order.totalAmount / 100,  // Convert from cents to THB
      currency: 'THB',
      num_items: order.items.reduce((sum: number, item: OrderItemDetail) => sum + item.quantity, 0),
      order_id: order.orderNumber,
    }, eventId);
  }, [order.id, order.items, order.totalAmount, order.orderNumber]);

  const estimatedDays = getEstimatedDaysFromCost(order.shippingCost);
  const estimatedDelivery = calculateEstimatedDelivery(order.createdAt, estimatedDays);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/" className="text-2xl font-serif text-gray-800">
            Ekoe
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-serif text-gray-900 mb-2">
            Thank you for your order!
          </h1>
          <p className="text-lg text-gray-600">
            Your order has been confirmed and will be shipped soon.
          </p>
        </div>

        {/* Order Number and Delivery Estimate */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Number</p>
                <p className="text-lg font-semibold text-gray-900">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Estimated Delivery
                </p>
                <p className="text-lg font-semibold text-gray-900">{estimatedDelivery}</p>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Date</p>
              <p className="text-gray-900">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>
              {order.items.length} {order.items.length === 1 ? "item" : "items"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Order Items */}
              {order.items.map((item: OrderItemDetail) => (
                <div key={item.id} className="flex gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.productName}</h3>
                    {item.variantName && (
                      <p className="text-sm text-gray-600">{item.variantName}</p>
                    )}
                    {item.sku && (
                      <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatCurrencyFromCents(item.subtotal)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatCurrencyFromCents(item.unitPrice)} each
                    </p>
                  </div>
                </div>
              ))}

              <Separator />

              {/* Pricing Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrencyFromCents(order.subtotal)}</span>
                </div>
                {order.shippingCost !== null && order.shippingCost > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{formatCurrencyFromCents(order.shippingCost)}</span>
                  </div>
                )}
                {order.taxAmount !== null && order.taxAmount > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>{formatCurrencyFromCents(order.taxAmount)}</span>
                  </div>
                )}
                {order.discountAmount !== null && order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrencyFromCents(order.discountAmount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{formatCurrencyFromCents(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applied Promotions */}
        {order.appliedPromotions && Array.isArray(order.appliedPromotions) && order.appliedPromotions.length > 0 && (
          <OrderPromotionDisplay
            appliedPromotions={order.appliedPromotions}
            totalDiscountAmount={order.promotionDiscountAmount ?? 0}
            totalGiftValue={order.appliedPromotions.reduce(
              (sum: number, promo: any) => sum + promo.freeGifts.reduce(
                (giftSum: number, gift: any) => giftSum + (gift.value || 0), 0
              ), 0
            )}
            orderSubtotal={order.subtotal}
            showSavingsPercentage={true}
            className="mb-8"
          />
        )}

        {/* Shipping Address */}
        {order.shippingAddress && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">
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
                  {order.shippingAddress.city}, {order.shippingAddress.province}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Confirmation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Confirmation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status</span>
                <span className="font-medium text-gray-900 capitalize">
                  {order.paymentStatus === "paid" ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Paid
                    </span>
                  ) : (
                    <span className="text-yellow-600 capitalize">{order.paymentStatus}</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Status</span>
                <span className="font-medium text-gray-900 capitalize">{order.status}</span>
              </div>
              {order.paidAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Date</span>
                  <span className="text-gray-900">
                    {new Date(order.paidAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Customer Note */}
        {order.customerNote && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Note</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{order.customerNote}</p>
            </CardContent>
          </Card>
        )}

        {/* Confirmation Email Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-900">
            A confirmation email has been sent to <strong>{order.email}</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/products">Continue Shopping</Link>
          </Button>
          <Button asChild size="lg">
            <Link to="/profile/orders">View Order History</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-gray-600">
          <p>
            Need help? Contact us at{" "}
            <a href="mailto:ekoecare@ekoe.co.th" className="text-gray-900 hover:underline">
              ekoecare@ekoe.co.th
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
