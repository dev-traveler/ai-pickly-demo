import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { filterChip } from "@/types/filter";

interface FilterChipProps {
  chip: filterChip;
}

export function FilterChip({ chip }: FilterChipProps) {
  return (
    <Badge
      key={chip.id}
      variant="secondary"
      className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-900"
    >
      {chip.label}
      <button
        onClick={chip.onRemove}
        className="ml-2 inline-flex items-center justify-center rounded-full hover:bg-gray-300 transition-colors"
        aria-label={`Remove ${chip.label} filter`}
      >
        <X className="h-3.5 w-3.5" onClick={chip.onRemove} />
      </button>
    </Badge>
  );
}
