"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterButtonProps {
  activeFilters: number;
  onClick: () => void;
}

export function FilterButton({ activeFilters, onClick }: FilterButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="rounded-full gap-2 whitespace-nowrap"
    >
      <span>필터</span>
      <SlidersHorizontal className="h-4 w-4" />
      {activeFilters > 0 && (
        <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-xs text-white">
          {activeFilters}
        </span>
      )}
    </Button>
  );
}
