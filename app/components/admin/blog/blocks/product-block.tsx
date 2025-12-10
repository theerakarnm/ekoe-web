import { useState, useEffect } from 'react';
import { Package, Search, X } from 'lucide-react';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { getProducts, type Product } from '~/lib/services/admin/product-admin.service';

interface ProductBlockProps {
  productId: string;
  productName: string;
  productSlug: string;
  productPrice: number;
  productImage: string;
  onChange: (updates: {
    productId?: string;
    productName?: string;
    productSlug?: string;
    productPrice?: number;
    productImage?: string;
  }) => void;
}

export function ProductBlock({
  productId,
  productName,
  productSlug,
  productPrice,
  productImage,
  onChange,
}: ProductBlockProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(!productId);

  // Search products when query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const result = await getProducts({ search: searchQuery, limit: 5 });
        setSearchResults(result.data || []);
      } catch (error) {
        console.error('Failed to search products:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectProduct = (product: Product) => {
    const primaryImage = product.images?.find(img => img.isPrimary)?.url || product.images?.[0]?.url || '';

    onChange({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      productPrice: product.basePrice,
      productImage: primaryImage,
    });

    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleRemoveProduct = () => {
    onChange({
      productId: '',
      productName: '',
      productSlug: '',
      productPrice: 0,
      productImage: '',
    });
    setShowSearch(true);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
        <Package className="size-3" />
        <span className="font-medium">Product Block</span>
      </div>

      {/* Selected Product Display */}
      {productId && !showSearch ? (
        <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
          {productImage && (
            <img
              src={productImage}
              alt={productName}
              className="size-14 rounded object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{productName}</div>
            <div className="text-sm text-muted-foreground">
              ฿{(productPrice / 100).toLocaleString()}
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleRemoveProduct}
            title="Remove product"
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        /* Product Search */
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-8"
            />
          </div>

          {/* Search Results */}
          {(searchResults.length > 0 || isSearching) && (
            <div className="rounded-md border divide-y max-h-[200px] overflow-y-auto">
              {isSearching ? (
                <div className="p-3 text-center text-sm text-muted-foreground">
                  Searching...
                </div>
              ) : (
                searchResults.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleSelectProduct(product)}
                    className="flex w-full items-center gap-3 p-2 text-left hover:bg-accent transition-colors"
                  >
                    {product.images?.[0]?.url && (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="size-10 rounded object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate text-sm">{product.name}</div>
                      <div className="text-xs text-muted-foreground">
                        ฿{(product.basePrice / 100).toLocaleString()}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {searchQuery && !isSearching && searchResults.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">
              No products found
            </p>
          )}
        </div>
      )}
    </div>
  );
}
