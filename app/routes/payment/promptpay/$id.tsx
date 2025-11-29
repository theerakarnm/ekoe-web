import type { Route } from "./+types/$id";
import { useEffect, useState } from "react";
import { redirect } from "react-router";
import { getPaymentStatus } from "~/lib/services/payment.service";
import { PromptPayQR } from "~/components/checkout/promptpay-qr";
import { CustomerAuthGuard } from "~/components/auth/customer-auth-guard";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "PromptPay Payment - Ekoe" },
    { name: "description", content: "Complete your payment with PromptPay" },
  ];
}

/**
 * Loader function to fetch payment details
 */
export async function loader({ params }: Route.LoaderArgs) {
  const paymentId = params.id;

  if (!paymentId) {
    throw new Response("Payment ID is required", { status: 400 });
  }

  try {
    const payment = await getPaymentStatus(paymentId);
    
    // If payment is already completed, redirect to success page
    if (payment.status === 'completed') {
      // Get order ID from payment (we'll need to add this to the response)
      return redirect(`/order-success/${payment.orderId}`);
    }

    // If payment failed, show error
    if (payment.status === 'failed') {
      return {
        error: 'Payment has failed. Please try again.',
        payment,
      };
    }

    return { payment };
  } catch (error) {
    console.error('Failed to load payment:', error);
    return {
      error: 'Failed to load payment details. Please try again.',
    };
  }
}

export default function PromptPayPaymentPage({ loaderData }: Route.ComponentProps) {
  const { payment, error } = loaderData;
  const [paymentStatus, setPaymentStatus] = useState(payment?.status || 'pending');
  const [isPolling, setIsPolling] = useState(true);

  // Handle payment completion
  useEffect(() => {
    if (paymentStatus === 'completed' && payment?.orderId) {
      // Redirect to success page
      window.location.href = `/order-success/${payment.orderId}`;
    }
  }, [paymentStatus, payment?.orderId]);

  // Handle payment timeout
  const handleTimeout = () => {
    setIsPolling(false);
  };

  // Handle payment completion from polling
  const handlePaymentComplete = () => {
    setPaymentStatus('completed');
  };

  return (
    <CustomerAuthGuard>
      <div className="min-h-screen bg-gray-50 font-sans">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-serif text-gray-800">Ekoe</h1>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Error State */}
          {error && (
            <div className="space-y-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Payment Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <div className="flex justify-center gap-4">
                <Button asChild variant="outline">
                  <a href="/checkout">Back to Checkout</a>
                </Button>
                <Button asChild>
                  <a href="/cart">View Cart</a>
                </Button>
              </div>
            </div>
          )}

          {/* Payment Pending - Show QR Code */}
          {!error && payment && paymentStatus === 'pending' && isPolling && (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-serif mb-2">Complete Your Payment</h2>
                <p className="text-gray-600">
                  Scan the QR code below with your mobile banking app to complete the payment
                </p>
              </div>

              <PromptPayQR
                paymentId={payment.paymentId}
                qrCode={payment.qrCode}
                amount={payment.amount}
                expiresAt={new Date(payment.expiresAt)}
                onPaymentComplete={handlePaymentComplete}
                onTimeout={handleTimeout}
              />
            </div>
          )}

          {/* Payment Timeout */}
          {!error && payment && !isPolling && paymentStatus === 'pending' && (
            <div className="space-y-6">
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertTitle>Payment Expired</AlertTitle>
                <AlertDescription>
                  The payment QR code has expired. Please return to checkout to try again.
                </AlertDescription>
              </Alert>
              <div className="flex justify-center gap-4">
                <Button asChild variant="outline">
                  <a href="/cart">View Cart</a>
                </Button>
                <Button asChild>
                  <a href="/checkout">Return to Checkout</a>
                </Button>
              </div>
            </div>
          )}

          {/* Payment Completed */}
          {!error && paymentStatus === 'completed' && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-serif mb-2">Payment Successful!</h2>
              <p className="text-gray-600 mb-6">
                Redirecting to order confirmation...
              </p>
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
        </main>
      </div>
    </CustomerAuthGuard>
  );
}
