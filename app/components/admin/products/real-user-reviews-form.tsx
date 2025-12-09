import { type Control } from 'react-hook-form';
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

interface RealUserReviewsFormProps {
  control: Control<ProductFormData>;
}

export function RealUserReviewsForm({ control }: RealUserReviewsFormProps) {
  return (
    <div className="space-y-6">
      <div className="bg-muted/30 p-4 rounded-lg mb-4">
        <p className="text-sm text-muted-foreground">
          This section displays the "Loved by Real Users" (เสียงจากผู้ใช้จริง) content on the product detail page.
          Upload an image and add content text to showcase real user testimonials.
        </p>
      </div>

      <FormField
        control={control}
        name="realUserReviews.image"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Review Image</FormLabel>
            <FormControl>
              <SingleImageUploader
                value={field.value || ''}
                onChange={(url) => field.onChange(url)}
                placeholder="Upload an image for the real user reviews section"
              />
            </FormControl>
            <FormDescription>
              This image will appear alongside the user review content
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="realUserReviews.content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Review Content</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                value={field.value || ''}
                placeholder="กว่า 98% รู้สึกถึงการซึมซาบอย่างรวดเร็ว&#10;93% สังเกตว่าผิวดูกระจ่างใสขึ้น&#10;และ 96% รู้สึกว่าผิวชุ่มชื้นทันที"
                rows={6}
              />
            </FormControl>
            <FormDescription>
              Enter the testimonial content. This can include statistics, quotes, or descriptions of user experiences.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
