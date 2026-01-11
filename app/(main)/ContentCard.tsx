"use client";

import { ContentCardData } from "@/types/content";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Clock, TrendingUp, Link2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Difficulty } from "@prisma/client";
import { trackImpression, trackHover, trackClick } from "@/lib/analytics/mixpanel";

interface ContentCardProps {
  content: ContentCardData;
  priority?: boolean;
  position?: number;
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

const DEFAULT_AI_TOOL_LOGO = "/images/default-ai-tool-logo.png";

export function ContentCard({ content, priority = false, position = 0 }: ContentCardProps) {
  const [imageError, setImageError] = useState(false);
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const estimatedMinutes = content.estimatedTime?.displayMinutes;
  const sourceName = getSourceName(content.sourceUrl);
  const defaultThumbnail = getDefaultThumbnail(content.categories);

  // Intersection Observer로 impression 추적
  useEffect(() => {
    if (!cardRef.current || hasTrackedImpression) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTrackedImpression) {
            trackImpression("content_card", {
              page_name: "home",
              object_section: "body",
              object_id: content.id,
              object_name: content.title,
              object_position: position,
            });
            setHasTrackedImpression(true);
          }
        });
      },
      {
        threshold: 0.5, // 50% 보일 때 추적
      }
    );

    observer.observe(cardRef.current);

    return () => {
      observer.disconnect();
    };
  }, [content.id, content.title, position, hasTrackedImpression]);

  const handleClick = () => {
    trackClick("content_card", {
      page_name: "home",
      object_section: "body",
      object_id: content.id,
      object_name: content.title,
      object_position: position,
    });
  };

  const handleToolLogoHover = (toolId: string, toolName: string, toolPosition: number) => {
    trackHover("tool_logo", {
      page_name: "home",
      object_section: "body",
      object_id: toolId,
      object_name: toolName,
      object_position: toolPosition,
    });
  };

  return (
    <TooltipProvider>
      <a
        ref={cardRef}
        href={content.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
        onClick={handleClick}
      >
        <Card className="p-0 gap-4 border-none shadow-none overflow-hidden transition-all">
          {/* Thumbnail */}
          <div className="relative aspect-video transition-transform duration-300 group-hover:-translate-y-2 mt-2">
            {content.thumbnailUrl && !imageError ? (
              <Image
                src={content.thumbnailUrl}
                alt={content.title}
                fill
                className="object-cover rounded-2xl"
                loading={priority ? "eager" : "lazy"}
                priority={priority}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={85}
                onError={() => {
                  console.error(`Failed to load thumbnail for ${content.id}:`, content.thumbnailUrl);
                  setImageError(true);
                }}
              />
            ) : (
              <Image
                src={defaultThumbnail}
                alt={content.title}
                fill
                className="object-cover rounded-2xl"
                priority={priority}
              />
            )}

            {/* AI Tool Logos positioned at bottom right of thumbnail */}
            <div className="absolute -bottom-7 right-4 flex gap-2">
              {content.aiTools.map((data, index) => (
                <Tooltip key={data.aiTool.id}>
                  <TooltipTrigger asChild>
                    <div
                      className="flex items-center justify-center w-14 h-14 rounded-full bg-background"
                      onMouseEnter={() =>
                        handleToolLogoHover(data.aiTool.id, data.aiTool.name, index)
                      }
                    >
                      <div className="w-12 h-12 rounded-full bg-background shadow-lg overflow-hidden">
                        <Image
                          className="object-cover rounded-full"
                          src={data.aiTool.logoUrl || DEFAULT_AI_TOOL_LOGO}
                          alt={data.aiTool.name}
                          width={48}
                          height={48}
                        />
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{data.aiTool.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
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
    </a>
    </TooltipProvider>
  );
}
