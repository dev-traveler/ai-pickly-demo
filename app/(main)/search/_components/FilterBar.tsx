"use client";

import { useQueryState } from "nuqs";
import { XIcon } from "lucide-react";
import { FilterChips } from "@/app/(main)/search/_components/FilterChips";
import { FilterButton } from "@/app/(main)/search/_components/FilterButton";
import type { AIToolData } from "@/lib/db/ai-tools";
import { filterChip } from "@/types/filter";
import {
  CATEGORIES,
  DIFFICULTY_OPTIONS,
  TIME_RANGE_OPTIONS,
} from "@/lib/constants/filters";
import { useFiltersSearchParams } from "@/hooks/useFiltersSearchParams";
import mixpanel from "mixpanel-browser";

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
  const displayTotalResults =
    typeof totalResults === "number" && totalResults >= 100
      ? "99+"
      : totalResults;
  const [category, setCategory] = useQueryState("category");
  const [difficulty, setDifficulty] = useQueryState("difficulty");
  const [time, setTime] = useQueryState("time");
  const [tool, setTool] = useQueryState("tool");
  const [, setSearchParams] = useFiltersSearchParams();

  const resetFilterChips = () => {
    mixpanel.track("click@button", {
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
        onRemove: () => {
          mixpanel.track("click@button", {
            page_name: "home",
            object_section: "body",
            object_id: c.id,
            object_name: c.label,
          });
          setCategory(null);
        },
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
        onRemove: () => {
          mixpanel.track("click@button", {
            page_name: "home",
            object_section: "body",
            object_id: d.value,
            object_name: d.label,
          });
          setDifficulty(null);
        },
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
        onRemove: () => {
          mixpanel.track("click@button", {
            page_name: "home",
            object_section: "body",
            object_id: t.value,
            object_name: t.label,
          });
          setTime(null);
        },
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
        onRemove: () => {
          mixpanel.track("click@button", {
            page_name: "home",
            object_section: "body",
            object_id: t.id,
            object_name: t.name,
          });
          setTool(null);
        },
      });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center md:gap-4 flex-1">
          <h2 className="text-lg font-semibold text-gray-900">
            결과 <span className="text-gray-500">{displayTotalResults}</span>
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
