import { Minus, Plus } from "lucide-react";
import { cn } from "~/lib/utils";

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  className?: string;
  disabled?: boolean;
}

export function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  className,
  disabled = false,
}: QuantitySelectorProps) {
  return (
    <div className={cn("flex items-center border border-gray-200 w-32", disabled && "opacity-50", className)}>
      <button
        onClick={onDecrease}
        disabled={disabled}
        className="w-10 h-full flex items-center justify-center hover:bg-gray-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        <Minus size={16} />
      </button>
      <div className="flex-1 text-center font-medium">
        {quantity}
      </div>
      <button
        onClick={onIncrease}
        disabled={disabled}
        className="w-10 h-full flex items-center justify-center hover:bg-gray-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
