import { useState } from 'react';
import { Plus, GripVertical, Trash2, Type, Image, Package, Heading, Quote } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { cn } from '~/lib/utils';
import { TextBlock } from './blocks/text-block';
import { ImageBlock } from './blocks/image-block';
import { ProductBlock } from './blocks/product-block';
import { HeadingBlock } from './blocks/heading-block';
import { QuoteBlock } from './blocks/quote-block';

// ============================================================================
// Types
// ============================================================================

export interface ContentBlock {
  id: string;
  anchorId?: string;
  type: 'text' | 'image' | 'product' | 'heading' | 'quote';
  // Text block
  content?: string;
  // Image block
  url?: string;
  alt?: string;
  caption?: string;
  // Product block
  productId?: string;
  productName?: string;
  productSlug?: string;
  productPrice?: number;
  productImage?: string;
  // Heading block
  level?: 1 | 2 | 3;
  // Quote block
  author?: string;
}

interface BlockEditorProps {
  value: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  error?: string;
}

const BLOCK_TYPES = [
  { type: 'text', label: 'Text', icon: Type, description: 'Rich text content' },
  { type: 'heading', label: 'Heading', icon: Heading, description: 'Section heading (H1/H2/H3)' },
  { type: 'image', label: 'Image', icon: Image, description: 'Image with caption' },
  { type: 'product', label: 'Product', icon: Package, description: 'Product card' },
  { type: 'quote', label: 'Quote', icon: Quote, description: 'Blockquote' },
] as const;

// ============================================================================
// Helper Functions
// ============================================================================

function generateBlockId(): string {
  return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateAnchorId(content: string): string {
  return content
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50);
}

function createEmptyBlock(type: ContentBlock['type']): ContentBlock {
  const id = generateBlockId();
  const base = { id, type };

  switch (type) {
    case 'text':
      return { ...base, type: 'text', content: '' };
    case 'image':
      return { ...base, type: 'image', url: '', alt: '', caption: '' };
    case 'product':
      return { ...base, type: 'product', productId: '', productName: '', productSlug: '', productPrice: 0 };
    case 'heading':
      return { ...base, type: 'heading', level: 2, content: '', anchorId: '' };
    case 'quote':
      return { ...base, type: 'quote', content: '', author: '' };
    default:
      return { ...base, type: 'text', content: '' };
  }
}

// ============================================================================
// Block Editor Component
// ============================================================================

export function BlockEditor({ value, onChange, error }: BlockEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const addBlock = (type: ContentBlock['type'], afterIndex?: number) => {
    const newBlock = createEmptyBlock(type);
    const newBlocks = [...value];
    const insertIndex = afterIndex !== undefined ? afterIndex + 1 : newBlocks.length;
    newBlocks.splice(insertIndex, 0, newBlock);
    onChange(newBlocks);
  };

  const updateBlock = (index: number, updates: Partial<ContentBlock>) => {
    const newBlocks = [...value];
    const block = { ...newBlocks[index], ...updates };

    // Auto-generate anchorId for headings
    if (block.type === 'heading' && updates.content !== undefined) {
      block.anchorId = generateAnchorId(updates.content);
    }

    newBlocks[index] = block;
    onChange(newBlocks);
  };

  const deleteBlock = (index: number) => {
    const newBlocks = value.filter((_, i) => i !== index);
    onChange(newBlocks);
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const newBlocks = [...value];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, movedBlock);
    onChange(newBlocks);
  };

  // Drag handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null) {
      moveBlock(draggedIndex, dragOverIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Empty State */}
      {value.length === 0 && (
        <Card className="p-8 text-center border-dashed">
          <p className="text-muted-foreground mb-4">
            No content blocks yet. Add your first block to get started.
          </p>
          <AddBlockButton onAdd={addBlock} />
        </Card>
      )}

      {/* Block List */}
      <div className="space-y-3">
        {value.map((block, index) => (
          <div
            key={block.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={cn(
              'relative group transition-all',
              draggedIndex === index && 'opacity-50',
              dragOverIndex === index && 'ring-2 ring-primary ring-offset-2'
            )}
          >
            <Card className="p-4">
              <div className="flex gap-3">
                {/* Drag Handle */}
                <div
                  className="flex items-center cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
                  title="Drag to reorder"
                >
                  <GripVertical className="size-5" />
                </div>

                {/* Block Content */}
                <div className="flex-1 min-w-0">
                  <BlockRenderer
                    block={block}
                    onChange={(updates) => updateBlock(index, updates)}
                  />
                </div>

                {/* Delete Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deleteBlock(index)}
                  title="Delete block"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </Card>

            {/* Add Block After Button (shows on hover) */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <AddBlockButton onAdd={(type) => addBlock(type, index)} compact />
            </div>
          </div>
        ))}
      </div>

      {/* Add Block Button (always visible at bottom) */}
      {value.length > 0 && (
        <div className="pt-2">
          <AddBlockButton onAdd={addBlock} />
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

// ============================================================================
// Add Block Button Component
// ============================================================================

interface AddBlockButtonProps {
  onAdd: (type: ContentBlock['type']) => void;
  compact?: boolean;
}

function AddBlockButton({ onAdd, compact }: AddBlockButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant={compact ? 'outline' : 'default'}
          size={compact ? 'sm' : 'default'}
          className={cn(compact && 'h-7 px-2 text-xs')}
        >
          <Plus className={cn('mr-1', compact ? 'size-3' : 'size-4')} />
          Add Block
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56">
        {BLOCK_TYPES.map(({ type, label, icon: Icon, description }) => (
          <DropdownMenuItem
            key={type}
            onClick={() => onAdd(type)}
            className="flex items-start gap-3 py-2"
          >
            <Icon className="size-4 mt-0.5 text-muted-foreground" />
            <div>
              <div className="font-medium">{label}</div>
              <div className="text-xs text-muted-foreground">{description}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================================
// Block Renderer Component
// ============================================================================

interface BlockRendererProps {
  block: ContentBlock;
  onChange: (updates: Partial<ContentBlock>) => void;
}

function BlockRenderer({ block, onChange }: BlockRendererProps) {
  switch (block.type) {
    case 'text':
      return <TextBlock value={block.content || ''} onChange={(content) => onChange({ content })} />;
    case 'image':
      return (
        <ImageBlock
          url={block.url || ''}
          alt={block.alt || ''}
          caption={block.caption || ''}
          onChange={onChange}
        />
      );
    case 'product':
      return (
        <ProductBlock
          productId={block.productId || ''}
          productName={block.productName || ''}
          productSlug={block.productSlug || ''}
          productPrice={block.productPrice || 0}
          productImage={block.productImage || ''}
          onChange={onChange}
        />
      );
    case 'heading':
      return (
        <HeadingBlock
          level={block.level || 2}
          content={block.content || ''}
          onChange={onChange}
        />
      );
    case 'quote':
      return (
        <QuoteBlock
          content={block.content || ''}
          author={block.author || ''}
          onChange={onChange}
        />
      );
    default:
      return <div className="text-muted-foreground">Unknown block type</div>;
  }
}
