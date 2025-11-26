import { type Control } from 'react-hook-form';
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

interface ComplimentaryGiftFormProps {
  control: Control<ProductFormData>;
}

export function ComplimentaryGiftForm({ control }: ComplimentaryGiftFormProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="complimentaryGift.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gift Name</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} placeholder="e.g., Free Sample" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="complimentaryGift.description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                value={field.value || ''}
                placeholder="Brief description of the gift"
                rows={2}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="complimentaryGift.image"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image URL</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} placeholder="https://..." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="complimentaryGift.value"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Value (Optional)</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} placeholder="e.g., $10" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
