"use client";

import { useFilterStore } from "@/lib/stores/filter-store";
import { CATEGORIES } from "@/lib/constants/filters";
import { FilterOptionButton } from "@/app/(main)/FilterOptionButton";

export function CategoryFilter() {
  const { selectedCategories, toggleCategory } = useFilterStore();

  return (
    <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2">
      {CATEGORIES.map((category) => {
        const Icon = category.icon;
        const isSelected = selectedCategories.includes(category.id);

        return (
          <FilterOptionButton
            key={category.id}
            selected={isSelected}
            onClick={() => toggleCategory(category.id)}
            className="flex items-center gap-2 rounded-2xl px-6 whitespace-nowrap text-xs h-8 md:text-sm md:h-10"
          >
            <Icon className="h-5 w-5 hidden md:block" />
            <span className="font-medium">{category.label}</span>
          </FilterOptionButton>
        );
      })}
    </div>
  );
}
