interface StockBadgeProps {
  label: string;
  inStock: boolean;
}

export default function StockBadge({ label, inStock }: StockBadgeProps) {
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded ${
        inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'
      }`}
    >
      {label}
    </span>
  );
}

