import type { Route } from "./+types/cart";
import { useState, useEffect } from "react";
import { Header } from "~/components/share/header";
import { Footer } from "~/components/share/footer";
import { useCartStore } from "~/store/cart";
import { CartItemRow } from "~/components/cart/cart-item-row";
import { CartItemCard } from "~/components/cart/cart-item-card";
import { CartSummary } from "~/components/cart/cart-summary";
import { RecommendedProduct } from "~/components/cart/recommended-product";
import { CartValidationErrors } from "~/components/cart/cart-validation-errors";
import { validateCart, type ValidatedCart } from "~/lib/services/cart.service";
import { Gift, Loader2 } from "lucide-react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Cart - Ekoe" },
    { name: "description", content: "Your Shopping Cart" },
  ];
}

const recommendedProducts = [
  {
    id: 101,
    name: "The Serum",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200",
    price: 114700,
    originalPrice: 140000,
  },
  {
    id: 102,
    name: "The Oil Bar",
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=200",
    price: 21200,
  },
];

export default function Cart() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const [validationResult, setValidationResult] = useState<ValidatedCart | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showErrors, setShowErrors] = useState(true);

  // Validate cart when items change
  useEffect(() => {
    async function performValidation() {
      if (items.length === 0) {
        setValidationResult(null);
        return;
      }

      try {
        setIsValidating(true);
        setShowErrors(true);

        const cartItems = items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        }));

        const result = await validateCart(cartItems);
        setValidationResult(result);

        // Auto-handle validation errors
        if (!result.isValid) {
          result.errors.forEach((error) => {
            if (error.type === 'out_of_stock' || error.type === 'product_not_found' || error.type === 'product_inactive') {
              // Remove items that are out of stock or not found
              removeItem(error.productId, error.variantId);
            } else if (error.type === 'insufficient_stock') {
              // Find the validated item to get available quantity
              const validatedItem = result.items.find(
                (item) => item.productId === error.productId && item.variantId === error.variantId
              );
              if (validatedItem && validatedItem.availableQuantity > 0) {
                // Update to available quantity
                updateQuantity(error.productId, validatedItem.availableQuantity, error.variantId);
              }
            }
          });
        }
      } catch (error) {
        console.error('Cart validation error:', error);
      } finally {
        setIsValidating(false);
      }
    }

    performValidation();
  }, [items.length]); // Only validate when number of items changes

  return (
    <div className="min-h-screen bg-white font-sans text-[#1a1a1a]">
      <Header />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          {/* Validation Errors */}
          {validationResult && !validationResult.isValid && showErrors && (
            <div className="mb-8">
              <CartValidationErrors
                errors={validationResult.errors}
                onDismiss={() => setShowErrors(false)}
              />
            </div>
          )}

          {/* Loading State */}
          {isValidating && (
            <div className="mb-8 flex items-center justify-center gap-2 text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Validating cart items...</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-8">
              {/* Table Header */}
              <div className="hidden md:flex text-xs font-medium tracking-widest uppercase text-gray-500 pb-4 border-b border-gray-200">
                <div className="flex-1">Product</div>
                <div className="w-32 text-center">Price</div>
                <div className="w-40 text-center">Quantity</div>
                <div className="w-32 text-center">Subtotal</div>
                <div className="w-12"></div>
              </div>

              {/* Cart Items */}
              <div>
                {items.length === 0 ? (
                  <div className="py-12 text-center text-gray-500">
                    Your cart is empty.
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={`${item.productId}-${item.variantId || 'default'}`}>
                      <div className="hidden md:block">
                        <CartItemRow item={item} />
                      </div>
                      <div className="block md:hidden">
                        <CartItemCard item={item} />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Free Gift Section */}
              {items.length > 0 && (
                <div className="mt-8 border border-gray-200 p-6 bg-[#F9F9F9]">
                  <div className="flex items-center gap-2 mb-4">
                    <Gift size={18} />
                    <h3 className="font-serif text-lg">Free Gift With Purchase</h3>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-3 bg-white p-3 border border-gray-100 flex-1">
                      <img
                        src="https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=100"
                        alt="Gift 1"
                        className="w-12 h-12 object-cover"
                      />
                      <div>
                        <div className="font-serif text-sm">The Oil Bar</div>
                        <div className="text-xs text-gray-500">50 ml.</div>
                      </div>
                      <div className="ml-auto text-sm font-medium">x1</div>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-3 border border-gray-100 flex-1">
                      <img
                        src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=100"
                        alt="Gift 2"
                        className="w-12 h-12 object-cover"
                      />
                      <div>
                        <div className="font-serif text-sm">The Serum</div>
                        <div className="text-xs text-gray-500">20 ml.</div>
                      </div>
                      <div className="ml-auto text-sm font-medium">x1</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Continue Shopping */}
              <div className="mt-8">
                <button className="bg-black text-white px-8 py-3 uppercase text-xs tracking-widest hover:bg-gray-800 transition-colors">
                  Continue Shopping
                </button>
              </div>
            </div>

            {/* Right Column - Summary & Recommendations */}
            <div className="lg:col-span-4 space-y-12">
              <CartSummary />

              <div>
                <h3 className="font-serif text-xl mb-6">You May Also Like</h3>
                <div className="space-y-2">
                  {recommendedProducts.map((product) => (
                    <RecommendedProduct key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
