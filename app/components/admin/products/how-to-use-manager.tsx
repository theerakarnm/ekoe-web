import { useState, useRef } from 'react';
import { useFieldArray, useWatch, useFormContext, type Control } from 'react-hook-form';
import { Plus, Trash2, Lightbulb, Upload, Video, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Alert, AlertDescription } from '~/components/ui/alert';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '~/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import type { ProductFormData } from '~/lib/admin/validation';
import { uploadGenericImage } from '~/lib/services/admin/product-admin.service';
import { showSuccess, showError } from '~/lib/admin/toast';

interface HowToUseManagerProps {
  control: Control<ProductFormData>;
}

export function HowToUseManager({ control }: HowToUseManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get setValue from form context
  const { setValue } = useFormContext<ProductFormData>();

  const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
    control,
    name: 'howToUse.steps',
  });

  const { fields: proTipFields, append: appendProTip, remove: removeProTip } = useFieldArray({
    control,
    name: 'howToUse.proTips' as any,
  });

  // Watch media fields
  const mediaUrl = useWatch({ control, name: 'howToUse.mediaUrl' });
  const mediaType = useWatch({ control, name: 'howToUse.mediaType' });

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

  const handleMediaUpload = async (file: File, type: 'image' | 'video') => {
    // Validate file size (<50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      showError('File size must be less than 50MB');
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadGenericImage(file);
      // Use setValue to properly update form fields
      setValue('howToUse.mediaUrl', url, { shouldDirty: true, shouldValidate: true });
      setValue('howToUse.mediaType', type, { shouldDirty: true, shouldValidate: true });
      showSuccess(`${type === 'video' ? 'Video' : 'Image'} uploaded successfully`);
    } catch (error: any) {
      showError(error.message || 'Failed to upload media');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Media Upload Section */}
      <div className="space-y-4 border-b pb-6">
        <div>
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Video className="h-4 w-4 text-blue-500" />
            How to Use Media
          </h3>
          <p className="text-sm text-muted-foreground">
            Upload an image or video to display in the "How to Use" section
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Recommended:</strong> Upload videos or images in <strong>9:16 aspect ratio</strong> for best display.
            Maximum file size: 50MB.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="howToUse.mediaUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Media URL</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ''}
                    placeholder="https://example.com/video.mp4"
                  />
                </FormControl>
                <FormDescription>
                  Enter URL directly or upload a file below
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="howToUse.mediaType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Media Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="image">
                      <span className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Image
                      </span>
                    </SelectItem>
                    <SelectItem value="video">
                      <span className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Video
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Upload buttons */}
        <div className="flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const type = file.type.startsWith('video/') ? 'video' : 'image';
                handleMediaUpload(file, type);
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Media'}
          </Button>
        </div>

        {/* Media Preview */}
        {mediaUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Preview:</p>
            <div className="relative aspect-9/16 max-w-md bg-gray-100 rounded-lg overflow-hidden">
              {mediaType === 'video' ? (
                <video
                  src={mediaUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={mediaUrl}
                  alt="How to use preview"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Legacy Steps Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">Usage Steps (Legacy)</h3>
            <p className="text-sm text-muted-foreground">
              Add step-by-step instructions (used as fallback if no media)
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
