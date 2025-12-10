import { useState, useRef, type DragEvent } from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { cn } from '~/lib/utils';
import { uploadGenericImage } from '~/lib/services/admin/product-admin.service';
import { showError } from '~/lib/admin/toast';

interface ImageBlockProps {
  url: string;
  alt: string;
  caption: string;
  onChange: (updates: { url?: string; alt?: string; caption?: string }) => void;
}

export function ImageBlock({ url, alt, caption, onChange }: ImageBlockProps) {
  const [previewError, setPreviewError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlChange = (newUrl: string) => {
    setPreviewError(false);
    onChange({ url: newUrl });
  };

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
      await uploadFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      await uploadFile(files[0]);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      const url = await uploadGenericImage(file);
      setPreviewError(false);
      onChange({ url });
    } catch (error: any) {
      console.error('Failed to upload image:', error);
      showError(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
        <ImageIcon className="size-3" />
        <span className="font-medium">Image Block</span>
      </div>

      {/* Image Preview or Upload Area */}
      {url && !previewError ? (
        <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-md border bg-muted group">
          <img
            src={url}
            alt={alt || 'Preview'}
            className="size-full object-cover"
            onError={() => setPreviewError(true)}
          />
          {/* Overlay to allow re-uploading */}
          <div
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-white flex flex-col items-center">
              <Upload className="size-6 mb-1" />
              <span className="text-xs font-medium">Change Image</span>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "flex items-center justify-center aspect-video w-full max-w-md rounded-md border border-dashed bg-muted/50 cursor-pointer transition-colors",
            isDragging ? "border-primary bg-primary/5" : "hover:bg-muted",
            isUploading && "opacity-50 pointer-events-none"
          )}
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <Upload className="size-8 mx-auto mb-2" />
              <p className="text-sm">Drag & drop or click to upload</p>
              <p className="text-xs mt-1 text-muted-foreground/70">or enter URL below</p>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Image URL Input */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="image-url" className="text-xs">Image URL</Label>
          <Input
            id="image-url"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="image-alt" className="text-xs">Alt Text</Label>
          <Input
            id="image-alt"
            value={alt}
            onChange={(e) => onChange({ alt: e.target.value })}
            placeholder="Description of the image"
          />
        </div>
      </div>

      {/* Caption */}
      <div className="space-y-1">
        <Label htmlFor="image-caption" className="text-xs">Caption (optional)</Label>
        <Input
          id="image-caption"
          value={caption}
          onChange={(e) => onChange({ caption: e.target.value })}
          placeholder="Add a caption for this image"
        />
      </div>
    </div>
  );
}
