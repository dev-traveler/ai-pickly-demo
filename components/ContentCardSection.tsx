import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ContentCard } from "@/components/ContentCard";
import { ContentCardData } from "@/types/content";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ContentCardSkeleton } from "@/components/ContentCardSkeleton";

interface ContentCardSectionProps {
  title: string;
  href?: string;
  contents: ContentCardData[];
  maxItems?: number;
  className?: string;
}

export function ContentCardSection({
  title,
  href,
  contents,
  maxItems = 4,
  className,
}: ContentCardSectionProps) {
  const visibleContents =
    maxItems > 0 ? contents.slice(0, maxItems) : contents;

  return (
    <section className={cn("space-y-4", className)}>
      {href ? (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-lg font-semibold tracking-tight group"
        >
          <span>{title}</span>
          <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : (
        <div className="text-lg font-semibold tracking-tight">{title}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {visibleContents.map((content, index) => (
          <ContentCard
            key={content.id}
            content={content}
            priority={index < 3}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

interface ContentCardSectionSkeletonProps {
  title?: string;
  itemCount?: number;
  className?: string;
}

export function ContentCardSectionSkeleton({
  title,
  itemCount = 4,
  className,
}: ContentCardSectionSkeletonProps) {
  return (
    <section className={cn("space-y-4", className)}>
      {title ? (
        <div className="text-lg font-semibold tracking-tight">{title}</div>
      ) : (
        <Skeleton className="h-7 w-32" />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {Array.from({ length: itemCount }).map((_, index) => (
          <ContentCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
