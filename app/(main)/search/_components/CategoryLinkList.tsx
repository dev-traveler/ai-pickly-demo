"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import mixpanel from "mixpanel-browser";
import { CATEGORIES } from "@/lib/constants/filters";
import { cn } from "@/lib/utils";

interface CategoryLinkListProps {
  pageName: string;
}

export function CategoryLinkList({ pageName }: CategoryLinkListProps) {
  const pathname = usePathname();
  const currentSlug = pathname.startsWith("/category/")
    ? pathname.split("/")[2]
    : null;

  return (
    <>
      {CATEGORIES.map((category) => {
        const Icon = category.icon;
        const isSelected = currentSlug === category.id;

        return (
          <Link
            key={category.id}
            href={`/category/${category.id}`}
            onClick={() => {
              mixpanel.track("click@button", {
                page_name: pageName,
                object_section: "no_results",
                object_id: category.id,
                object_name: category.label,
              });
            }}
            className={cn(
              "flex items-center gap-3 px-4 py-3.5 rounded-full transition-colors text-left",
              isSelected
                ? "bg-primary"
                : "bg-background border hover:bg-muted/50"
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5",
                isSelected ? "text-primary-foreground" : "text-muted-foreground"
              )}
            />
            <span
              className={cn(
                "text-sm font-medium",
                isSelected ? "text-primary-foreground" : "text-foreground"
              )}
            >
              {category.label}
            </span>
          </Link>
        );
      })}
    </>
  );
}
