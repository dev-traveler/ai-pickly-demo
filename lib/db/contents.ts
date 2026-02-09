"use server";

import { Difficulty, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ContentCardData } from "@/types/content";
import { TimeRange } from "@/types/filter";
import { mapTimeRangeToMinutes } from "@/lib/utils/filter-mapper";
import { getErrorInfo } from "@/lib/utils/error-utils";
import { parseSearchQuery } from "@/lib/utils/search-utils";

const COUNT_CACHE_TTL_MS = 1000 * 30;
const MAX_COUNT_CACHE_ENTRIES = 200;
const MAX_CONTENTS_COUNT = 100;
const contentsCountCache = new Map<
  string,
  { value: number; expiresAt: number }
>();

export interface GetContentsOptions {
  cursor?: string | null;
  pageSize: number;
  category?: string | null;
  difficulty?: Difficulty | null;
  time?: TimeRange | null;
  tool?: string | null;
  q?: string | null;
  sort?: "latest" | "popular";
}

export interface GetContentsResult {
  data: ContentCardData[];
  nextCursor: string | null;
  hasMore: boolean;
}

/**
 * 콘텐츠 목록을 가져옵니다.
 * Cursor 기반 페이지네이션을 사용합니다.
 * 기본적으로 최신순(publishedAt)으로 정렬되며, 옵션으로 인기순을 선택할 수 있습니다.
 */
export async function getContents(
  options: GetContentsOptions
): Promise<GetContentsResult> {
  const { cursor, pageSize, category, difficulty, time, tool, q, sort} =
    options;

  const { minMinutes, maxMinutes } = mapTimeRangeToMinutes(time);

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

  // 검색 필터 (단어별 AND 검색)
  // 각 단어가 title, description, author, tags 중 하나에서 매칭되어야 함 (OR)
  // 모든 단어가 매칭되어야 함 (AND)
  if (q && q.trim().length > 0) {
    const words = parseSearchQuery(q);

    if (words.length > 0) {
      where.AND = words.map((word) => ({
        OR: [
          { title: { contains: word, mode: "insensitive" } },
          { description: { contains: word, mode: "insensitive" } },
          { author: { contains: word, mode: "insensitive" } },
          {
            tags: {
              some: {
                tag: {
                  name: { contains: word, mode: "insensitive" },
                },
              },
            },
          },
        ],
      }));
    }
  }

  const orderBy: Prisma.ContentOrderByWithRelationInput[] =
    sort === "popular"
      ? [{ viewCount: "desc" }, { publishedAt: "desc" }]
      : [{ publishedAt: "desc" }];

  try {
    const contents = await prisma.content.findMany({
      where,
      take: pageSize + 1, // hasMore 판단용 +1
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1, // cursor 아이템 자체는 건너뜀
      }),
      orderBy,
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

    const hasMore = contents.length > pageSize;
    const actualContents = hasMore ? contents.slice(0, pageSize) : contents;

    // Prisma 결과를 ContentCardData 타입으로 변환
    const data = actualContents.map((content) => ({
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

    const nextCursor =
      hasMore && data.length > 0 ? data[data.length - 1].id : null;

    return { data, nextCursor, hasMore };
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
  options: Omit<GetContentsOptions, "cursor" | "pageSize"> = {}
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

  // 검색 필터 (단어별 AND 검색)
  // 각 단어가 title, description, author, tags 중 하나에서 매칭되어야 함 (OR)
  // 모든 단어가 매칭되어야 함 (AND)
  if (q && q.trim().length > 0) {
    const words = parseSearchQuery(q);

    if (words.length > 0) {
      where.AND = words.map((word) => ({
        OR: [
          { title: { contains: word, mode: "insensitive" } },
          { description: { contains: word, mode: "insensitive" } },
          { author: { contains: word, mode: "insensitive" } },
          {
            tags: {
              some: {
                tag: {
                  name: { contains: word, mode: "insensitive" },
                },
              },
            },
          },
        ],
      }));
    }
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
