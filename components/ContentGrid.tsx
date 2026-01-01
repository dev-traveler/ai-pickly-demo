import { ContentCardData } from "@/types/content";
import { ContentCard } from "@/components/ContentCard";

interface ContentGridProps {
  contents: ContentCardData[];
  emptyMessage?: string;
}

export function ContentGrid({
  contents,
  emptyMessage = "콘텐츠가 없습니다."
}: ContentGridProps) {
  if (contents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="text-center space-y-3">
          <p className="text-lg text-muted-foreground">
            {emptyMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contents.map((content) => (
        <ContentCard key={content.id} content={content} />
      ))}
    </div>
  );
}
