"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterOptionButtonProps {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

export function FilterOptionButton({
  selected,
  onClick,
  children,
  className,
}: FilterOptionButtonProps) {
  return (
    <Button
      variant={selected ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className={cn(
        "rounded-full px-4",
        "text-xs h-8 md:text-sm md:h-10",
        selected
          ? "bg-gray-900 text-white hover:bg-gray-800"
          : "bg-white hover:bg-gray-50",
        className
      )}
    >
      {children}
    </Button>
  );
}
