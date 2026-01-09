import { ContentCardData } from "@/types/content";
import { ContentCard } from "@/app/(main)/ContentCard";
import { ContentCardSkeleton } from "@/app/(main)/ContentCardSkeleton";
import { PAGE_SIZE } from "./page";

interface ContentGridProps {
  contents: ContentCardData[];
  emptyMessage?: string;
}

const contentGrid =
  "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3";

export function ContentGrid({
  contents,
  emptyMessage = "콘텐츠가 없습니다.",
}: ContentGridProps) {
  if (contents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="text-center space-y-3">
          <p className="text-lg text-muted-foreground">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={contentGrid}>
      {contents.map((content, index) => (
        <ContentCard key={content.id} content={content} priority={index < 4} />
      ))}
    </div>
  );
}

export function ContentGridSkeleton() {
  return (
    <div className={contentGrid}>
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <ContentCardSkeleton key={`loading-skeleton-${i}`} />
      ))}
    </div>
  );
}
