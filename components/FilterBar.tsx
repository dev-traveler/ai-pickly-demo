"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterChips } from "@/components/FilterChips";
import { FilterSheet } from "@/components/FilterSheet";
import { useFilterStore } from "@/lib/stores/filter-store";
import type { AIToolData } from "@/lib/db/ai-tools";

interface FilterBarProps {
  totalResults?: number;
  aiTools: AIToolData[];
}

export function FilterBar({ totalResults = 0, aiTools }: FilterBarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { getActiveFilterCount } = useFilterStore();
  const activeFilters = getActiveFilterCount();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <h2 className="text-lg font-semibold text-gray-900">
            결과 <span className="text-gray-500">{totalResults}</span>
          </h2>
          <FilterChips aiTools={aiTools} />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSheetOpen(true)}
          className="rounded-full gap-2 whitespace-nowrap"
        >
          <span>필터</span>
          <SlidersHorizontal className="h-4 w-4" />
          {activeFilters > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-xs text-white">
              {activeFilters}
            </span>
          )}
        </Button>
      </div>

      <FilterSheet open={sheetOpen} onOpenChange={setSheetOpen} aiTools={aiTools} />
    </div>
  );
}
