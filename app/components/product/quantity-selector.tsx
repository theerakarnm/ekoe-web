import { Minus, Plus } from "lucide-react";
import { cn } from "~/lib/utils";

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  className?: string;
}

export function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  className,
}: QuantitySelectorProps) {
  return (
    <div className={cn("flex items-center border border-gray-200 w-32", className)}>
      <button
        onClick={onDecrease}
        className="w-10 h-full flex items-center justify-center hover:bg-gray-50"
      >
        <Minus size={16} />
      </button>
      <div className="flex-1 text-center font-medium">
        {quantity}
      </div>
      <button
        onClick={onIncrease}
        className="w-10 h-full flex items-center justify-center hover:bg-gray-50"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
