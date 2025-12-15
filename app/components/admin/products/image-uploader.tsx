import { useState, useRef, type DragEvent } from 'react';
import { X, Upload, Star, GripVertical, Image as ImageIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { cn } from '~/lib/utils';
import type { ProductImage } from '~/lib/services/admin/product-admin.service';

interface ImageUploaderProps {
  images: ProductImage[];
  onUpload: (files: File[]) => Promise<void>;
  onReorder: (images: ProductImage[]) => void;
  onDelete: (imageId: string) => void;
  onSetPrimary: (imageId: string) => void;
  onSetSecondary: (imageId: string) => void;
  onUpdateAltText: (imageId: string, altText: string) => void;
  onUpdateDescription: (imageId: string, description: string) => void;
}

export function ImageUploader({
  images,
  onUpload,
  onReorder,
  onDelete,
  onSetPrimary,
  onSetSecondary,
  onUpdateAltText,
  onUpdateDescription,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      setIsUploading(true);
      try {
        await onUpload(files);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      setIsUploading(true);
      try {
        await onUpload(files);
      } finally {
        setIsUploading(false);
      }
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleImageDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    // Update sort order
    const reorderedImages = newImages.map((img, idx) => ({
      ...img,
      sortOrder: idx,
    }));

    onReorder(reorderedImages);
    setDraggedIndex(index);
  };

  const handleImageDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50',
          isUploading && 'opacity-50 pointer-events-none'
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-2">
          Drag and drop images here, or click to select files
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Select Images'}
        </Button>
      </div>

      {/* Image List */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((image, index) => (
              <div
                key={image.id}
                draggable
                onDragStart={() => handleImageDragStart(index)}
                onDragOver={(e) => handleImageDragOver(e, index)}
                onDragEnd={handleImageDragEnd}
                className={cn(
                  'border rounded-lg p-4 space-y-3 cursor-move transition-shadow',
                  draggedIndex === index && 'opacity-50',
                  'hover:shadow-md'
                )}
              >
                <div className="flex items-start gap-3">
                  <GripVertical className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
                  <div className="relative shrink-0">
                    <img
                      src={image.url}
                      alt={image.altText || 'Product image'}
                      className="w-24 h-24 object-cover rounded"
                    />
                    {image.isPrimary && (
                      <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1" title="Primary Image">
                        <Star className="h-4 w-4 text-white fill-white" />
                      </div>
                    )}
                    {image.isSecondary && (
                      <div className="absolute -top-2 -left-2 bg-blue-500 rounded-full p-1" title="Secondary Image (Hover)">
                        <ImageIcon className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div>
                      <Label htmlFor={`alt-${image.id}`} className="text-xs">
                        Alt Text <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`alt-${image.id}`}
                        value={image.altText || ''}
                        onChange={(e) =>
                          onUpdateAltText(image.id, e.target.value)
                        }
                        placeholder="Describe the image for accessibility"
                        className="text-sm"
                        aria-required="true"
                        aria-label="Image alt text for accessibility"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`desc-${image.id}`} className="text-xs">
                        Description
                      </Label>
                      <Input
                        id={`desc-${image.id}`}
                        value={image.description || ''}
                        onChange={(e) =>
                          onUpdateDescription(image.id, e.target.value)
                        }
                        placeholder="Internal description or notes"
                        className="text-sm"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {!image.isPrimary && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onSetPrimary(image.id)}
                        >
                          <Star className="h-3 w-3" />
                          Set Primary
                        </Button>
                      )}
                      {!image.isSecondary && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onSetSecondary(image.id)}
                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          <ImageIcon className="h-3 w-3" />
                          Set Secondary
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(image.id)}
                      >
                        <X className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {images.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No images uploaded yet
        </p>
      )}
    </div>
  );
}
