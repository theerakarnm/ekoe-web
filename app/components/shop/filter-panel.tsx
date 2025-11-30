import { useState, useEffect } from 'react';
import { Checkbox } from '~/components/ui/checkbox';
import { Label } from '~/components/ui/label';
import { Slider } from '~/components/ui/slider';
import type { Category, PriceRange, ProductFilterParams } from '~/lib/services/product.service';

interface FilterPanelProps {
  categories: Category[];
  priceRange: PriceRange;
  appliedFilters: ProductFilterParams;
  onFilterChange: (filters: Partial<ProductFilterParams>) => void;
  disabled?: boolean;
}

export function FilterPanel({ 
  categories, 
  priceRange, 
  appliedFilters, 
  onFilterChange,
  disabled = false
}: FilterPanelProps) {
  // Local state for selected categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    appliedFilters.categories || []
  );

  // Local state for price range
  const [priceMin, setPriceMin] = useState(
    appliedFilters.minPrice !== undefined ? appliedFilters.minPrice : priceRange.min
  );
  const [priceMax, setPriceMax] = useState(
    appliedFilters.maxPrice !== undefined ? appliedFilters.maxPrice : priceRange.max
  );

  // Update local state when appliedFilters change (e.g., from URL navigation)
  useEffect(() => {
    setSelectedCategories(appliedFilters.categories || []);
  }, [appliedFilters.categories]);

  useEffect(() => {
    setPriceMin(
      appliedFilters.minPrice !== undefined ? appliedFilters.minPrice : priceRange.min
    );
    setPriceMax(
      appliedFilters.maxPrice !== undefined ? appliedFilters.maxPrice : priceRange.max
    );
  }, [appliedFilters.minPrice, appliedFilters.maxPrice, priceRange.min, priceRange.max]);

  /**
   * Handle category checkbox toggle
   * Updates local state and calls onFilterChange
   */
  const handleCategoryToggle = (categoryId: string) => {
    const updated = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(updated);
    
    // Pass undefined if no categories selected to remove filter
    onFilterChange({ 
      categories: updated.length > 0 ? updated : undefined 
    });
  };

  /**
   * Handle price range change (when user releases slider)
   * Only calls onFilterChange on commit to avoid excessive updates
   */
  const handlePriceCommit = (values: number[]) => {
    const [min, max] = values;
    
    onFilterChange({
      minPrice: min !== priceRange.min ? min : undefined,
      maxPrice: max !== priceRange.max ? max : undefined
    });
  };

  /**
   * Handle price range value change (while dragging)
   * Updates local state only
   */
  const handlePriceChange = (values: number[]) => {
    const [min, max] = values;
    setPriceMin(min);
    setPriceMax(max);
  };

  return (
    <div className="filter-panel space-y-8 p-6 bg-white border border-gray-200 rounded-lg">
      {/* Categories Section */}
      <div>
        <h3 className="font-serif font-semibold text-lg mb-4 text-gray-900">Categories</h3>
        <div className="space-y-3">
          {categories.map(category => (
            <div key={category.id} className="flex items-center space-x-3">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => handleCategoryToggle(category.id)}
                disabled={disabled}
              />
              <Label 
                htmlFor={`category-${category.id}`}
                className={`text-sm text-gray-700 cursor-pointer font-serif ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range Section */}
      <div>
        <h3 className="font-serif font-semibold text-lg mb-4 text-gray-900">Price Range</h3>
        <div className="space-y-4">
          <Slider
            min={priceRange.min}
            max={priceRange.max}
            step={100}
            value={[priceMin, priceMax]}
            onValueChange={handlePriceChange}
            onValueCommit={handlePriceCommit}
            className="w-full"
            disabled={disabled}
          />
          <div className={`flex justify-between text-sm font-serif text-gray-600 ${disabled ? 'opacity-50' : ''}`}>
            <span>฿{(priceMin / 100).toFixed(2)}</span>
            <span>฿{(priceMax / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
