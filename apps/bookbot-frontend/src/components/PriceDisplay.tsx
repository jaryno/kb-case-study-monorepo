interface PriceDisplayProps {
  label: string | null;
}

export default function PriceDisplay({ label }: PriceDisplayProps) {
  if (!label) {
    return <span className="text-gray-400">—</span>;
  }

  return <span className="font-bold">{label}</span>;
}

