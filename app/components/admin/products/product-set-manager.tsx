import { useState, useEffect } from 'react';
import { useFieldArray, type Control } from 'react-hook-form';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { Search, Plus, Trash2, Package } from 'lucide-react';
import type { ProductFormData } from '~/lib/admin/validation';
import { getProducts, type Product } from '~/lib/services/admin/product-admin.service';
import { useDebounce } from '~/hooks/use-debounce';

interface ProductSetManagerProps {
  control: Control<ProductFormData>;
}

// Search products using the admin product service
async function searchProducts(query: string): Promise<Product[]> {
  try {
    const result = await getProducts({ search: query, limit: 10, status: 'active' });
    return result.data || [];
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
}

export function ProductSetManager({ control }: ProductSetManagerProps) {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "setItems",
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Search effect
  useEffect(() => {
    async function performSearch() {
      if (debouncedSearch.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        // Fetch products that are NOT already in the set
        // Note: For now we fetch all and filter client side for simplicity
        const products = await searchProducts(debouncedSearch);

        // Filter out products already in the set
        const currentIds = new Set(fields.map((f: any) => f.productId));
        const filtered = products.filter((p: Product) => !currentIds.has(p.id));

        setSearchResults(filtered);
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setIsSearching(false);
      }
    }

    performSearch();
  }, [debouncedSearch, fields]);

  // Derived name map for display (since form data only stores productId)
  // In a real implementation, we would need to fetch the product details for existing items
  // For now, we assume if we just added it, we know the name, 
  // but if we loaded from DB, we might need to pre-fetch these.
  const [productDetails, setProductDetails] = useState<Record<string, Product>>({});

  const handleAddProduct = (product: Product) => {
    append({
      productId: product.id,
      quantity: 1
    });
    setProductDetails(prev => ({ ...prev, [product.id]: product }));
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-end">
        <div className="flex-1 space-y-2">
          <Label>Search Products to Add</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {searchResults.length > 0 && (
        <div className="border rounded-md shadow-sm bg-popover max-h-60 overflow-y-auto">
          {searchResults.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 hover:bg-accent cursor-pointer transition-colors"
              onClick={() => handleAddProduct(product)}
            >
              <div className="flex items-center gap-3">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="h-8 w-8 rounded object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{product.name}</span>
                  <span className="text-xs text-muted-foreground">${(product.basePrice / 100).toFixed(2)}</span>
                </div>
              </div>
              <Button size="sm" variant="ghost">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Selected Items List */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="w-[100px]">Quantity</TableHead>
              <TableHead className="w-[10px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  No items in this set yet. Search and add products above.
                </TableCell>
              </TableRow>
            ) : (
              fields.map((field, index) => {
                const product = productDetails[field.productId];
                return (
                  <TableRow key={field.id}>
                    <TableCell>
                      {/* Hidden input to ensure productId is registered */}
                      <input
                        type="hidden"
                        {...control.register(`setItems.${index}.productId`)}
                        defaultValue={field.productId}
                      />
                      <div className="flex items-center gap-3">
                        {/* We might not have product details if it was loaded from DB initial mount yet. 
                            Ideally need a robust way to fetch this info. */}
                        <span className="font-medium">
                          {product ? product.name : `Product ID: ${field.productId}`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        {...control.register(`setItems.${index}.quantity`, {
                          valueAsNumber: true,
                          min: 1
                        })}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
