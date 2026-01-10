"use client";

import { useQueryState } from "nuqs";
import { CATEGORIES } from "@/lib/constants/filters";
import { FilterOptionButton } from "@/app/(main)/FilterOptionButton";
import { trackClick } from "@/lib/analytics/mixpanel";

export function CategoryFilter() {
  const [categoryQuery, setCategoryQuery] = useQueryState("category");

  const toggleCategory = (id: string, label: string) => {
    trackClick("button", {
      page_name: "home",
      object_section: "body",
      object_id: id,
      object_name: label,
    });
    setCategoryQuery(categoryQuery === id ? null : id);
  };

  return (
    <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2">
      {CATEGORIES.map((category) => {
        const Icon = category.icon;
        const isSelected = categoryQuery === category.id;

        return (
          <FilterOptionButton
            key={category.id}
            selected={isSelected}
            onClick={() => toggleCategory(category.id, category.label)}
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
