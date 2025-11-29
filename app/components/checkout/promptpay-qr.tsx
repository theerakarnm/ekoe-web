import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { QrCode, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { getPaymentStatus } from "~/lib/services/payment.service";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

interface PromptPayQRProps {
  paymentId: string;
  qrCode: string;
  amount: number;
  expiresAt: Date;
  orderId: string;
  onPaymentComplete?: () => void;
}

export function PromptPayQR({
  paymentId,
  qrCode,
  amount,
  expiresAt,
  orderId,
  onPaymentComplete,
}: PromptPayQRProps) {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isPolling, setIsPolling] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "completed" | "failed" | "expired">("pending");
  const [error, setError] = useState<string | null>(null);

  // Calculate time remaining
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const expiryTime = new Date(expiresAt).getTime();
      const remaining = Math.max(0, Math.floor((expiryTime - now) / 1000));
      setTimeRemaining(remaining);

      if (remaining === 0 && paymentStatus === "pending") {
        setPaymentStatus("expired");
        setIsPolling(false);
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, paymentStatus]);

  // Poll payment status
  const pollPaymentStatus = useCallback(async () => {
    if (!isPolling) return;

    try {
      const status = await getPaymentStatus(paymentId);
      
      if (status.status === "completed") {
        setPaymentStatus("completed");
        setIsPolling(false);
        
        // Call callback if provided
        if (onPaymentComplete) {
          onPaymentComplete();
        }
        
        // Redirect to success page after a short delay
        setTimeout(() => {
          navigate(`/order-success/${orderId}`);
        }, 1500);
      } else if (status.status === "failed") {
        setPaymentStatus("failed");
        setIsPolling(false);
      }
    } catch (err) {
      console.error("Error polling payment status:", err);
      setError("Failed to check payment status. Please refresh the page.");
    }
  }, [paymentId, isPolling, orderId, navigate, onPaymentComplete]);

  // Set up polling interval
  useEffect(() => {
    if (!isPolling) return;

    // Poll immediately
    pollPaymentStatus();

    // Then poll every 5 seconds
    const interval = setInterval(pollPaymentStatus, 5000);

    return () => clearInterval(interval);
  }, [pollPaymentStatus, isPolling]);

  // Format time remaining
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Format amount
  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-serif">
            {paymentStatus === "pending" && "Scan QR Code to Pay"}
            {paymentStatus === "completed" && "Payment Successful!"}
            {paymentStatus === "failed" && "Payment Failed"}
            {paymentStatus === "expired" && "Payment Expired"}
          </CardTitle>
          <CardDescription>
            {paymentStatus === "pending" && "Use your mobile banking app to scan and complete payment"}
            {paymentStatus === "completed" && "Your payment has been confirmed"}
            {paymentStatus === "failed" && "There was an issue processing your payment"}
            {paymentStatus === "expired" && "This payment QR code has expired"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Payment Status Indicator */}
          {paymentStatus === "completed" && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Payment Confirmed</AlertTitle>
              <AlertDescription className="text-green-700">
                Redirecting you to order confirmation...
              </AlertDescription>
            </Alert>
          )}

          {paymentStatus === "failed" && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Payment Failed</AlertTitle>
              <AlertDescription>
                Your payment could not be processed. Please try again or use a different payment method.
              </AlertDescription>
            </Alert>
          )}

          {paymentStatus === "expired" && (
            <Alert variant="destructive">
              <Clock className="h-4 w-4" />
              <AlertTitle>Payment Expired</AlertTitle>
              <AlertDescription>
                This QR code has expired. Please return to checkout to generate a new payment.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* QR Code Display */}
          {paymentStatus === "pending" && (
            <>
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200">
                    <img
                      src={qrCode}
                      alt="PromptPay QR Code"
                      className="w-64 h-64"
                    />
                  </div>
                  {isPolling && (
                    <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  )}
                </div>

                {/* Amount Display */}
                <div className="text-center">
                  <div className="text-sm text-gray-600">Amount to Pay</div>
                  <div className="text-3xl font-bold">{formatAmount(amount)}</div>
                </div>

                {/* Timer Display */}
                <div className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <span className="font-mono font-semibold">
                    {formatTime(timeRemaining)}
                  </span>
                  <span className="text-sm text-gray-600">remaining</span>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full">
                  <div className="flex items-start gap-3">
                    <QrCode className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                    <div className="text-sm text-blue-900 space-y-2">
                      <p className="font-medium">How to pay with PromptPay:</p>
                      <ol className="list-decimal list-inside space-y-1 text-blue-800">
                        <li>Open your mobile banking app</li>
                        <li>Select "Scan QR" or "PromptPay"</li>
                        <li>Scan the QR code above</li>
                        <li>Confirm the payment amount</li>
                        <li>Complete the transaction</li>
                      </ol>
                      <p className="text-xs text-blue-700 mt-2">
                        Payment will be confirmed automatically once completed
                      </p>
                    </div>
                  </div>
                </div>

                {/* Polling Indicator */}
                {isPolling && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Waiting for payment confirmation...</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Action Buttons */}
          {(paymentStatus === "failed" || paymentStatus === "expired") && (
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
          )}

          {paymentStatus === "completed" && (
            <div className="flex justify-center">
              <Button onClick={() => navigate(`/order-success/${orderId}`)}>
                View Order Details
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
