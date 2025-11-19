import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center border border-gray-200 w-32">
      <button
        onClick={onDecrease}
        className="w-10 h-12 flex items-center justify-center hover:bg-gray-50"
      >
        <Minus size={16} />
      </button>
      <div className="flex-1 text-center font-medium">
        {quantity}
      </div>
      <button
        onClick={onIncrease}
        className="w-10 h-12 flex items-center justify-center hover:bg-gray-50"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
