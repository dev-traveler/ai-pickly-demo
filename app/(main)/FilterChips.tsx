"use client";

import { FilterChip } from "./FilterChip";
import type { filterChip } from "@/types/filter";

interface FilterChipsProps {
  chips: Array<filterChip>;
}

export function FilterChips({ chips }: FilterChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {chips.map((chip) => (
        <FilterChip key={chip.id} chip={chip} />
      ))}
    </div>
  );
}
