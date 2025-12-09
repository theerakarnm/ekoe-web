import { useEffect, useState } from "react";
import { Link, useLoaderData, useParams, useSearchParams } from "react-router";
import { CheckCircle, Package, MapPin, Mail, AlertCircle, CreditCard, QrCode } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { formatCurrencyFromCents } from "~/lib/formatter";
import { useCartStore } from "~/store/cart";
import { apiClient, type SuccessResponseWrapper } from "~/lib/api-client";
import { createPromptPayPayment, initiate2C2PPayment, getPaymentsByOrderId } from "~/lib/services/payment.service";
import { getOrderByInvoiceNo, type OrderDetail } from "~/lib/services/order.service";
import type { Payment } from "~/lib/services/payment.service";

export function meta() {
  return [
    { title: "Order Confirmation - Ekoe" },
    { name: "description", content: "Your order has been confirmed" },
  ];
}

/**
 * Loader to fetch order details by invoice number and payment information
 */
export async function loader({ params, request }: { params: { invoiceNo: string }; request: Request }) {
  try {
    const url = new URL(request.url);
    const showRetry = url.searchParams.get('retry') === 'true';

    // Get order by invoice number
    const order = await getOrderByInvoiceNo(params.invoiceNo);

    // Fetch payment information if order exists
    let payments: Payment[] = [];
    try {
      payments = await getPaymentsByOrderId(order.id);
    } catch (error) {
      console.error('Failed to load payments:', error);
    }

    return {
      order,
      payments,
      showRetry,
      hasFailedPayment: payments.some(p => p.status === 'failed'),
      isPending: order.paymentStatus === 'pending',
    };
  } catch (error) {
    console.error('Failed to load order:', error);
    throw new Response("Order not found", { status: 404 });
  }
}

export default function OrderSuccessByInvoice() {
  const { order, payments, showRetry, hasFailedPayment, isPending } = useLoaderData<{
    order: OrderDetail;
    payments: Payment[];
    showRetry: boolean;
    hasFailedPayment: boolean;
    isPending: boolean;
  }>();
  const clearCart = useCartStore((state) => state.clearCart);
  const [searchParams] = useSearchParams();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'promptpay' | 'credit_card'>('credit_card');
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryError, setRetryError] = useState<string | null>(null);

  // Clear cart on mount
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  // Handle payment retry
  const handleRetryPayment = async () => {
    setIsRetrying(true);
    setRetryError(null);

    try {
      if (selectedPaymentMethod === 'promptpay') {
        // Create PromptPay payment
        const payment = await createPromptPayPayment(order.id, order.totalAmount);
        window.location.href = `/payment/promptpay/${payment.paymentId}`;
      } else if (selectedPaymentMethod === 'credit_card') {
        // Initiate 2C2P payment
        const returnUrl = `${window.location.origin}/payment/2c2p/return`;
        const payment = await initiate2C2PPayment(order.id, order.totalAmount, returnUrl);
        window.location.href = payment.paymentUrl;
      }
    } catch (error) {
      console.error('Payment retry error:', error);
      setRetryError('Failed to initiate payment. Please try again or contact support.');
      setIsRetrying(false);
    }
  };

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
        {/* Success Message or Payment Pending */}
        {order.paymentStatus === 'paid' ? (
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
        ) : (
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
              <AlertCircle className="w-10 h-10 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-serif text-gray-900 mb-2">
              Order Created - Payment Pending
            </h1>
            <p className="text-gray-600">
              Your order has been created but payment is still pending.
            </p>
          </div>
        )}

        {/* Payment Failed Alert */}
        {(hasFailedPayment || showRetry) && order.paymentStatus !== 'paid' && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Payment Failed</AlertTitle>
            <AlertDescription>
              Your previous payment attempt was unsuccessful. Please try again with a different payment method or contact support if you need assistance.
            </AlertDescription>
          </Alert>
        )}

        {/* Retry Payment Section */}
        {(showRetry || (hasFailedPayment && order.paymentStatus !== 'paid')) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Retry Payment</CardTitle>
              <CardDescription>
                Select a payment method to complete your order
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {retryError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{retryError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <Label>Payment Method</Label>
                <RadioGroup
                  value={selectedPaymentMethod}
                  onValueChange={(value) => setSelectedPaymentMethod(value as 'promptpay' | 'credit_card')}
                  className="flex flex-col space-y-0"
                >
                  {/* Credit Card Option */}
                  <div className={`border rounded-t-md p-4 ${selectedPaymentMethod === 'credit_card' ? 'bg-gray-50 border-black z-10' : 'border-gray-200'}`}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit_card" id="retry_credit_card" />
                      <div className="flex-1 flex justify-between items-center">
                        <Label htmlFor="retry_credit_card" className="font-medium cursor-pointer">Credit card</Label>
                        <div className="flex gap-1">
                          <div className="w-8 h-5 bg-blue-600 rounded text-[8px] text-white flex items-center justify-center font-bold italic">VISA</div>
                          <div className="w-8 h-5 bg-red-500 rounded text-[8px] text-white flex items-center justify-center font-bold">MC</div>
                        </div>
                      </div>
                    </div>
                    {selectedPaymentMethod === 'credit_card' && (
                      <div className="mt-4 pl-6 text-sm text-gray-500">
                        You will be redirected to a secure payment page to enter your card details.
                      </div>
                    )}
                  </div>

                  {/* PromptPay Option */}
                  <div className={`border border-t-0 rounded-b-md p-4 ${selectedPaymentMethod === 'promptpay' ? 'bg-gray-50 border-black' : 'border-gray-200'}`}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="promptpay" id="retry_promptpay" />
                      <div className="flex-1 flex justify-between items-center">
                        <Label htmlFor="retry_promptpay" className="font-medium cursor-pointer">PromptPay QR Code</Label>
                        <QrCode size={20} />
                      </div>
                    </div>
                    {selectedPaymentMethod === 'promptpay' && (
                      <div className="mt-4 pl-6 text-sm text-gray-500">
                        You will be shown a QR code to scan with your mobile banking app.
                      </div>
                    )}
                  </div>
                </RadioGroup>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleRetryPayment}
                  disabled={isRetrying}
                  className="flex-1"
                >
                  {isRetrying ? 'Processing...' : `Pay ${formatCurrencyFromCents(order.totalAmount, { symbol: '฿' })}`}
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="flex-1"
                >
                  <Link to="/">Cancel</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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

        {/* Payment Status */}
        {payments.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                Payment attempts for this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium capitalize">
                          {payment.paymentMethod.replace('_', ' ')}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                          }`}>
                          {payment.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(payment.createdAt).toLocaleString()}
                      </p>
                      {payment.transactionId && (
                        <p className="text-xs text-gray-500 font-mono">
                          Ref: {payment.transactionId}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatCurrencyFromCents(payment.amount, { symbol: '฿' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
                  {order.paymentStatus === 'paid' ? (
                    <>
                      We've sent a confirmation email to <strong>{order.email}</strong> with your order details.
                      You'll receive another email when your order ships.
                    </>
                  ) : (
                    <>
                      Once your payment is completed, we'll send a confirmation email to <strong>{order.email}</strong>.
                      Please complete the payment to proceed with your order.
                    </>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/shop">Continue Shopping</Link>
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
