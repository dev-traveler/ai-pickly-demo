"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { filterChip } from "@/types/filter";
import { trackClick } from "@/lib/analytics/mixpanel";

interface FilterChipProps {
  chip: filterChip;
}

export function FilterChip({ chip }: FilterChipProps) {
  const handleRemove = () => {
    trackClick("button", {
      page_name: "home",
      object_section: "body",
      object_id: chip.id,
      object_name: chip.label,
    });
    chip.onRemove();
  };

  return (
    <Badge
      key={chip.id}
      variant="secondary"
      className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-900"
    >
      {chip.label}
      <button
        onClick={handleRemove}
        className="ml-2 inline-flex items-center justify-center rounded-full hover:bg-gray-300 transition-colors"
        aria-label={`Remove ${chip.label} filter`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </Badge>
  );
}
