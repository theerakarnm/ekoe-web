import { useEffect } from "react";
import { Link, useLoaderData, useParams } from "react-router";
import { CheckCircle, Package, MapPin, Mail } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { formatCurrencyFromCents } from "~/lib/formatter";
import { useCartStore } from "~/store/cart";
import { apiClient, type SuccessResponseWrapper } from "~/lib/api-client";
import type { OrderDetail } from "~/lib/services/order.service";

export function meta() {
  return [
    { title: "Order Confirmation - Ekoe" },
    { name: "description", content: "Your order has been confirmed" },
  ];
}

/**
 * Loader to fetch order details
 */
export async function loader({ params }: { params: { id: string } }) {
  try {
    const response = await apiClient.get<SuccessResponseWrapper<OrderDetail>>(
      `/api/orders/${params.id}`
    );
    return { order: response.data.data };
  } catch (error) {
    console.error('Failed to load order:', error);
    throw new Response("Order not found", { status: 404 });
  }
}

export default function OrderSuccess() {
  const { order } = useLoaderData<{ order: OrderDetail }>();
  const clearCart = useCartStore((state) => state.clearCart);

  // Clear cart on mount
  useEffect(() => {
    clearCart();
  }, [clearCart]);

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

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-serif text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        {/* Order Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Order Details</span>
              <span className="text-sm font-normal text-gray-600">
                Order #{order.orderNumber}
              </span>
            </CardTitle>
            <CardDescription>
              Confirmation email sent to {order.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Items */}
            <div>
              <h3 className="font-medium text-sm text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Items Ordered
              </h3>
              <div className="space-y-3">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.productName}</p>
                      {item.variantName && (
                        <p className="text-xs text-gray-500">{item.variantName}</p>
                      )}
                      <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-sm">
                      {formatCurrencyFromCents(item.subtotal, { symbol: '฿' })}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div>
                <h3 className="font-medium text-sm text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Shipping Address
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
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
                  <p>{order.shippingAddress.phone}</p>
                </div>
              </div>
            )}

            <Separator />

            {/* Order Summary */}
            <div>
              <h3 className="font-medium text-sm text-gray-900 mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatCurrencyFromCents(order.subtotal, { symbol: '฿' })}</span>
                </div>
                {order.shippingCost !== null && order.shippingCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{formatCurrencyFromCents(order.shippingCost, { symbol: '฿' })}</span>
                  </div>
                )}
                {order.taxAmount !== null && order.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>{formatCurrencyFromCents(order.taxAmount, { symbol: '฿' })}</span>
                  </div>
                )}
                {order.discountAmount !== null && order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrencyFromCents(order.discountAmount, { symbol: '฿' })}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-medium text-base">
                  <span>Total</span>
                  <span>{formatCurrencyFromCents(order.totalAmount, { symbol: '฿' })}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Info */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-sm text-gray-900 mb-1">
                  What's Next?
                </h3>
                <p className="text-sm text-gray-600">
                  We've sent a confirmation email to <strong>{order.email}</strong> with your order details.
                  You'll receive another email when your order ships.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/products">Continue Shopping</Link>
          </Button>
          <Button asChild size="lg">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-gray-600">
          <p>Need help? Contact us at support@ekoe.com</p>
        </div>
      </footer>
    </div>
  );
}
