import { Button } from "~/components/ui/button";
import { formatCurrencyFromCents } from "~/lib/formatter";
import { useCartStore } from "~/store/cart";
import { toast } from "sonner";

interface RecommendedProductProps {
  product: {
    id: string | number;
    name: string;
    image: string;
    price: number;
    variantId?: string;
    variantName?: string;
    originalPrice?: number;
  };
}

export function RecommendedProduct({ product }: RecommendedProductProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    addItem({
      productId: String(product.id),
      productName: product.name,
      image: product.image,
      price: product.price,
      variantId: product.variantId,
      variantName: product.variantName,
      quantity: 1,
    });
    toast.success(`Added ${product.name} to cart`);
  };

  return (
    <div className="flex items-center gap-4 py-4">
      <div className="w-16 h-16 bg-gray-100 shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-serif text-sm truncate">{product.name}</h4>
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium">{formatCurrencyFromCents(product.price, { symbol: '$' })}</span>
          {product.originalPrice && (
            <span className="text-gray-400 line-through">
              {formatCurrencyFromCents(product.originalPrice, { symbol: '$' })}
            </span>
          )}
        </div>
      </div>
      <Button
        onClick={handleAdd}
        className="h-8 px-4 bg-black text-white hover:bg-gray-800 rounded-none uppercase text-[10px] tracking-widest"
      >
        Add
      </Button>
    </div>
  );
}
