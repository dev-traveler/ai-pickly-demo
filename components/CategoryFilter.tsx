"use client";

import { cn } from "@/lib/utils";
import { useFilterStore } from "@/lib/stores/filter-store";
import { CATEGORIES } from "@/lib/constants/filters";
import { Button } from "@/components/ui/button";

export function CategoryFilter() {
  const { selectedCategories, toggleCategory } = useFilterStore();

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {CATEGORIES.map((category) => {
        const Icon = category.icon;
        const isSelected = selectedCategories.includes(category.id);

        return (
          <Button
            key={category.id}
            variant={isSelected ? "default" : "outline"}
            size="lg"
            onClick={() => toggleCategory(category.id)}
            className={cn(
              "flex items-center gap-2 rounded-2xl px-6 whitespace-nowrap",
              isSelected
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "bg-white hover:bg-gray-50"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{category.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
