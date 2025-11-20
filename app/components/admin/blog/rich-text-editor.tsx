import { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Package,
  Upload,
  Search,
} from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Label } from '~/components/ui/label';
import { cn } from '~/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

// Mock product data
const MOCK_PRODUCTS = [
  { id: 1, name: 'Premium Skin Serum', slug: 'premium-skin-serum', price: 1290, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop' },
  { id: 2, name: 'Daily Moisturizer', slug: 'daily-moisturizer', price: 890, image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?w=200&h=200&fit=crop' },
  { id: 3, name: 'Night Repair Cream', slug: 'night-repair-cream', price: 1590, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=200&fit=crop' },
  { id: 4, name: 'Vitamin C Booster', slug: 'vitamin-c-booster', price: 1100, image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b8ccb0?w=200&h=200&fit=crop' },
  { id: 5, name: 'Gentle Cleanser', slug: 'gentle-cleanser', price: 590, image: 'https://images.unsplash.com/photo-1556228720-1957be83f307?w=200&h=200&fit=crop' },
];

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your content here...',
  error,
}: RichTextEditorProps) {
  const [showHtmlSource, setShowHtmlSource] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);

  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [productSearch, setProductSearch] = useState('');

  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editorRef.current && !showHtmlSource) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, showHtmlSource]);

  const handleEditorInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleEditorInput();
  };

  const handleBold = () => execCommand('bold');
  const handleItalic = () => execCommand('italic');
  const handleUnderline = () => execCommand('underline');
  const handleH1 = () => execCommand('formatBlock', '<h1>');
  const handleH2 = () => execCommand('formatBlock', '<h2>');
  const handleH3 = () => execCommand('formatBlock', '<h3>');
  const handleUnorderedList = () => execCommand('insertUnorderedList');
  const handleOrderedList = () => execCommand('insertOrderedList');

  const handleLinkInsert = () => {
    if (linkUrl) {
      const html = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText || linkUrl}</a>`;
      execCommand('insertHTML', html);
      setLinkUrl('');
      setLinkText('');
      setLinkDialogOpen(false);
    }
  };

  const handleImageInsert = () => {
    if (imageUrl) {
      const html = `<img src="${imageUrl}" alt="${imageAlt}" style="max-width: 100%; height: auto;" />`;
      execCommand('insertHTML', html);
      setImageUrl('');
      setImageAlt('');
      setImageFile(null);
      setImageDialogOpen(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create a fake local URL for preview/insertion
      // In a real app, you'd upload this to a server and get a real URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImageUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductInsert = (product: typeof MOCK_PRODUCTS[0]) => {
    const html = `
      <div class="product-card" style="border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0; display: flex; align-items: center; gap: 1rem; max-width: 400px;">
        <img src="${product.image}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 0.375rem;" />
        <div style="flex: 1;">
          <h4 style="margin: 0; font-size: 1rem; font-weight: 600;">${product.name}</h4>
          <p style="margin: 0.25rem 0 0; color: #64748b;">฿${product.price.toLocaleString()}</p>
        </div>
        <a href="/products/${product.slug}" style="background-color: #0f172a; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; text-decoration: none; font-size: 0.875rem;">View</a>
      </div>
      <p><br/></p>
    `;
    execCommand('insertHTML', html);
    setProductDialogOpen(false);
  };

  const toggleHtmlSource = () => {
    if (!showHtmlSource && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    setShowHtmlSource(!showHtmlSource);
  };

  const filteredProducts = MOCK_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 rounded-md border bg-muted/50 p-2">
        <div className="flex items-center gap-1 border-r pr-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleBold}
            title="Bold"
            disabled={showHtmlSource}
          >
            <Bold className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleItalic}
            title="Italic"
            disabled={showHtmlSource}
          >
            <Italic className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleUnderline}
            title="Underline"
            disabled={showHtmlSource}
          >
            <Underline className="size-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1 border-r pr-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleH1}
            title="Heading 1"
            disabled={showHtmlSource}
          >
            <Heading1 className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleH2}
            title="Heading 2"
            disabled={showHtmlSource}
          >
            <Heading2 className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleH3}
            title="Heading 3"
            disabled={showHtmlSource}
          >
            <Heading3 className="size-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1 border-r pr-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleUnorderedList}
            title="Bullet List"
            disabled={showHtmlSource}
          >
            <List className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleOrderedList}
            title="Numbered List"
            disabled={showHtmlSource}
          >
            <ListOrdered className="size-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1 border-r pr-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setLinkDialogOpen(true)}
            title="Insert Link"
            disabled={showHtmlSource}
          >
            <LinkIcon className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setImageDialogOpen(true)}
            title="Insert Image"
            disabled={showHtmlSource}
          >
            <ImageIcon className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setProductDialogOpen(true)}
            title="Mention Product"
            disabled={showHtmlSource}
          >
            <Package className="size-4" />
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleHtmlSource}
          title="Toggle HTML Source"
        >
          <Code className="size-4 mr-2" />
          {showHtmlSource ? 'Visual' : 'HTML'}
        </Button>
      </div>

      {/* Editor */}
      {showHtmlSource ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextareaChange}
          placeholder={placeholder}
          className={cn(
            'min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono',
            'ring-offset-background placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive'
          )}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleEditorInput}
          className={cn(
            'min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
            'ring-offset-background',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'prose prose-sm max-w-none',
            '[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2',
            '[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-2',
            '[&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-2 [&_h3]:mb-1',
            '[&_p]:my-2',
            '[&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2',
            '[&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-2',
            '[&_a]:text-primary [&_a]:underline',
            '[&_img]:max-w-full [&_img]:h-auto [&_img]:my-4',
            error && 'border-destructive'
          )}
          dangerouslySetInnerHTML={{ __html: value || '' }}
        />
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
            <DialogDescription>
              Add a hyperlink to your content
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="link-text">Link Text</Label>
              <Input
                id="link-text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Click here"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setLinkDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleLinkInsert}>
              Insert Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
            <DialogDescription>
              Upload an image or enter a URL
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Image</Label>
              <div className="flex gap-2">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 size-4" />
                  {imageFile ? imageFile.name : 'Choose File'}
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or via URL
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-alt">Alt Text</Label>
              <Input
                id="image-alt"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Description of the image"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setImageDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleImageInsert}>
              Insert Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Dialog */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Mention Product</DialogTitle>
            <DialogDescription>
              Select a product to mention in your blog post
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="h-[300px] overflow-y-auto rounded-md border p-4">
              <div className="space-y-2">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    className="flex w-full items-center gap-3 rounded-lg border p-2 text-left hover:bg-accent"
                    onClick={() => handleProductInsert(product)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        ฿{product.price.toLocaleString()}
                      </div>
                    </div>
                  </button>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    No products found
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
