import { useState } from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

interface ImageBlockProps {
  url: string;
  alt: string;
  caption: string;
  onChange: (updates: { url?: string; alt?: string; caption?: string }) => void;
}

export function ImageBlock({ url, alt, caption, onChange }: ImageBlockProps) {
  const [previewError, setPreviewError] = useState(false);

  const handleUrlChange = (newUrl: string) => {
    setPreviewError(false);
    onChange({ url: newUrl });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
        <ImageIcon className="size-3" />
        <span className="font-medium">Image Block</span>
      </div>

      {/* Image Preview */}
      {url && !previewError ? (
        <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-md border bg-muted">
          <img
            src={url}
            alt={alt || 'Preview'}
            className="size-full object-cover"
            onError={() => setPreviewError(true)}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center aspect-video w-full max-w-md rounded-md border border-dashed bg-muted/50">
          <div className="text-center text-muted-foreground">
            <Upload className="size-8 mx-auto mb-2" />
            <p className="text-sm">Enter an image URL below</p>
          </div>
        </div>
      )}

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
