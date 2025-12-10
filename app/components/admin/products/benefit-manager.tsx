import { useFieldArray, type Control } from 'react-hook-form';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import type { ProductFormData } from '~/lib/admin/validation';

interface BenefitManagerProps {
  control: Control<ProductFormData>;
}

export function BenefitManager({ control }: BenefitManagerProps) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "benefits" as any,
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">Product Benefits</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append("New Benefit")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Benefit
        </Button>
      </div>

      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2 bg-card p-2 rounded-md border">
            <div className="flex flex-col gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                disabled={index === 0}
                onClick={() => move(index, index - 1)}
              >
                <ArrowUp className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                disabled={index === fields.length - 1}
                onClick={() => move(index, index + 1)}
              >
                <ArrowDown className="h-3 w-3" />
              </Button>
            </div>
            <Input
              {...control.register(`benefits.${index}` as any)}
              placeholder="e.g. Hydrates skin provided"
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              className="text-destructive hover:text-destructive/90"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 border rounded-md border-dashed text-muted-foreground">
          No benefits added yet. Add key benefits to highlight product features.
        </div>
      )}
    </div>
  );
}

