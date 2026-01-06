"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useFilterStore } from "@/lib/stores/filter-store";
import {
  CATEGORIES,
  DIFFICULTY_OPTIONS,
  TIME_RANGE_OPTIONS,
} from "@/lib/constants/filters";
import type { AIToolData } from "@/lib/db/ai-tools";

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

  const chips: Array<{ id: string; label: string; onRemove: () => void }> = [];

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
            <X className="h-3.5 w-3.5" />
          </button>
        </Badge>
      ))}
    </div>
  );
}
