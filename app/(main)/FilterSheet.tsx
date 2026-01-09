"use client";

import { useQueryState } from "nuqs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  CATEGORIES,
  DIFFICULTY_OPTIONS,
  TIME_RANGE_OPTIONS,
} from "@/lib/constants/filters";
import type { AIToolData } from "@/lib/db/ai-tools";
import { FilterOptionButton } from "@/app/(main)/FilterOptionButton";
import { useFiltersSearchParams } from "@/hooks/useFiltersSearchParams";

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aiTools: AIToolData[];
}

export function FilterSheet({ open, onOpenChange, aiTools }: FilterSheetProps) {
  const [category, setCategory] = useQueryState("category");
  const [difficulty, setDifficulty] = useQueryState("difficulty");
  const [time, setTime] = useQueryState("time");
  const [tool, setTool] = useQueryState("tool");
  const [, setFilterSearchParams] = useFiltersSearchParams();

  const resetFilterChips = () => setFilterSearchParams(null);

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
              {CATEGORIES.map((categoryOption) => {
                const isSelected = category === categoryOption.id;
                return (
                  <FilterOptionButton
                    key={categoryOption.id}
                    selected={isSelected}
                    onClick={() =>
                      isSelected
                        ? setCategory(null)
                        : setCategory(categoryOption.id)
                    }
                  >
                    {categoryOption.label}
                  </FilterOptionButton>
                );
              })}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">난이도</h3>
            <div className="flex gap-2">
              {DIFFICULTY_OPTIONS.map((difficultyOption) => {
                const isSelected = difficulty === difficultyOption.value;
                return (
                  <FilterOptionButton
                    key={difficultyOption.value}
                    selected={isSelected}
                    onClick={() =>
                      isSelected
                        ? setDifficulty(null)
                        : setDifficulty(difficultyOption.value)
                    }
                  >
                    {difficultyOption.label}
                  </FilterOptionButton>
                );
              })}
            </div>
          </div>

          {/* Time Range Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">소요시간</h3>
            <div className="flex gap-2">
              {TIME_RANGE_OPTIONS.map((timeRangeOption) => {
                const isSelected = time === timeRangeOption.value;
                return (
                  <FilterOptionButton
                    key={timeRangeOption.value}
                    selected={isSelected}
                    onClick={() =>
                      isSelected
                        ? setTime(null)
                        : setTime(timeRangeOption.value)
                    }
                  >
                    {timeRangeOption.label}
                  </FilterOptionButton>
                );
              })}
            </div>
          </div>

          {/* AI Tools Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">AI 툴</h3>
            <div className="flex flex-wrap gap-2">
              {aiTools.map((aiToolData) => {
                const isSelected = tool === aiToolData.id;
                return (
                  <FilterOptionButton
                    key={aiToolData.id}
                    selected={isSelected}
                    onClick={() =>
                      isSelected ? setTool(null) : setTool(aiToolData.id)
                    }
                  >
                    {aiToolData.name}
                  </FilterOptionButton>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer with Reset Button */}
        <div className="border-t bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] space-y-2">
          <Button
            variant="cta"
            onClick={() => {
              onOpenChange(false);
            }}
            className="w-full h-10 rounded-full font-semibold"
          >
            필터 적용
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              resetFilterChips();
            }}
            className="w-full h-10 rounded-full"
          >
            필터 초기화
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
