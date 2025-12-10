import type { ContentBlock, ProductBlock } from '~/interface/blog.interface';
import { ProductCard } from '~/components/share/product-card';
import { cn } from '~/lib/utils';
import { useNavigate } from 'react-router';


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
import { useCartStore } from "~/store/cart";
import { toast } from "sonner";
import { Link } from "react-router";

function ProductBlockRenderer({ block }: { block: ProductBlock }) {
  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addItem({
      productId: block.productId,
      productName: block.productName,
      image: block.productImage || '',
      price: block.productPrice,
      quantity: 1,
      variantName: 'Standard'
    });
    toast.success(`Added ${block.productName} to cart`);
  };

  return (
    <div id={block.id} className="my-12">
      <div role='button' onClick={() => navigate(`/product-detail/${block.productId}`)} className="border border-gray-200 bg-white flex flex-col md:flex-row overflow-hidden cursor-pointer">
        {/* Left Side: Image */}
        <div className="md:w-[35%] aspect-4/3 md:aspect-auto md:min-h-[100px] relative">
          <img
            src={block.productImage}
            alt={block.productName}
            className="w-full h-full object-cover absolute inset-0"
          />
        </div>

        {/* Right Side: Content */}
        <div className="md:w-[65%] px-6 py-4 flex flex-col justify-center">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-serif text-xl text-gray-900 pr-4">
              {block.productName}
            </h3>
            <span className="font-serif text-xl font-medium text-gray-900 shrink-0">
              {formatCurrencyFromCents(block.productPrice, { symbol: '$' })}
            </span>
          </div>

          <div className="prose prose-sm text-gray-500 mb-6 font-light text-md">
            {/* Note: The description is not currently in the ProductBlock schema. 
                 Using a generic placeholder or leaving mostly empty until schema update. 
                 The reference implies a description, but we only have name/price.
                 We will render nothing for now to keep it clean, or could add an optional field. 
             */}
            <p>Experience the ultimate skincare luxury with {block.productName}.</p>
          </div>

          <div>
            <button
              onClick={handleAddToCart}
              className="px-8 py-3 bg-black text-white text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

