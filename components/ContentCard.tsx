import { ContentCardData } from "@/types/content";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Link2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ContentCardProps {
  content: ContentCardData;
}

const difficultyMap = {
  BEGINNER: "초급",
  INTERMEDIATE: "중급",
  ADVANCED: "고급",
} as const;

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

const getSourceName = (url: string) => {
  try {
    const hostname = new URL(url).hostname;
    // cspell:disable-next-line
    if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
      return "Youtube";
    }
    if (hostname.includes("medium.com")) {
      return "Medium";
    }
    if (hostname.includes("notion.so")) {
      return "Notion";
    }
    return hostname.replace("www.", "");
  } catch {
    return "Link";
  }
};

export function ContentCard({ content }: ContentCardProps) {
  const estimatedMinutes = content.estimatedTime?.displayMinutes;
  const sourceName = getSourceName(content.sourceUrl);

  return (
    <Link href={`/content/${content.id}`} className="block group">
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-muted">
          {content.thumbnailUrl ? (
            <Image
              src={content.thumbnailUrl}
              alt={content.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-muted" />
          )}

          {/* Avatar positioned at bottom right of thumbnail */}
          <div className="absolute bottom-3 right-3">
            <div className="w-12 h-12 rounded-full bg-background border-2 border-background overflow-hidden">
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm font-medium">
                {content.author.charAt(0)}
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Author and Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{content.author}</span>
            <span>|</span>
            <time dateTime={content.publishedAt.toISOString()}>
              {formatDate(content.publishedAt)}
            </time>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:underline">
            {content.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {content.description}
          </p>

          {/* Meta Information */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {estimatedMinutes && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{estimatedMinutes} min</span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>{difficultyMap[content.difficulty]}</span>
            </div>

            <div className="flex items-center gap-1">
              <Link2 className="w-4 h-4" />
              <span>{sourceName}</span>
            </div>
          </div>
        </CardContent>

        {/* Tags */}
        <CardFooter className="p-4 pt-0">
          <div className="flex flex-wrap gap-2">
            {/* Category Tags */}
            {content.categories.map(({ category }) => (
              <Badge
                key={category.id}
                variant="secondary"
                className="text-xs"
              >
                {category.name}
              </Badge>
            ))}

            {/* Regular Tags */}
            {content.tags.map(({ tag }) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="text-xs"
              >
                # {tag.name}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
