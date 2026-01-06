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
import { cn } from "@/lib/utils";
import type { AIToolData } from "@/lib/db/ai-tools";

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
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="flex flex-row items-center justify-between pb-4">
          <SheetTitle className="text-xl font-bold">필터</SheetTitle>
          <SheetClose />
        </SheetHeader>

        <div className="px-6 py-6 space-y-8">
          {/* Category Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">카테고리</h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => {
                const isSelected = selectedCategories.includes(category.id);
                return (
                  <Button
                    key={category.id}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleCategory(category.id)}
                    className={cn(
                      "rounded-full px-4",
                      isSelected
                        ? "bg-gray-900 text-white hover:bg-gray-800"
                        : "bg-white hover:bg-gray-50"
                    )}
                  >
                    {category.label}
                  </Button>
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
                  <Button
                    key={difficulty.value}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setDifficulty(isSelected ? null : difficulty.value)
                    }
                    className={cn(
                      "rounded-full px-4",
                      isSelected
                        ? "bg-gray-900 text-white hover:bg-gray-800"
                        : "bg-white hover:bg-gray-50"
                    )}
                  >
                    {difficulty.label}
                  </Button>
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
                  <Button
                    key={timeRange.value}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setTimeRange(isSelected ? null : timeRange.value)
                    }
                    className={cn(
                      "rounded-full px-4",
                      isSelected
                        ? "bg-gray-900 text-white hover:bg-gray-800"
                        : "bg-white hover:bg-gray-50"
                    )}
                  >
                    {timeRange.label}
                  </Button>
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
                  <Button
                    key={tool.id}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleAITool(tool.id)}
                    className={cn(
                      "rounded-full px-4",
                      isSelected
                        ? "bg-gray-900 text-white hover:bg-gray-800"
                        : "bg-white hover:bg-gray-50"
                    )}
                  >
                    {tool.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer with Reset Button */}
        <div className="absolute bottom-0 left-0 right-0 bg-white p-4">
          <Button
            variant="outline"
            onClick={resetFilters}
            className="w-full rounded-full"
          >
            필터 초기화
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
