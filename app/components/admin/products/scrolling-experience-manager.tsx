import { useState, useRef, type DragEvent } from 'react';
import { useFieldArray, useWatch, type Control } from 'react-hook-form';
import { Plus, Trash2, GripVertical, Image as ImageIcon, Upload, X } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Card } from '~/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import type { ProductFormData } from '~/lib/admin/validation';
import { uploadGenericImage } from '~/lib/services/admin/product-admin.service';
import { showSuccess, showError } from '~/lib/admin/toast';
import { cn } from '~/lib/utils';

interface ScrollingExperienceManagerProps {
  control: Control<ProductFormData>;
}

export function ScrollingExperienceManager({ control }: ScrollingExperienceManagerProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'scrollingExperience',
  });

  const scrollingExperience = useWatch({ control, name: 'scrollingExperience' });

  const addBlock = () => {
    append({
      id: crypto.randomUUID(),
      title: '',
      imageUrl: '',
    });
  };

  const handleImageUpload = async (index: number, file: File) => {
    setUploadingIndex(index);
    try {
      const url = await uploadGenericImage(file);
      // Update the field value - we need to use the form's setValue
      // Since we're using useFieldArray, we can update the value directly
      const currentValues = scrollingExperience || [];
      if (currentValues[index]) {
        currentValues[index].imageUrl = url;
      }
      showSuccess('Image uploaded successfully');
    } catch (error: any) {
      console.error('Failed to upload image:', error);
      showError(error.message || 'Failed to upload image');
    } finally {
      setUploadingIndex(null);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      move(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Create scroll blocks that will display as a sticky image scroll experience on the product page.
        Each block needs a title and an image.
      </p>

      {/* Empty State */}
      {fields.length === 0 && (
        <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/30">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No scroll blocks yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add scroll blocks to create an engaging scrolling experience for your customers.
          </p>
          <Button type="button" onClick={addBlock}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Block
          </Button>
        </div>
      )}

      {/* Block List */}
      <div className="space-y-4">
        {fields.map((field, index) => (
          <Card
            key={field.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={cn(
              'p-4 transition-all duration-200',
              draggedIndex === index && 'opacity-50 scale-[0.98]',
              dragOverIndex === index && draggedIndex !== index && 'border-primary border-2 bg-primary/5'
            )}
          >
            <div className="flex gap-4">
              {/* Drag Handle */}
              <div
                className="flex items-center cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
                title="Drag to reorder"
              >
                <GripVertical className="h-5 w-5" />
              </div>

              {/* Image Upload */}
              <div className="w-32 shrink-0">
                <FormField
                  control={control}
                  name={`scrollingExperience.${index}.imageUrl`}
                  render={({ field: imageField }) => (
                    <FormItem>
                      {imageField.value ? (
                        <div className="relative group">
                          <img
                            src={imageField.value}
                            alt={`Block ${index + 1}`}
                            className="w-32 h-24 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => imageField.onChange('')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          className={cn(
                            'w-32 h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors',
                            uploadingIndex === index
                              ? 'bg-muted/50'
                              : 'hover:border-primary hover:bg-primary/5'
                          )}
                          onClick={() => fileInputRefs.current[index]?.click()}
                        >
                          {uploadingIndex === index ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                          ) : (
                            <>
                              <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                              <span className="text-xs text-muted-foreground">Upload</span>
                            </>
                          )}
                        </div>
                      )}
                      <input
                        ref={(el) => { fileInputRefs.current[index] = el; }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(index, file).then(() => {
                              // Force re-fetch the value after upload
                              const currentValues = scrollingExperience || [];
                              if (currentValues[index]?.imageUrl) {
                                imageField.onChange(currentValues[index].imageUrl);
                              }
                            });
                          }
                          e.target.value = '';
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Title Input */}
              <div className="flex-1">
                <FormField
                  control={control}
                  name={`scrollingExperience.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={`Enter title for block ${index + 1}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Delete Button */}
              <div className="flex items-start">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => remove(index)}
                  title="Delete block"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Button */}
      {fields.length > 0 && (
        <Button type="button" variant="outline" onClick={addBlock} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add New Block
        </Button>
      )}
    </div>
  );
}
