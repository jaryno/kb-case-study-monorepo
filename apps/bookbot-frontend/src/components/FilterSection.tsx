export interface FilterOption {
  label: string;
  value: string;
  count: number;
}

interface FilterSectionProps {
  title: string;
  options: FilterOption[];
  filterKey: string;
  isActive: (key: string, value: string) => boolean;
  onToggle: (key: string, value: string) => void;
}

export default function FilterSection({
  title,
  options,
  filterKey,
  isActive,
  onToggle,
}: FilterSectionProps) {
  if (options.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold text-sm mb-2">{title}</h3>
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex items-center gap-2 text-sm cursor-pointer py-0.5"
        >
          <input
            type="checkbox"
            checked={isActive(filterKey, opt.value)}
            onChange={() => onToggle(filterKey, opt.value)}
          />
          {opt.label}
          <span className="text-gray-400 text-xs">({opt.count})</span>
        </label>
      ))}
    </div>
  );
}

