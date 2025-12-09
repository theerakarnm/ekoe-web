import { useFieldArray, type Control } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Checkbox } from '~/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import type { ProductFormData } from '~/lib/admin/validation';
import { PriceInput } from './price-input';

const VARIANT_TYPES = ['Size', 'Color', 'Volume', 'Weight', 'Material', 'Style', 'Other'] as const;

interface VariantManagerProps {
  control: Control<ProductFormData>;
}

export function VariantManager({ control }: VariantManagerProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  const addVariant = () => {
    append({
      variantType: 'Size',
      name: '',
      value: '',
      sku: '',
      price: 0,
      compareAtPrice: undefined,
      stockQuantity: 0,
      lowStockThreshold: 10,
      isActive: true,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Add product variants like sizes, colors, or volumes
        </p>
        <Button type="button" variant="outline" size="sm" onClick={addVariant}>
          <Plus className="h-4 w-4" />
          Add Variant
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg">
          No variants added yet. Click "Add Variant" to create one.
        </p>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border rounded-lg p-4 space-y-4 bg-muted/30"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm">Variant {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={control}
                name={`variants.${index}.variantType`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || 'Size'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {VARIANT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`variants.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., 100 ml, Red"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`variants.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., 100ml, Red, Large"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`variants.${index}.sku`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ''}
                        placeholder="e.g., PROD-100ML"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`variants.${index}.price`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <PriceInput
                        {...field}
                        onChange={field.onChange}
                        placeholder="29.99"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`variants.${index}.compareAtPrice`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compare At Price</FormLabel>
                    <FormControl>
                      <PriceInput
                        {...field}
                        value={field.value || undefined}
                        onChange={field.onChange}
                        placeholder="39.99"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`variants.${index}.stockQuantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10) || 0)
                        }
                        placeholder="100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`variants.${index}.lowStockThreshold`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Low Stock Threshold</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10) || 10)
                        }
                        placeholder="10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`variants.${index}.isActive`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-8">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
