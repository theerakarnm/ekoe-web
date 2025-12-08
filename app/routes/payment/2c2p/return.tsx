import type { Route } from "./+types/return";
import { useEffect, useState } from "react";
import { redirect, useActionData } from "react-router";
import { handle2C2PReturn, process2C2PReturnData } from "~/lib/services/payment.service";
import { CustomerAuthGuard } from "~/components/auth/customer-auth-guard";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { log } from "console";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Payment Result - Ekoe" },
    { name: "description", content: "Your payment result" },
  ];
}

/**
 * Loader function to handle 2C2P return and check payment status
 */
/**
 * Action function to handle 2C2P POST return (method: POST)
 */
export async function action({ request }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    // 2C2P V4.3 sends 'paymentResponse' or 'frontendReturnData' in the POST body
    const paymentResponse = formData.get('paymentResponse') as string

    if (!paymentResponse) {
      return {
        data: null,
        error: 'Missing payment response data',
        status: 'error' as const,
      };
    }

    console.log({ paymentResponseAction: paymentResponse, objectx: atob(paymentResponse) });

    return {
      data: JSON.parse(atob(paymentResponse)) as {
        invoiceNo: string;
        respCode: string;
        respDesc: string;
      },
      error: null,
      status: 'success' as const,
    }

  } catch (error) {
    console.error('Failed to process payment POST return:', error);
    return {
      data: null,
      error: 'Failed to process payment result',
      status: 'error' as const,
    };
  }
}

/**
 * Loader function to handle 2C2P return and check payment status (method: GET)
 */
export async function loader({ request }: Route.LoaderArgs) {
  return null;
}

export default function TwoC2PReturnPage({ loaderData }: Route.ComponentProps) {
  const actionData = useActionData<typeof action>();

  // Use actionData if available (from POST), otherwise loaderData (from GET)
  const result = actionData;

  console.log(result);


  // If neither (initial load of action path without post? shouldn't happen for return URL usually), show loading or return null
  if (!result) return null;

  const { data, status, error } = result;
  const [isRedirecting, setIsRedirecting] = useState(false);

  if (!data) return null;

  // Auto-redirect on success after a short delay
  useEffect(() => {
    if (data.invoiceNo) {
      setIsRedirecting(true);
      const timer = setTimeout(() => {
        window.location.href = `/order-success/${data.invoiceNo}`;
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [actionData]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-serif text-gray-800">Ekoe</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Payment Success */}
        {status === 'success' && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-serif mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              {'Your payment has been processed successfully.'}
            </p>
            {isRedirecting ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Redirecting to order confirmation...</p>
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <Button asChild>
                <a href={`/order-success/${data.invoiceNo}`}>View Order Details</a>
              </Button>
            )}
          </div>
        )}

        {/* Payment Failed */}
        {/* {status === 'error' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-serif mb-2">Payment Failed</h2>
                <p className="text-gray-600 mb-6">
                  {'Your payment could not be processed. Please try again.'}
                </p>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>What's next?</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Check your card details and try again</li>
                    <li>Try a different payment method</li>
                    <li>Contact your bank if the issue persists</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="flex justify-center gap-4">
                <Button asChild variant="outline">
                  <a href="/cart">View Cart</a>
                </Button>
                <Button asChild>
                  <a href={`/order-success/${orderId}?retry=true`}>Retry Payment</a>
                </Button>
              </div>
            </div>
          )} */}

        {/* Payment Pending */}
        {/* {status === 'pending' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                  <AlertCircle className="h-8 w-8 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-serif mb-2">Payment Pending</h2>
                <p className="text-gray-600 mb-6">
                  {result?.message || 'Your payment is being processed. This may take a few moments.'}
                </p>
                {result?.transactionRef && (
                  <p className="text-sm text-gray-500 mb-6">
                    Transaction Reference: <span className="font-mono">{result.transactionRef}</span>
                  </p>
                )}
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Please wait</AlertTitle>
                <AlertDescription>
                  Your payment is being verified. You will receive an email confirmation once the payment is processed.
                  You can check your order status in your account.
                </AlertDescription>
              </Alert>

              <div className="flex justify-center gap-4">
                <Button asChild variant="outline">
                  <a href="/">Return Home</a>
                </Button>
                {orderId && (
                  <Button asChild>
                    <a href={`/order-success/${orderId}`}>View Order</a>
                  </Button>
                )}
              </div>
            </div>
          )} */}

        {/* Error State */}
        {/* {status === 'error' && (
            <div className="space-y-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Processing Payment</AlertTitle>
                <AlertDescription>{error || 'An unexpected error occurred.'}</AlertDescription>
              </Alert>

              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h2 className="text-xl font-serif mb-4">Need Help?</h2>
                <p className="text-gray-600 mb-6">
                  If you believe your payment was successful but you're seeing this error,
                  please contact our support team with your order details.
                </p>
                <div className="flex justify-center gap-4">
                  <Button asChild variant="outline">
                    <a href="/cart">View Cart</a>
                  </Button>
                  {data && (
                    <Button asChild>
                      <a href={`/order-success/${data?.invoiceId}`}>View Order</a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )} */}
      </main>
    </div>
  );
}
