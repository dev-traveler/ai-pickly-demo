"use server";

import { Difficulty, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ContentCardData } from "@/types/content";
import { TimeRange } from "@/types/filter";
import { mapTimeRangeToMinutes } from "@/lib/utils/filter-mapper";
import { getErrorInfo } from "@/lib/utils/error-utils";

const COUNT_CACHE_TTL_MS = 1000 * 30;
const MAX_COUNT_CACHE_ENTRIES = 200;
const MAX_CONTENTS_COUNT = 100;
const contentsCountCache = new Map<
  string,
  { value: number; expiresAt: number }
>();

export interface GetContentsOptions {
  page?: number;
  pageSize: number;
  category?: string | null;
  difficulty?: Difficulty | null;
  time?: TimeRange | null;
  tool?: string | null;
  q?: string | null;
}

/**
 * 콘텐츠 목록을 가져옵니다.
 * 기본적으로 인기순(scrapCount, viewCount)과 최신순(publishedAt)으로 정렬됩니다.
 */
export async function getContents(
  options: GetContentsOptions
): Promise<ContentCardData[]> {
  const { page = 1, pageSize, category, difficulty, time, tool, q } = options;

  const { minMinutes, maxMinutes } = mapTimeRangeToMinutes(time);

  const skip = (page - 1) * pageSize;

  const where: Prisma.ContentWhereInput = {};

  // 카테고리 필터
  if (category) {
    where.categories = {
      some: {
        categoryId: {
          in: [category],
        },
      },
    };
  }

  // 난이도 필터
  if (difficulty) {
    where.difficulty = difficulty;
  }

  // 소요시간 필터 (범위 기반)
  if (minMinutes !== undefined || maxMinutes !== undefined) {
    where.estimatedTime = {
      displayMinutes: {
        ...(minMinutes !== undefined && { gte: minMinutes }),
        ...(maxMinutes !== undefined && { lte: maxMinutes }),
      },
    };
  }

  // AI Tools 필터
  if (tool) {
    where.aiTools = {
      some: {
        toolId: {
          in: [tool],
        },
      },
    };
  }

  // 검색 필터 (OR 로직 across multiple fields)
  if (q && q.trim().length > 0) {
    const trimmedQuery = q.trim();

    where.OR = [
      // Search in title (has GIN index)
      { title: { contains: trimmedQuery, mode: "insensitive" } },
      // Search in description (has GIN index)
      { description: { contains: trimmedQuery, mode: "insensitive" } },
      // Search in author (has GIN index)
      { author: { contains: trimmedQuery, mode: "insensitive" } },
      // Search in tag names (has GIN index, requires junction table)
      {
        tags: {
          some: {
            tag: {
              name: { contains: trimmedQuery, mode: "insensitive" },
            },
          },
        },
      },
    ];
  }

  try {
    const contents = await prisma.content.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: [{ createdAt: "desc" }, { publishedAt: "desc" }],
      include: {
        estimatedTime: {
          select: {
            displayMinutes: true,
          },
        },
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        aiTools: {
          include: {
            aiTool: {
              select: {
                id: true,
                name: true,
                slug: true,
                logoUrl: true,
              },
            },
          },
        },
      },
    });

    // Prisma 결과를 ContentCardData 타입으로 변환
    return contents.map((content) => ({
      id: content.id,
      title: content.title,
      description: content.description,
      author: content.author,
      publishedAt: content.publishedAt,
      thumbnailUrl: content.thumbnailUrl,
      sourceUrl: content.sourceUrl,
      difficulty: content.difficulty,
      estimatedTime: content.estimatedTime,
      categories: content.categories.map((cc) => ({
        ...cc.category,
      })),
      tags: content.tags.map((ct) => ({
        ...ct.tag,
      })),
      aiTools: content.aiTools.map((cat) => ({
        ...cat.aiTool,
      })),
    }));
  } catch (error: unknown) {
    // Handle connection pool exhaustion
    const { code, message } = getErrorInfo(error);
    if (
      code === "P2024" ||
      message?.includes("max clients") ||
      message?.includes("Connection")
    ) {
      console.error("Database connection pool exhausted:", {
        message,
        code,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Service temporarily unavailable. Please try again.");
    }
    // Re-throw other errors
    throw error;
  }
}

/**
 * 콘텐츠 총 개수를 가져옵니다.
 */
export async function getContentsCount(
  options: Omit<GetContentsOptions, "page" | "pageSize"> = {}
): Promise<number> {
  const { category, difficulty, time, tool, q } = options;
  const { minMinutes, maxMinutes } = mapTimeRangeToMinutes(time);

  const normalizedKey = JSON.stringify({
    category: category ?? "",
    difficulty: difficulty ?? null,
    minMinutes: minMinutes ?? null,
    maxMinutes: maxMinutes ?? null,
    aiToolIds: tool ?? "",
    q: q?.trim().toLowerCase() ?? "",
  });

  const now = Date.now();
  const cached = contentsCountCache.get(normalizedKey);
  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  const where: Prisma.ContentWhereInput = {};

  // 카테고리 필터
  if (category) {
    where.categories = {
      some: {
        categoryId: {
          in: [category],
        },
      },
    };
  }

  if (difficulty) {
    where.difficulty = difficulty;
  }

  // 소요시간 필터 (범위 기반)
  if (minMinutes !== undefined || maxMinutes !== undefined) {
    where.estimatedTime = {
      displayMinutes: {
        ...(minMinutes !== undefined && { gte: minMinutes }),
        ...(maxMinutes !== undefined && { lte: maxMinutes }),
      },
    };
  }

  // AI Tools 필터 (다중 선택, OR 로직)
  if (tool) {
    where.aiTools = {
      some: {
        toolId: {
          in: [tool],
        },
      },
    };
  }

  // 검색 필터 (OR 로직 across multiple fields)
  if (q && q.trim().length > 0) {
    const trimmedQuery = q.trim();

    where.OR = [
      // Search in title (has GIN index)
      { title: { contains: trimmedQuery, mode: "insensitive" } },
      // Search in description (has GIN index)
      { description: { contains: trimmedQuery, mode: "insensitive" } },
      // Search in author (has GIN index)
      { author: { contains: trimmedQuery, mode: "insensitive" } },
      // Search in tag names (has GIN index, requires junction table)
      {
        tags: {
          some: {
            tag: {
              name: { contains: trimmedQuery, mode: "insensitive" },
            },
          },
        },
      },
    ];
  }

  try {
    const count = await prisma.content.count({
      where,
      take: MAX_CONTENTS_COUNT,
    });
    const cappedCount = Math.min(count, MAX_CONTENTS_COUNT);

    contentsCountCache.set(normalizedKey, {
      value: cappedCount,
      expiresAt: now + COUNT_CACHE_TTL_MS,
    });
    if (contentsCountCache.size > MAX_COUNT_CACHE_ENTRIES) {
      const oldestKey = contentsCountCache.keys().next().value as
        | string
        | undefined;
      if (oldestKey) {
        contentsCountCache.delete(oldestKey);
      }
    }

    return cappedCount;
  } catch (error) {
    // Handle connection pool exhaustion
    const { code, message } = getErrorInfo(error);
    if (
      code === "P2024" ||
      message?.includes("max clients") ||
      message?.includes("Connection")
    ) {
      console.error("Database connection pool exhausted:", {
        message,
        code,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Service temporarily unavailable. Please try again.");
    }
    // Re-throw other errors
    throw error;
  }
}
