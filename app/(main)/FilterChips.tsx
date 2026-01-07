"use client";

import { useFilterStore } from "@/lib/stores/filter-store";
import {
  CATEGORIES,
  DIFFICULTY_OPTIONS,
  TIME_RANGE_OPTIONS,
} from "@/lib/constants/filters";
import type { AIToolData } from "@/lib/db/ai-tools";
import { FilterChip } from "./FilterChip";
import type { filterChip } from "@/types/filter";

interface FilterChipsProps {
  aiTools: AIToolData[];
}

export function FilterChips({ aiTools }: FilterChipsProps) {
  const {
    selectedCategories,
    selectedDifficulty,
    selectedTimeRange,
    selectedAITool,
    toggleCategory,
    setDifficulty,
    setTimeRange,
    toggleAITool,
  } = useFilterStore();

  const chips: Array<filterChip> = [];

  // Add category chips
  selectedCategories.forEach((categoryId) => {
    const category = CATEGORIES.find((c) => c.id === categoryId);
    if (category) {
      chips.push({
        id: `category-${categoryId}`,
        label: category.label,
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
        onRemove: () => toggleAITool(selectedAITool),
      });
    }
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <FilterChip key={chip.id} chip={chip} />
      ))}
    </div>
  );
}
