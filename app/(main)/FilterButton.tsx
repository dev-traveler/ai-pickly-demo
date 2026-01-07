"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterButtonProps {
  activeFilters: number;
  responsive?: boolean;
  onClick: () => void;
}

export function FilterButton({
  activeFilters,
  responsive = false,
  onClick,
}: FilterButtonProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!responsive) return;

    const toggleVisibility = () => {
      // 화면 끝까지 300px 남았을 때 버튼 숨김
      if (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 300
      ) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, [responsive]);

  if (!isVisible) return null;

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
