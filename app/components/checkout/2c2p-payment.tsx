import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { CreditCard, Loader2, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { initiate2C2PPayment, getPaymentStatus } from "~/lib/services/payment.service";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

interface TwoC2PPaymentProps {
  orderId: string;
  amount: number;
  returnUrl: string;
  onInitiate?: (paymentUrl: string) => void;
}

export function TwoC2PPayment({
  orderId,
  amount,
  returnUrl,
  onInitiate,
}: TwoC2PPaymentProps) {
  const navigate = useNavigate();
  const [isInitiating, setIsInitiating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  // Format amount
  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
  };

  // Initiate payment
  const handleInitiatePayment = async () => {
    setIsInitiating(true);
    setError(null);

    try {
      const result = await initiate2C2PPayment(orderId, amount, returnUrl);
      setPaymentUrl(result.paymentUrl);

      // Call callback if provided
      if (onInitiate) {
        onInitiate(result.paymentUrl);
      }

      // Redirect to 2C2P payment page
      window.location.href = result.paymentUrl;
    } catch (err) {
      console.error("Error initiating 2C2P payment:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to initiate payment. Please try again."
      );
      setIsInitiating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-serif">Credit Card Payment</CardTitle>
          <CardDescription>
            You will be redirected to our secure payment gateway
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Payment Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Payment Information */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Order ID</span>
              <span className="font-mono text-sm">{orderId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Amount to Pay</span>
              <span className="text-2xl font-bold">{formatAmount(amount)}</span>
            </div>
          </div>

          {/* Payment Gateway Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-sm text-blue-900 space-y-2">
                <p className="font-medium">Secure Payment Processing</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Your payment is processed securely by 2C2P</li>
                  <li>We do not store your card details</li>
                  <li>All transactions are encrypted</li>
                  <li>Supports Visa, Mastercard, and other major cards</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="space-y-3">
            <Button
              onClick={handleInitiatePayment}
              disabled={isInitiating}
              className="w-full h-12 text-lg"
              size="lg"
            >
              {isInitiating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Redirecting to Payment Gateway...
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Proceed to Payment
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/checkout")}
              disabled={isInitiating}
              className="w-full"
            >
              Cancel and Return to Checkout
            </Button>
          </div>

          {/* Security Notice */}
          <p className="text-xs text-gray-500 text-center">
            By proceeding, you will be redirected to 2C2P's secure payment page.
            You can return to this site after completing or canceling the payment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

interface TwoC2PReturnHandlerProps {
  paymentId: string;
  orderId: string;
}

export function TwoC2PReturnHandler({
  paymentId,
  orderId,
}: TwoC2PReturnHandlerProps) {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<"completed" | "failed" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const status = await getPaymentStatus(paymentId);

        if (status.status === "completed") {
          setPaymentStatus("completed");
          // Redirect to confirmation page after a short delay
          setTimeout(() => {
            navigate(`/order-confirmation/${orderId}`);
          }, 2000);
        } else if (status.status === "failed") {
          setPaymentStatus("failed");
        } else {
          // Still pending, check again
          setTimeout(checkPaymentStatus, 2000);
          return;
        }
      } catch (err) {
        console.error("Error checking payment status:", err);
        setError("Failed to verify payment status. Please contact support.");
      } finally {
        setIsChecking(false);
      }
    };

    checkPaymentStatus();
  }, [paymentId, orderId, navigate]);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-serif">
            {isChecking && "Verifying Payment..."}
            {paymentStatus === "completed" && "Payment Successful!"}
            {paymentStatus === "failed" && "Payment Failed"}
          </CardTitle>
          <CardDescription>
            {isChecking && "Please wait while we confirm your payment"}
            {paymentStatus === "completed" && "Your payment has been confirmed"}
            {paymentStatus === "failed" && "There was an issue processing your payment"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Loading State */}
          {isChecking && (
            <div className="flex flex-col items-center space-y-4 py-8">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <p className="text-gray-600">Checking payment status...</p>
            </div>
          )}

          {/* Success State */}
          {paymentStatus === "completed" && (
            <>
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Payment Confirmed</AlertTitle>
                <AlertDescription className="text-green-700">
                  Your payment has been successfully processed. Redirecting to order confirmation...
                </AlertDescription>
              </Alert>

              <div className="flex justify-center">
                <Button onClick={() => navigate(`/order-confirmation/${orderId}`)}>
                  View Order Details
                </Button>
              </div>
            </>
          )}

          {/* Failed State */}
          {paymentStatus === "failed" && (
            <>
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Payment Failed</AlertTitle>
                <AlertDescription>
                  Your payment could not be processed. This could be due to insufficient funds,
                  card declined, or other issues. Please try again or use a different payment method.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => navigate("/checkout")}
                >
                  Return to Checkout
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
