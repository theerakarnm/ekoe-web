import { useState, useEffect } from "react";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { useCartStore } from "~/store/cart";
import { showSuccess, showError } from "~/lib/toast";
import { formatCurrencyFromCents } from "~/lib/formatter";
import type { Product } from "~/lib/services/product.service";
import { getFrequentlyBoughtTogether } from "~/lib/services/product.service";
import { Plus } from "lucide-react";

interface FrequentlyBoughtTogetherProps {
  productId: string;
}

/**
 * FrequentlyBoughtTogether Component
 * 
 * Displays products frequently bought together with the current product.
 * Shows bundle pricing with savings and allows adding all selected products to cart.
 * Hides section if no bundle data is available.
 * 
 * @param productId - The ID of the current product
 */
export function FrequentlyBoughtTogether({ productId }: FrequentlyBoughtTogetherProps) {
  const [bundleData, setBundleData] = useState<{
    products: Product[];
    totalPrice: number;
    savings: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function fetchBundle() {
      try {
        setLoading(true);
        setError(null);
        const data = await getFrequentlyBoughtTogether(productId);
        
        // Only set bundle data if products exist
        if (data.products.length > 0) {
          setBundleData(data);
          // Select all products by default
          setSelectedProducts(new Set(data.products.map(p => p.id)));
        } else {
          setBundleData(null);
        }
      } catch (err) {
        console.error('Failed to load frequently bought together:', err);
        setError(err instanceof Error ? err.message : 'Failed to load bundle');
        setBundleData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchBundle();
  }, [productId]);

  // Toggle product selection
  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  // Calculate current total based on selected products
  const calculateCurrentTotal = () => {
    if (!bundleData) return { total: 0, savings: 0, originalTotal: 0 };

    const selectedProductsList = bundleData.products.filter(p => selectedProducts.has(p.id));
    const originalTotal = selectedProductsList.reduce((sum, p) => sum + p.basePrice, 0);
    const savings = Math.round(originalTotal * 0.1); // 10% discount
    const total = originalTotal - savings;

    return { total, savings, originalTotal };
  };

  // Add selected products to cart
  const handleAddBundleToCart = () => {
    if (!bundleData) return;

    try {
      const selectedProductsList = bundleData.products.filter(p => selectedProducts.has(p.id));
      
      if (selectedProductsList.length === 0) {
        showError('Please select at least one product');
        return;
      }

      // Add each selected product to cart
      selectedProductsList.forEach(product => {
        const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
        
        addItem({
          productId: parseInt(product.id),
          productName: product.name,
          image: primaryImage?.url || '/placeholder-product.jpg',
          price: product.basePrice,
        });
      });

      const { savings } = calculateCurrentTotal();
      
      showSuccess(
        'Bundle added to cart!',
        `${selectedProductsList.length} ${selectedProductsList.length === 1 ? 'item' : 'items'} added with ${formatCurrencyFromCents(savings)} savings`
      );
    } catch (err) {
      console.error('Failed to add bundle to cart:', err);
      showError('Failed to add bundle to cart', 'Please try again');
    }
  };

  // Show loading skeletons
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Frequently Bought Together</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-20 w-20" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Hide section if no bundle data available
  if (!bundleData || bundleData.products.length === 0 || error) {
    return null;
  }

  const { total, savings, originalTotal } = calculateCurrentTotal();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Frequently Bought Together</CardTitle>
        <p className="text-sm text-muted-foreground">
          Customers who bought this item also bought
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Product List */}
        <div className="space-y-3">
          {bundleData.products.map((product) => {
            const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
            const isSelected = selectedProducts.has(product.id);

            return (
              <div
                key={product.id}
                className="flex items-center gap-4 p-3 rounded-lg border transition-colors hover:bg-accent/50"
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleProduct(product.id)}
                  aria-label={`Select ${product.name}`}
                />
                <img
                  src={primaryImage?.url || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="h-20 w-20 object-cover rounded-md"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
                  {product.subtitle && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {product.subtitle}
                    </p>
                  )}
                  <p className="text-sm font-semibold mt-1">
                    {formatCurrencyFromCents(product.basePrice)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Summary */}
        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Original Total:</span>
            <span className="line-through text-muted-foreground">
              {formatCurrencyFromCents(originalTotal)}
            </span>
          </div>
          <div className="flex justify-between text-sm font-medium text-green-600">
            <span>Bundle Savings (10%):</span>
            <span>-{formatCurrencyFromCents(savings)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Bundle Total:</span>
            <span>{formatCurrencyFromCents(total)}</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddBundleToCart}
          disabled={selectedProducts.size === 0}
          className="w-full"
          size="lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add {selectedProducts.size} {selectedProducts.size === 1 ? 'Item' : 'Items'} to Cart
        </Button>
      </CardContent>
    </Card>
  );
}
