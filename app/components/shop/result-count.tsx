interface ResultCountProps {
  total: number;
}

export function ResultCount({ total }: ResultCountProps) {
  const productText = total === 1 ? 'product' : 'products';
  
  return (
    <div className="text-sm text-muted-foreground">
      Showing <span className="font-medium text-foreground">{total}</span> {productText}
    </div>
  );
}
