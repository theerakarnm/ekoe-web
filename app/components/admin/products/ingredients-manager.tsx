import { useFieldArray, type Control } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '~/components/ui/form';
import { SingleImageUploader } from './single-image-uploader';
import type { ProductFormData } from '~/lib/admin/validation';

interface IngredientsManagerProps {
  control: Control<ProductFormData>;
}

export function IngredientsManager({ control }: IngredientsManagerProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients.keyIngredients',
  });

  const addIngredient = () => {
    append({
      name: '',
      description: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Ingredients Section Image */}
      <FormField
        control={control}
        name="ingredients.image"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ingredients Section Image</FormLabel>
            <FormControl>
              <SingleImageUploader
                value={field.value || ''}
                onChange={(url) => field.onChange(url)}
                placeholder="Upload an image for the ingredients section"
              />
            </FormControl>
            <FormDescription>
              This image will be displayed alongside the key ingredients
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Key Ingredients */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">Ingredients</h3>
            <p className="text-sm text-muted-foreground">
              Highlight the most important ingredients
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
            <Plus className="h-4 w-4 mr-2" />
            Add Ingredient
          </Button>
        </div>

        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
            No key ingredients added yet.
          </p>
        )}

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border rounded-lg p-4 space-y-4 bg-muted/30"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Ingredient {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={control}
                  name={`ingredients.keyIngredients.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Vitamin C" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`ingredients.keyIngredients.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Brief description of benefits"
                          rows={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Ingredient List */}
      <FormField
        control={control}
        name="ingredients.fullList"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Ingredient List</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                value={field.value || ''}
                placeholder="Paste the full list of ingredients here..."
                rows={4}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

