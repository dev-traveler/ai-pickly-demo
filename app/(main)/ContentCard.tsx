"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, TrendingUp, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ContentCardData } from "@/types/content";
import { getOptimizedImageProps } from "@/lib/image-utils";
import { Difficulty } from "@prisma/client";
import mixpanel from "mixpanel-browser";

interface ContentCardProps {
  content: ContentCardData;
  priority?: boolean;
  index: number;
}
const DEFAULT_AI_TOOL_LOGO = "/images/default-ai-tool-logo.png";
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

const getCategoryLabel = (categoryName: string) => {
  switch (categoryName) {
    case "text":
      return "텍스트 생성";
    case "image":
      return "이미지 생성";
    case "video":
      return "영상 생성";
    case "code":
      return "바이브 코딩";
    default:
      return categoryName;
  }
};

export function ContentCard({
  content,
  priority = false,
  index,
}: ContentCardProps) {
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const hasTrackedImpression = useRef(false);
  const estimatedMinutes = content.estimatedTime?.displayMinutes;
  const sourceName = getSourceName(content.sourceUrl);
  const defaultThumbnail = getDefaultThumbnail(content.categories);

  useEffect(() => {
    if (!cardRef.current || hasTrackedImpression.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !hasTrackedImpression.current) {
          mixpanel.track("impression@content_card", {
            page_name: "home",
            object_section: "body",
            object_id: content.id,
            object_name: content.title,
            object_position: String(index),
          });
          hasTrackedImpression.current = true;
          observer.disconnect();
        }
      },
      { threshold: 1 }
    );

    observer.observe(cardRef.current);

    return () => {
      observer.disconnect();
    };
  }, [content, content.id, content.title, index]);

  return (
    <Link
      href={content.sourceUrl}
      target="_blank"
      className="block group"
      onClick={() => {
        mixpanel.track("click@content_card", {
          page_name: "home",
          object_section: "body",
          object_id: content.id,
          object_name: content.title,
          object_position: String(index),
          categories: content.categories.join(","),
          ai_tools: content.aiTools.join(","),
          author: content.author,
          difficulty: content.difficulty,
          estimatedTime: content.estimatedTime,
          publishedAt: content.publishedAt,
          tags: content.tags.join(","),
          title: content.title,
        });
      }}
    >
      <div ref={cardRef}>
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

            {/* AI tool logos positioned at bottom right of thumbnail */}
            <div className="absolute bottom-0 translate-y-2/5 inset-x-0 aspect-64/9">
              <div className="h-full flex items-center justify-end pr-[calc(10%)] -space-x-[calc(8%)] group-hover:-space-x-2">
                {content.aiTools.map((data, toolIndex) => (
                  <div
                    key={data.aiTool.id}
                    className="h-full transition-[margin] duration-300"
                    style={{ zIndex: content.aiTools.length - toolIndex }}
                  >
                    <Tooltip
                      delayDuration={300}
                      onOpenChange={(open) => {
                        if (open) {
                          mixpanel.track("hover@tool_logo", {
                            page_name: "home",
                            object_section: "body",
                            object_id: data.aiTool.id,
                            object_name: data.aiTool.name,
                            object_position: String(index),
                          });
                        }
                      }}
                    >
                      <TooltipTrigger asChild>
                        <div className="p-1 flex items-center justify-center rounded-full bg-background w-full h-full aspect-square">
                          <div className="relative rounded-full shadow-lg aspect-square w-full">
                            <Image
                              className="object-cover rounded-full"
                              src={data.aiTool.logoUrl || DEFAULT_AI_TOOL_LOGO}
                              alt={data.aiTool.name}
                              fill
                              sizes="(max-width: 1024px) 12vw, 8vw"
                            />
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{data.aiTool.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ))}
              </div>
            </div>
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
                <Badge
                  key={category.id}
                  variant="secondary"
                  className="text-xs"
                >
                  {getCategoryLabel(category.name)}
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
      </div>
    </Link>
  );
}
