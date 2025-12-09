import { useFieldArray, type Control } from 'react-hook-form';
import { Plus, Trash2, Lightbulb } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import type { ProductFormData } from '~/lib/admin/validation';

interface HowToUseManagerProps {
  control: Control<ProductFormData>;
}

export function HowToUseManager({ control }: HowToUseManagerProps) {
  const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
    control,
    name: 'howToUse.steps',
  });

  const { fields: proTipFields, append: appendProTip, remove: removeProTip } = useFieldArray({
    control,
    name: 'howToUse.proTips' as any,
  });

  const addStep = () => {
    appendStep({
      title: '',
      description: '',
      icon: '',
    });
  };

  const addProTip = () => {
    appendProTip('' as any);
  };

  return (
    <div className="space-y-6">
      {/* Steps */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">Usage Steps</h3>
            <p className="text-sm text-muted-foreground">
              Add step-by-step instructions
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addStep}>
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
        </div>

        {stepFields.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
            No steps added yet.
          </p>
        )}

        <div className="space-y-4">
          {stepFields.map((field, index) => (
            <div
              key={field.id}
              className="border rounded-lg p-4 space-y-4 bg-muted/30"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Step {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStep(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={control}
                  name={`howToUse.steps.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Apply" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`howToUse.steps.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Instruction details"
                          rows={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`howToUse.steps.${index}.icon`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} placeholder="Icon name or URL" />
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

      {/* Pro Tips */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              Pro Tips
            </h3>
            <p className="text-sm text-muted-foreground">
              Add helpful tips for customers
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addProTip}>
            <Plus className="h-4 w-4 mr-2" />
            Add Pro Tip
          </Button>
        </div>

        {proTipFields.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
            No pro tips added yet.
          </p>
        )}

        <div className="space-y-3">
          {proTipFields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900"
            >
              <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-2" />
              <div className="flex-1">
                <FormField
                  control={control}
                  name={`howToUse.proTips.${index}` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter a helpful tip for customers..."
                          rows={2}
                          className="bg-white dark:bg-gray-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeProTip(index)}
                className="shrink-0"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Note */}
      <FormField
        control={control}
        name="howToUse.note"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Note</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                value={field.value || ''}
                placeholder="Any extra tips or warnings..."
                rows={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
