import type { Route } from "./+types/checkout";
import { useState, useEffect } from "react";
import { redirect } from "react-router";
import { CheckoutForm } from "~/components/checkout/checkout-form";
import { CheckoutSummary } from "~/components/checkout/checkout-summary";
import { CustomerAuthGuard } from "~/components/auth/customer-auth-guard";
import { ShoppingCart, AlertCircle } from "lucide-react";
import { useCartStore } from "~/store/cart";
import { validateCartItems, createOrder, type ValidationResult, type CreateOrderRequest } from "~/lib/services/order.service";
import { createPromptPayPayment, initiate2C2PPayment } from "~/lib/services/payment.service";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { ApiClientError } from "~/lib/api-client";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Checkout - Ekoe" },
    { name: "description", content: "Secure Checkout" },
  ];
}

/**
 * Action function to handle order creation and payment
 */
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  try {
    const paymentMethod = formData.get('paymentMethod') as string;

    // Parse form data into CreateOrderRequest
    const orderData: CreateOrderRequest = {
      email: formData.get('email') as string,
      items: JSON.parse(formData.get('items') as string),
      shippingAddress: {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        company: formData.get('company') as string || undefined,
        addressLine1: formData.get('address') as string,
        addressLine2: formData.get('apartment') as string || undefined,
        city: formData.get('city') as string,
        province: formData.get('province') as string,
        postalCode: formData.get('postalCode') as string,
        country: formData.get('country') as string,
        phone: formData.get('phone') as string,
      },
      billingAddress: {
        firstName: formData.get('billingFirstName') as string || formData.get('firstName') as string,
        lastName: formData.get('billingLastName') as string || formData.get('lastName') as string,
        company: formData.get('billingCompany') as string || formData.get('company') as string || undefined,
        addressLine1: formData.get('billingAddress') as string || formData.get('address') as string,
        addressLine2: formData.get('billingApartment') as string || formData.get('apartment') as string || undefined,
        city: formData.get('billingCity') as string || formData.get('city') as string,
        province: formData.get('billingProvince') as string || formData.get('province') as string,
        postalCode: formData.get('billingPostalCode') as string || formData.get('postalCode') as string,
        country: formData.get('billingCountry') as string || formData.get('country') as string,
        phone: formData.get('billingPhone') as string || formData.get('phone') as string,
      },
      customerNote: formData.get('customerNote') as string || undefined,
      discountCode: formData.get('discountCode') as string || undefined,
    };

    // Create the order
    const order = await createOrder(orderData);

    // Handle payment based on selected method
    if (paymentMethod === 'promptpay') {
      // Create PromptPay payment
      const payment = await createPromptPayPayment(order.id, order.totalAmount);
      
      // Redirect to PromptPay QR page
      return redirect(`/payment/promptpay/${payment.paymentId}`);
    } else if (paymentMethod === 'credit_card') {
      // Initiate 2C2P payment
      const returnUrl = `${request.url.split('/checkout')[0]}/payment/2c2p/return`;
      const payment = await initiate2C2PPayment(order.id, order.totalAmount, returnUrl);
      
      // Redirect to 2C2P payment page
      return redirect(payment.paymentUrl);
    }

    // Fallback: redirect to confirmation page (shouldn't happen)
    return redirect(`/order-confirmation/${order.id}`);
  } catch (error) {
    console.error('Order creation error:', error);

    // Handle API errors
    if (error instanceof ApiClientError) {
      return {
        error: error.message,
        code: error.code,
        field: error.field,
        details: error.cause
      };
    }

    // Handle generic errors
    return {
      error: 'Failed to create order. Please try again.',
    };
  }
}

export default function Checkout() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Validate cart on mount
  useEffect(() => {
    async function validateCart() {
      if (items.length === 0) {
        setIsValidating(false);
        return;
      }

      try {
        setIsValidating(true);
        setValidationError(null);

        // Convert cart items to validation format
        const cartItems = items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        }));

        const result = await validateCartItems(cartItems);
        setValidationResult(result);

        // Auto-update quantities if stock is insufficient
        if (!result.isValid) {
          result.items.forEach((validationItem) => {
            if (!validationItem.isValid && validationItem.availableStock > 0) {
              // Update to available stock
              updateQuantity(
                validationItem.productId,
                validationItem.availableStock,
                validationItem.variantId
              );
            } else if (!validationItem.isValid && validationItem.availableStock === 0) {
              // Remove item if out of stock
              removeItem(validationItem.productId, validationItem.variantId);
            }
          });
        }
      } catch (error) {
        console.error('Cart validation error:', error);
        setValidationError('Unable to validate cart items. Please try again.');
      } finally {
        setIsValidating(false);
      }
    }

    validateCart();
  }, []); // Only run on mount

  return (
    <CustomerAuthGuard>
      <div className="min-h-screen bg-white font-sans text-[#1a1a1a]">
        {/* Simplified Header */}
        <header className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
            <h1 className="text-2xl font-serif text-gray-800">Ekoe</h1>
            <button className="text-gray-700 hover:text-gray-900">
              <ShoppingCart className="h-6 w-6" />
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto">
          {/* Validation Warnings */}
          {validationError && (
            <div className="px-4 sm:px-6 lg:px-8 pt-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Validation Error</AlertTitle>
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            </div>
          )}

          {validationResult && !validationResult.isValid && (
            <div className="px-4 sm:px-6 lg:px-8 pt-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Cart Updated</AlertTitle>
                <AlertDescription>
                  <div className="space-y-2">
                    <p>Some items in your cart have been updated due to stock availability:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {validationResult.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Empty Cart Message */}
          {!isValidating && items.length === 0 && (
            <div className="px-4 sm:px-6 lg:px-8 py-12 text-center">
              <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-serif mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Add some items to your cart to continue shopping.</p>
              <Button asChild>
                <a href="/products">Continue Shopping</a>
              </Button>
            </div>
          )}

          {/* Checkout Form and Summary */}
          {(isValidating || items.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Column - Form */}
              <div className="px-4 sm:px-6 lg:px-12">
                <CheckoutForm
                  isValidating={isValidating}
                  validationResult={validationResult}
                />
              </div>

              {/* Right Column - Summary */}
              <div className="lg:sticky lg:top-0 lg:h-screen">
                <CheckoutSummary />
              </div>
            </div>
          )}
        </main>
      </div>
    </CustomerAuthGuard>
  );
}
