import type { ContentBlock, ProductBlock } from '~/interface/blog.interface';
import { ProductCard } from '~/components/share/product-card';
import { cn } from '~/lib/utils';
import type { IProduct } from '~/interface/product.interface';


interface ContentRendererProps {
  blocks: ContentBlock[];
}

export function ContentRenderer({ blocks }: ContentRendererProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="space-y-8">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
}

function BlockRenderer({ block }: { block: ContentBlock }) {
  const { type, id } = block;

  switch (type) {
    case 'text':
      return (
        <div
          id={id}
          className="prose prose-stone max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
      );

    case 'image':
      return (
        <figure id={id} className="my-8">
          <img
            src={block.url}
            alt={block.alt || ''}
            className="w-full h-auto rounded-lg object-cover"
          />
          {block.caption && (
            <figcaption className="text-center text-sm text-muted-foreground mt-2">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'heading':
      const tags = {
        1: 'h1',
        2: 'h2',
        3: 'h3',
      } as const;
      const HeadingTag = tags[block.level as 1 | 2 | 3] || 'h2';

      return (
        <HeadingTag
          id={block.anchorId || id}
          className={cn(
            "font-bold tracking-tight mt-8 mb-4 scroll-m-20",
            block.level === 1 && "text-3xl",
            block.level === 2 && "text-2xl",
            block.level === 3 && "text-xl"
          )}
        >
          {block.content}
        </HeadingTag>
      );

    case 'quote':
      return (
        <blockquote id={id} className="border-l-4 border-primary pl-6 italic my-8 text-xl text-muted-foreground">
          "{block.content}"
          {block.author && <footer className="text-base text-foreground mt-2 not-italic font-medium">— {block.author}</footer>}
        </blockquote>
      );

    case 'product':
      return <ProductBlockRenderer block={block} />;

    default:
      return null;
  }
}

import { formatCurrencyFromCents } from "~/lib/formatter";

function ProductBlockRenderer({ block }: { block: ProductBlock }) {
  // Construct a partial product object compatible with ProductCard
  const product: IProduct = {
    productId: block.productId,
    productName: block.productName,
    image: {
      url: block.productImage || '',
      description: block.productName
    },
    // Assuming productPrice is in cents consistently
    quickCartPrice: block.productPrice,
    priceTitle: formatCurrencyFromCents(block.productPrice, { symbol: '$' }),
    // Optional fields
    subtitle: '',
    rating: 0,
    reviewCount: 0,
  };

  return (
    <div id={block.id} className="my-8 flex justify-center">
      <div className="max-w-xs w-full">
        <ProductCard product={product} />
      </div>
    </div>
  );
}
