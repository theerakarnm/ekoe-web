interface ResultCountProps {
  total: number;
}

export function ResultCount({ total }: ResultCountProps) {
  const productText = total === 1 ? 'product' : 'products';
  
  return (
    <p className="text-sm font-serif text-gray-900">
      Showing {total} {productText}
    </p>
  );
}
