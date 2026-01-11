"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, TrendingUp, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ContentCardData } from "@/types/content";
import { getOptimizedImageProps } from "@/lib/image-utils";
import { Difficulty } from "@prisma/client";

interface ContentCardProps {
  content: ContentCardData;
  priority?: boolean;
}

const difficultyMap: Record<Difficulty, string> = {
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

const getDefaultThumbnail = (categories: ContentCardData["categories"]) => {
  // 첫 번째 카테고리의 slug를 기준으로 기본 이미지 결정
  const primaryCategory = categories[0]?.category.slug;

  switch (primaryCategory) {
    case "code":
    case "image":
    case "text":
    case "video":
      return `/images/default-thumbnail-${primaryCategory}-category.png`;
    default:
      return "/images/default-thumbnail-code-category.png";
  }
};

const getAIToolLogo = (toolName: string) => {
  return `/images/logo-${toolName}.png`;
};

export function ContentCard({ content, priority = false }: ContentCardProps) {
  const [imageError, setImageError] = useState(false);
  const estimatedMinutes = content.estimatedTime?.displayMinutes;
  const sourceName = getSourceName(content.sourceUrl);
  const defaultThumbnail = getDefaultThumbnail(content.categories);

  return (
    <Link href={`/content/${content.id}`} className="block group">
      <Card className="p-0 gap-4 border-none shadow-none overflow-hidden transition-all">
        {/* Thumbnail */}
        <div className="relative aspect-video transition-transform duration-300 group-hover:-translate-y-2 mt-2">
          {content.thumbnailUrl && !imageError ? (
            <Image
              src={content.thumbnailUrl}
              alt={content.title}
              fill
              className="object-cover rounded-2xl "
              {...getOptimizedImageProps({ priority })}
              onError={() => setImageError(true)}
            />
          ) : (
            <Image
              src={defaultThumbnail}
              alt={content.title}
              fill
              className="object-cover rounded-2xl"
              {...getOptimizedImageProps({ priority })}
            />
          )}

          {/* Avatar positioned at bottom right of thumbnail */}
          {content.aiTools.map((data) => (
            <div key={data.aiTool.id} className="absolute -bottom-7 right-7">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-background">
                <div className="w-12 h-12 rounded-full bg-background shadow-lg">
                  <Image
                    className="object-cover rounded-full"
                    src={getAIToolLogo(data.aiTool.id)}
                    alt={data.aiTool.name}
                    width={48}
                    height={48}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <CardContent className="px-4 space-y-3">
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
              <Badge key={category.id} variant="secondary" className="text-xs">
                {category.name}
              </Badge>
            ))}

            {/* Regular Tags */}
            {content.tags.map(({ tag }) => (
              <Badge key={tag.id} variant="outline" className="text-xs">
                # {tag.name}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
