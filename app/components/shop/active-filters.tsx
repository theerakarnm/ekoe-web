import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { X } from 'lucide-react';
import type { ProductFilterParams, Category } from '~/lib/services/product.service';

interface ActiveFiltersProps {
  filters: ProductFilterParams;
  categories: Category[];
  onRemoveFilter: (filter: Partial<ProductFilterParams>) => void;
  onClearAll: () => void;
}

export function ActiveFilters({ 
  filters, 
  categories,
  onRemoveFilter, 
  onClearAll 
}: ActiveFiltersProps) {
  // Check if any filters are active
  const hasSearch = !!filters.search;
  const hasCategories = filters.categories && filters.categories.length > 0;
  const hasPriceRange = filters.minPrice !== undefined || filters.maxPrice !== undefined;
  const hasFilters = hasSearch || hasCategories || hasPriceRange;

  // Return null if no filters are active
  if (!hasFilters) {
    return null;
  }

  // Helper to get category name by ID
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || categoryId;
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-gray-600 font-serif">Active filters:</span>
      
      {/* Search filter badge */}
      {hasSearch && (
        <Badge variant="secondary" className="gap-1">
          Search: {filters.search}
          <button
            onClick={() => onRemoveFilter({ search: undefined })}
            className="ml-1 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
            aria-label="Remove search filter"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
      
      {/* Category filter badges */}
      {hasCategories && filters.categories!.map(categoryId => (
        <Badge key={categoryId} variant="secondary" className="gap-1">
          {getCategoryName(categoryId)}
          <button
            onClick={() => onRemoveFilter({ 
              categories: filters.categories?.filter(id => id !== categoryId) 
            })}
            className="ml-1 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
            aria-label={`Remove ${getCategoryName(categoryId)} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      
      {/* Price range filter badge */}
      {hasPriceRange && (
        <Badge variant="secondary" className="gap-1">
          Price: ฿{filters.minPrice || 0} - ฿{filters.maxPrice || '∞'}
          <button
            onClick={() => onRemoveFilter({ 
              minPrice: undefined, 
              maxPrice: undefined 
            })}
            className="ml-1 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
            aria-label="Remove price range filter"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
      
      {/* Clear all button */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onClearAll}
        className="text-sm font-serif"
      >
        Clear all
      </Button>
    </div>
  );
}
