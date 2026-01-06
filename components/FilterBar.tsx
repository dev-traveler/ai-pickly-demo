"use client";

import { FilterChips } from "@/components/FilterChips";
import { FilterButton } from "@/components/FilterButton";
import { useFilterStore } from "@/lib/stores/filter-store";
import type { AIToolData } from "@/lib/db/ai-tools";

interface FilterBarProps {
  totalResults?: number;
  aiTools: AIToolData[];
  onOpenFilter: () => void;
}

export function FilterBar({
  totalResults = 0,
  aiTools,
  onOpenFilter,
}: FilterBarProps) {
  const { getActiveFilterCount } = useFilterStore();
  const activeFilters = getActiveFilterCount();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <h2 className="text-lg font-semibold text-gray-900">
            결과 <span className="text-gray-500">{totalResults}</span>
          </h2>

          <div className="hidden md:block">
            <FilterChips aiTools={aiTools} />
          </div>
        </div>
        <div className="hidden md:block">
          <FilterButton
            activeFilters={activeFilters}
            onClick={onOpenFilter}
          />
        </div>
      </div>
    </div>
  );
}
