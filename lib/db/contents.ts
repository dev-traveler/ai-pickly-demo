"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ContentCardData } from "@/types/content";

export interface GetContentsOptions {
  page?: number;
  pageSize?: number;
  categoryIds?: string[];
  difficulty?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  maxMinutes?: number;
  aiToolIds?: string[];
}

/**
 * 콘텐츠 목록을 가져옵니다.
 * 기본적으로 인기순(scrapCount, viewCount)과 최신순(publishedAt)으로 정렬됩니다.
 */
export async function getContents(
  options: GetContentsOptions = {}
): Promise<ContentCardData[]> {
  const {
    page = 1,
    pageSize = 20,
    categoryIds,
    difficulty,
    maxMinutes,
    aiToolIds,
  } = options;

  const skip = (page - 1) * pageSize;

  const where: Prisma.ContentWhereInput = {};

  // 카테고리 필터 (다중 선택, OR 로직)
  if (categoryIds && categoryIds.length > 0) {
    where.categories = {
      some: {
        categoryId: {
          in: categoryIds,
        },
      },
    };
  }

  // 난이도 필터
  if (difficulty) {
    where.difficulty = difficulty;
  }

  // 소요시간 필터
  if (maxMinutes) {
    where.estimatedTime = {
      displayMinutes: {
        lte: maxMinutes,
      },
    };
  }

  // AI Tools 필터 (다중 선택, OR 로직)
  if (aiToolIds && aiToolIds.length > 0) {
    where.aiTools = {
      some: {
        toolId: {
          in: aiToolIds,
        },
      },
    };
  }

  const contents = await prisma.content.findMany({
    where,
    skip,
    take: pageSize,
    orderBy: [
      { scrapCount: "desc" },
      { viewCount: "desc" },
      { publishedAt: "desc" },
    ],
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
      category: cc.category,
    })),
    tags: content.tags.map((ct) => ({
      tag: ct.tag,
    })),
    aiTools: content.aiTools.map((cat) => ({
      aiTool: cat.aiTool,
    })),
  }));
}

/**
 * 콘텐츠 총 개수를 가져옵니다.
 */
export async function getContentsCount(
  options: Omit<GetContentsOptions, "page" | "pageSize"> = {}
): Promise<number> {
  const { categoryIds, difficulty, maxMinutes, aiToolIds } = options;

  const where: Prisma.ContentWhereInput = {};

  // 카테고리 필터 (다중 선택, OR 로직)
  if (categoryIds && categoryIds.length > 0) {
    where.categories = {
      some: {
        categoryId: {
          in: categoryIds,
        },
      },
    };
  }

  if (difficulty) {
    where.difficulty = difficulty;
  }

  if (maxMinutes) {
    where.estimatedTime = {
      displayMinutes: {
        lte: maxMinutes,
      },
    };
  }

  // AI Tools 필터 (다중 선택, OR 로직)
  if (aiToolIds && aiToolIds.length > 0) {
    where.aiTools = {
      some: {
        toolId: {
          in: aiToolIds,
        },
      },
    };
  }

  return prisma.content.count({ where });
}
