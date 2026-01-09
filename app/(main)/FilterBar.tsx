"use client";

import { XIcon } from "lucide-react";
import { FilterChips } from "@/app/(main)/FilterChips";
import { FilterButton } from "@/app/(main)/FilterButton";
import { useFilterStore } from "@/lib/stores/filter-store";
import type { AIToolData } from "@/lib/db/ai-tools";
import { filterChip } from "@/types/filter";
import {
  CATEGORIES,
  DIFFICULTY_OPTIONS,
  TIME_RANGE_OPTIONS,
} from "@/lib/constants/filters";
import { trackFilterReset } from "@/lib/tracking";

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
  const {
    selectedCategories,
    selectedDifficulty,
    selectedTimeRange,
    selectedAITool,
    getActiveFilterCount,
    toggleCategory,
    setDifficulty,
    setTimeRange,
    toggleAITool,
    resetFilterChips,
  } = useFilterStore();
  const activeFilters = getActiveFilterCount();

  const chips: Array<filterChip> = [];

  // Add category chips
  selectedCategories.forEach((categoryId) => {
    const category = CATEGORIES.find((c) => c.id === categoryId);
    if (category) {
      chips.push({
        id: `category-${categoryId}`,
        label: category.label,
        filterType: "category",
        onRemove: () => toggleCategory(categoryId),
      });
    }
  });

  // Add difficulty chip
  if (selectedDifficulty) {
    const difficulty = DIFFICULTY_OPTIONS.find(
      (d) => d.value === selectedDifficulty
    );
    if (difficulty) {
      chips.push({
        id: "difficulty",
        label: difficulty.label,
        filterType: "difficulty",
        onRemove: () => setDifficulty(null),
      });
    }
  }

  // Add time range chip
  if (selectedTimeRange) {
    const timeRange = TIME_RANGE_OPTIONS.find(
      (t) => t.value === selectedTimeRange
    );
    if (timeRange) {
      chips.push({
        id: "time-range",
        label: timeRange.label,
        filterType: "time",
        onRemove: () => setTimeRange(null),
      });
    }
  }

  // Add AI tool chip
  if (selectedAITool) {
    const tool = aiTools.find((t) => t.id === selectedAITool);
    if (tool) {
      chips.push({
        id: `tool-${selectedAITool}`,
        label: tool.name,
        filterType: "tool",
        onRemove: () => toggleAITool(selectedAITool),
      });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center md:gap-4 flex-1">
          <h2 className="text-lg font-semibold text-gray-900">
            결과 <span className="text-gray-500">{totalResults}</span>
          </h2>

          <div className="hidden md:block">
            <FilterChips chips={chips} />
          </div>

          <div>
            {chips.length > 0 && (
              <XIcon
                className="size-8 p-2"
                onClick={() => {
                  trackFilterReset();
                  resetFilterChips();
                }}
              />
            )}
          </div>
        </div>
        <div className="hidden md:block">
          <FilterButton activeFilters={activeFilters} onClick={onOpenFilter} />
        </div>
      </div>
    </div>
  );
}
