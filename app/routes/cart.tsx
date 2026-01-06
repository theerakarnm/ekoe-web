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
import { promotionalCartService, type PromotionalCartResult } from "~/lib/services/promotional-cart.service";
import { getBestSellers, type Product } from "~/lib/services/product.service";
import { FreeGiftSelectionCard } from "~/components/checkout/free-gift-selection-card";
import { Gift, Loader2 } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import { Link } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Cart - Ekoe" },
    { name: "description", content: "Your Shopping Cart" },
  ];
}

// Transform API product to recommended product format
interface RecommendedProductType {
  id: string | number;
  name: string;
  image: string;
  price: number;
  variantId?: string;
  variantName?: string;
  originalPrice?: number;
}

function transformToRecommendedProduct(product: Product): RecommendedProductType {
  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
  const variant = product.variants?.[0];

  return {
    id: product.id,
    name: product.name,
    image: primaryImage?.url || '/placeholder-product.jpg',
    price: variant?.price || product.basePrice,
    variantId: variant?.id || undefined,
    variantName: variant?.name || undefined,
    originalPrice: variant?.compareAtPrice || product.compareAtPrice || undefined,
  };
}

export default function Cart() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const [validationResult, setValidationResult] = useState<ValidatedCart | null>(null);
  const [promotionalResult, setPromotionalResult] = useState<PromotionalCartResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showErrors, setShowErrors] = useState(true);

  const discountCode = useCartStore((state) => state.discountCode);

  // Gift selection state from cart store
  const giftSelections = useCartStore((state) => state.giftSelections);
  const pendingGiftSelections = useCartStore((state) => state.pendingGiftSelections);
  const selectGift = useCartStore((state) => state.selectGift);
  const deselectGift = useCartStore((state) => state.deselectGift);
  const setPendingGiftSelections = useCartStore((state) => state.setPendingGiftSelections);
  const clearGiftSelections = useCartStore((state) => state.clearGiftSelections);

  // State for recommended products from API
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProductType[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);

  // Get product IDs that are already in cart
  const cartProductIds = items.map(item => item.productId);

  // Fetch recommended products from API
  useEffect(() => {
    async function fetchRecommendedProducts() {
      try {
        setIsLoadingRecommendations(true);
        // Fetch more products to account for filtering out cart items
        const products = await getBestSellers(8);
        const transformed = products.map(transformToRecommendedProduct);
        setRecommendedProducts(transformed);
      } catch (error) {
        console.error('Failed to load recommended products:', error);
      } finally {
        setIsLoadingRecommendations(false);
      }
    }

    fetchRecommendedProducts();
  }, []);

  // Filter out products that are already in cart and limit to 4
  const filteredRecommendedProducts = recommendedProducts
    .filter(product => !cartProductIds.includes(String(product.id)))
    .slice(0, 4);

  // Validate cart and evaluate promotions when items change
  useEffect(() => {
    async function performValidationAndEvaluation() {
      if (items.length === 0) {
        setValidationResult(null);
        setPromotionalResult(null);
        return;
      }

      // Clear previous gift selections when cart changes
      // to prevent stale selections from showing incorrect counts
      clearGiftSelections();

      try {
        setIsValidating(true);
        setShowErrors(true);

        const cartItems = items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        }));

        // 1. Basic Validation (Stock check)
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

        // 2. Promotional Evaluation
        const promoItems = items.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity
        }));

        const evaluation = await promotionalCartService.evaluateCartWithPromotions(
          promoItems,
          undefined, // customerId
          discountCode,
          undefined  // shippingMethod
        );

        setPromotionalResult(evaluation);

        // Update pending gift selections in cart store
        if (evaluation.pendingGiftSelections && evaluation.pendingGiftSelections.length > 0) {
          setPendingGiftSelections(evaluation.pendingGiftSelections);
        } else {
          setPendingGiftSelections([]);
        }
      } catch (error) {
        console.error('Cart validation error:', error);
      } finally {
        setIsValidating(false);
      }
    }

    performValidationAndEvaluation();
  }, [items, discountCode]); // Re-run when items (including quantities) or discount changes

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

              {/* Free Gift Selection Section */}
              {pendingGiftSelections.length > 0 && (
                <div className="mt-8 space-y-4">
                  {pendingGiftSelections.map((pending, index) => (
                    <FreeGiftSelectionCard
                      key={`${pending.promotionId}-${index}`}
                      promotionId={pending.promotionId}
                      promotionName={pending.promotionName}
                      availableOptions={pending.availableOptions}
                      selectionsRemaining={pending.selectionsRemaining - (giftSelections[pending.promotionId]?.length || 0)}
                      selectedOptionIds={giftSelections[pending.promotionId] || []}
                      onSelect={(optionId) => selectGift(pending.promotionId, optionId)}
                      onDeselect={(optionId) => deselectGift(pending.promotionId, optionId)}
                      cardIndex={index}
                    />
                  ))}
                </div>
              )}

              {/* Continue Shopping */}
              <div className="mt-8">
                <Link to={'/shop'} className="bg-black text-white px-8 py-3 uppercase text-xs tracking-widest hover:bg-gray-800 transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Right Column - Summary & Recommendations */}
            <div className="lg:col-span-4 space-y-12">
              <CartSummary promotionalResult={promotionalResult} isLoading={isValidating} />

              <div>
                <h3 className="font-serif text-xl mb-6">You May Also Like</h3>
                <div className="space-y-2">
                  {isLoadingRecommendations ? (
                    // Loading skeleton
                    [...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4 py-4">
                        <Skeleton className="w-16 h-16 shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                        <Skeleton className="h-8 w-16" />
                      </div>
                    ))
                  ) : filteredRecommendedProducts.length > 0 ? (
                    filteredRecommendedProducts.map((product) => (
                      <RecommendedProduct key={product.id} product={product} />
                    ))
                  ) : null}
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
