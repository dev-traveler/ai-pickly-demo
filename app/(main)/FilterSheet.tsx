"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useFilterStore } from "@/lib/stores/filter-store";
import {
  CATEGORIES,
  DIFFICULTY_OPTIONS,
  TIME_RANGE_OPTIONS,
} from "@/lib/constants/filters";
import type { AIToolData } from "@/lib/db/ai-tools";
import { FilterOptionButton } from "@/app/(main)/FilterOptionButton";

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aiTools: AIToolData[];
}

export function FilterSheet({ open, onOpenChange, aiTools }: FilterSheetProps) {
  const {
    selectedCategories,
    selectedDifficulty,
    selectedTimeRange,
    selectedAITool,
    toggleCategory,
    setDifficulty,
    setTimeRange,
    toggleAITool,
    resetFilters,
  } = useFilterStore();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-dvh w-full flex-col p-0 sm:max-w-md"
      >
        <SheetHeader className="flex flex-row items-center justify-between px-6 pb-4 pt-6">
          <SheetTitle className="text-xl font-bold">필터</SheetTitle>
          <SheetClose />
        </SheetHeader>

        <div className="flex-1 space-y-8 overflow-y-auto px-6 pb-10 pt-2">
          {/* Category Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">카테고리</h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => {
                const isSelected = selectedCategories.includes(category.id);
                return (
                  <FilterOptionButton
                    key={category.id}
                    selected={isSelected}
                    onClick={() => toggleCategory(category.id)}
                  >
                    {category.label}
                  </FilterOptionButton>
                );
              })}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">난이도</h3>
            <div className="flex gap-2">
              {DIFFICULTY_OPTIONS.map((difficulty) => {
                const isSelected = selectedDifficulty === difficulty.value;
                return (
                  <FilterOptionButton
                    key={difficulty.value}
                    selected={isSelected}
                    onClick={() =>
                      setDifficulty(isSelected ? null : difficulty.value)
                    }
                  >
                    {difficulty.label}
                  </FilterOptionButton>
                );
              })}
            </div>
          </div>

          {/* Time Range Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">소요시간</h3>
            <div className="flex gap-2">
              {TIME_RANGE_OPTIONS.map((timeRange) => {
                const isSelected = selectedTimeRange === timeRange.value;
                return (
                  <FilterOptionButton
                    key={timeRange.value}
                    selected={isSelected}
                    onClick={() =>
                      setTimeRange(isSelected ? null : timeRange.value)
                    }
                  >
                    {timeRange.label}
                  </FilterOptionButton>
                );
              })}
            </div>
          </div>

          {/* AI Tools Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">AI 툴</h3>
            <div className="flex flex-wrap gap-2">
              {aiTools.map((tool) => {
                const isSelected = selectedAITool === tool.id;
                return (
                  <FilterOptionButton
                    key={tool.id}
                    selected={isSelected}
                    onClick={() => toggleAITool(tool.id)}
                  >
                    {tool.name}
                  </FilterOptionButton>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer with Reset Button */}
        <div className="border-t bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              resetFilters();
            }}
            className="w-full rounded-full"
          >
            필터 초기화
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
