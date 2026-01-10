"use client";

import { useQueryState } from "nuqs";
import { XIcon } from "lucide-react";
import { FilterChips } from "@/app/(main)/FilterChips";
import { FilterButton } from "@/app/(main)/FilterButton";
import type { AIToolData } from "@/lib/db/ai-tools";
import { filterChip } from "@/types/filter";
import {
  CATEGORIES,
  DIFFICULTY_OPTIONS,
  TIME_RANGE_OPTIONS,
} from "@/lib/constants/filters";
import { useFiltersSearchParams } from "@/hooks/useFiltersSearchParams";
import { trackClick } from "@/lib/analytics/mixpanel";

interface FilterBarProps {
  totalResults?: number | string;
  aiTools: AIToolData[];
  onOpenFilter: () => void;
}

export function FilterBar({
  totalResults,
  aiTools,
  onOpenFilter,
}: FilterBarProps) {
  const [category, setCategory] = useQueryState("category");
  const [difficulty, setDifficulty] = useQueryState("difficulty");
  const [time, setTime] = useQueryState("time");
  const [tool, setTool] = useQueryState("tool");
  const [, setSearchParams] = useFiltersSearchParams();

  const resetFilterChips = () => {
    trackClick("button", {
      page_name: "home",
      object_section: "body",
      object_id: "refresh_filters",
      object_name: "refresh_filters",
    });
    setSearchParams(null);
  };

  const chips: Array<filterChip> = [];

  // Add category chips
  if (category) {
    const c = CATEGORIES.find((t) => t.id === category);
    if (c) {
      chips.push({
        id: `category-${c.id}`,
        label: c.label,
        onRemove: () => setCategory(null),
      });
    }
  }

  // Add difficulty chip
  if (difficulty) {
    const d = DIFFICULTY_OPTIONS.find((d) => d.value === difficulty);
    if (d) {
      chips.push({
        id: "difficulty",
        label: d.label,
        onRemove: () => setDifficulty(null),
      });
    }
  }

  // Add time range chip
  if (time) {
    const t = TIME_RANGE_OPTIONS.find((t) => t.value === time);
    if (t) {
      chips.push({
        id: "time-range",
        label: t.label,
        onRemove: () => setTime(null),
      });
    }
  }

  // Add AI tool chip
  if (tool) {
    const t = aiTools.find((t) => t.id === tool);
    if (t) {
      chips.push({
        id: `tool-${t.id}`,
        label: t.name,
        onRemove: () => setTool(null),
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
              <XIcon className="size-8 p-2" onClick={resetFilterChips} />
            )}
          </div>
        </div>
        <div className="hidden md:block">
          <FilterButton onClick={onOpenFilter} />
        </div>
      </div>
    </div>
  );
}
