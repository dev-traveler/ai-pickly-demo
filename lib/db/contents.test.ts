import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Difficulty } from "@prisma/client";

// Mock prisma before importing the module
vi.mock("@/lib/prisma", () => ({
  prisma: {
    content: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

// Mock parseSearchQuery
vi.mock("@/lib/utils/search-utils", () => ({
  parseSearchQuery: vi.fn((q: string) => {
    if (!q || q.trim().length === 0) return [];
    return q.trim().split(/\s+/).filter((w) => w.length >= 2);
  }),
}));

import { getContents, GetContentsOptions } from "./contents";
import { prisma } from "@/lib/prisma";

// Mock 콘텐츠 데이터 헬퍼
function createMockContent(overrides: Partial<{
  id: string;
  title: string;
  description: string;
  author: string;
  publishedAt: Date;
  thumbnailUrl: string | null;
  sourceUrl: string;
  difficulty: Difficulty;
  viewCount: number;
  estimatedTime: { displayMinutes: number | null } | null;
  categories: { category: { id: string; name: string; slug: string } }[];
  tags: { tag: { id: string; name: string; slug: string } }[];
  aiTools: { aiTool: { id: string; name: string; slug: string; logoUrl: string | null } }[];
}> = {}) {
  return {
    id: overrides.id ?? "content-1",
    title: overrides.title ?? "테스트 콘텐츠",
    description: overrides.description ?? "테스트 설명",
    author: overrides.author ?? "테스트 작성자",
    publishedAt: overrides.publishedAt ?? new Date("2024-01-15"),
    thumbnailUrl: overrides.thumbnailUrl ?? "https://example.com/thumb.jpg",
    sourceUrl: overrides.sourceUrl ?? "https://example.com/content",
    difficulty: overrides.difficulty ?? Difficulty.BEGINNER,
    viewCount: overrides.viewCount ?? 100,
    estimatedTime: overrides.estimatedTime ?? { displayMinutes: 10 },
    categories: overrides.categories ?? [
      { category: { id: "cat-1", name: "AI", slug: "ai" } },
    ],
    tags: overrides.tags ?? [
      { tag: { id: "tag-1", name: "ChatGPT", slug: "chatgpt" } },
    ],
    aiTools: overrides.aiTools ?? [
      { aiTool: { id: "tool-1", name: "ChatGPT", slug: "chatgpt", logoUrl: null } },
    ],
  };
}

describe("getContents", () => {
  const mockFindMany = vi.mocked(prisma.content.findMany);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("기본 동작", () => {
    it("콘텐츠 목록을 반환", async () => {
      const mockContents = [
        createMockContent({ id: "1", title: "콘텐츠 1" }),
        createMockContent({ id: "2", title: "콘텐츠 2" }),
      ];
      mockFindMany.mockResolvedValue(mockContents);

      const result = await getContents({ pageSize: 10 });

      expect(result.data).toHaveLength(2);
      expect(result.data[0].title).toBe("콘텐츠 1");
      expect(result.data[1].title).toBe("콘텐츠 2");
      expect(result.hasMore).toBe(false);
      expect(result.nextCursor).toBeNull();
    });

    it("빈 결과 반환", async () => {
      mockFindMany.mockResolvedValue([]);

      const result = await getContents({ pageSize: 10 });

      expect(result.data).toHaveLength(0);
      expect(result.hasMore).toBe(false);
      expect(result.nextCursor).toBeNull();
    });

    it("ContentCardData 형식으로 데이터 변환", async () => {
      const mockContent = createMockContent({
        id: "test-id",
        title: "테스트 제목",
        description: "테스트 설명",
        author: "작성자",
        publishedAt: new Date("2024-01-01"),
        thumbnailUrl: "https://example.com/thumb.jpg",
        sourceUrl: "https://example.com",
        difficulty: Difficulty.INTERMEDIATE,
        estimatedTime: { displayMinutes: 15 },
        categories: [{ category: { id: "cat-1", name: "AI", slug: "ai" } }],
        tags: [{ tag: { id: "tag-1", name: "태그", slug: "tag" } }],
        aiTools: [{ aiTool: { id: "tool-1", name: "도구", slug: "tool", logoUrl: "logo.png" } }],
      });
      mockFindMany.mockResolvedValue([mockContent]);

      const result = await getContents({ pageSize: 10 });

      expect(result.data[0]).toEqual({
        id: "test-id",
        title: "테스트 제목",
        description: "테스트 설명",
        author: "작성자",
        publishedAt: new Date("2024-01-01"),
        thumbnailUrl: "https://example.com/thumb.jpg",
        sourceUrl: "https://example.com",
        difficulty: Difficulty.INTERMEDIATE,
        estimatedTime: { displayMinutes: 15 },
        categories: [{ id: "cat-1", name: "AI", slug: "ai" }],
        tags: [{ id: "tag-1", name: "태그", slug: "tag" }],
        aiTools: [{ id: "tool-1", name: "도구", slug: "tool", logoUrl: "logo.png" }],
      });
    });
  });

  describe("페이지네이션", () => {
    it("hasMore가 true일 때 nextCursor 반환", async () => {
      // pageSize + 1개 반환하면 hasMore = true
      const mockContents = [
        createMockContent({ id: "1" }),
        createMockContent({ id: "2" }),
        createMockContent({ id: "3" }), // extra item for hasMore check
      ];
      mockFindMany.mockResolvedValue(mockContents);

      const result = await getContents({ pageSize: 2 });

      expect(result.data).toHaveLength(2);
      expect(result.hasMore).toBe(true);
      expect(result.nextCursor).toBe("2");
    });

    it("hasMore가 false일 때 nextCursor는 null", async () => {
      const mockContents = [
        createMockContent({ id: "1" }),
        createMockContent({ id: "2" }),
      ];
      mockFindMany.mockResolvedValue(mockContents);

      const result = await getContents({ pageSize: 3 });

      expect(result.data).toHaveLength(2);
      expect(result.hasMore).toBe(false);
      expect(result.nextCursor).toBeNull();
    });

    it("cursor가 있으면 skip: 1과 함께 전달", async () => {
      mockFindMany.mockResolvedValue([]);

      await getContents({ pageSize: 10, cursor: "cursor-id" });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          cursor: { id: "cursor-id" },
          skip: 1,
        })
      );
    });

    it("cursor가 없으면 cursor/skip 옵션 미포함", async () => {
      mockFindMany.mockResolvedValue([]);

      await getContents({ pageSize: 10 });

      const callArgs = mockFindMany.mock.calls[0][0];
      expect(callArgs).not.toHaveProperty("cursor");
      expect(callArgs).not.toHaveProperty("skip");
    });

    it("take는 pageSize + 1", async () => {
      mockFindMany.mockResolvedValue([]);

      await getContents({ pageSize: 5 });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 6, // pageSize + 1
        })
      );
    });
  });

  describe("정렬", () => {
    it("기본 정렬은 최신순 (publishedAt desc)", async () => {
      mockFindMany.mockResolvedValue([]);

      await getContents({ pageSize: 10 });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ publishedAt: "desc" }],
        })
      );
    });

    it("sort=latest일 때 publishedAt desc 정렬", async () => {
      mockFindMany.mockResolvedValue([]);

      await getContents({ pageSize: 10, sort: "latest" });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ publishedAt: "desc" }],
        })
      );
    });

    it("sort=popular일 때 viewCount desc, publishedAt desc 정렬", async () => {
      mockFindMany.mockResolvedValue([]);

      await getContents({ pageSize: 10, sort: "popular" });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ viewCount: "desc" }, { publishedAt: "desc" }],
        })
      );
    });
  });

  describe("카테고리 필터", () => {
    it("category가 있으면 where 조건에 추가", async () => {
      mockFindMany.mockResolvedValue([]);

      await getContents({ pageSize: 10, category: "ai" });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            categories: {
              some: {
                categoryId: { in: ["ai"] },
              },
            },
          }),
        })
      );
    });

    it("category가 없으면 categories 필터 미포함", async () => {
      mockFindMany.mockResolvedValue([]);

      await getContents({ pageSize: 10 });

      const callArgs = mockFindMany.mock.calls[0][0];
      expect(callArgs?.where).not.toHaveProperty("categories");
    });
  });

  describe("난이도 필터", () => {
    it("difficulty가 있으면 where 조건에 추가", async () => {
      mockFindMany.mockResolvedValue([]);

      await getContents({ pageSize: 10, difficulty: Difficulty.BEGINNER });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            difficulty: Difficulty.BEGINNER,
          }),
        })
      );
    });

    it("difficulty가 없으면 difficulty 필터 미포함", async () => {
      mockFindMany.mockResolvedValue([]);

      await getContents({ pageSize: 10 });

      const callArgs = mockFindMany.mock.calls[0][0];
      expect(callArgs?.where).not.toHaveProperty("difficulty");
    });
  });

  describe("소요시간 필터", () => {
    it("time='5'일 때 maxMinutes: 4 필터 적용", async () => {
      mockFindMany.mockResolvedValue([]);

      await getContents({ pageSize: 10, time: "5" });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            estimatedTime: {
              displayMinutes: { lte: 4 },
            },
          }),
        })
      );
    });

    it("time='10'일 때 minMinutes: 5, maxMinutes: 10 필터 적용", async () => {
      mockFindMany.mockResolvedValue([]);

      await getContents({ pageSize: 10, time: "10" });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            estimatedTime: {
              displayMinutes: { gte: 5, lte: 10 },
            },
          }),
        })
      );
    });

    it("time='30'일 때 minMinutes: 11, maxMinutes: 30 필터 적용", async () => {
      mockFindMany.mockResolvedValue([]);

      await getContents({ pageSize: 10, time: "30" });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            estimatedTime: {
              displayMinutes: { gte: 11, lte: 30 },
            },
          }),
        })
      );
    });

    it("time='30+'일 때 minMinutes: 31 필터 적용", async () => {
      mockFindMany.mockResolvedValue([]);

      await getContents({ pageSize: 10, time: "30+" });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            estimatedTime: {
              displayMinutes: { gte: 31 },
            },
          }),
        })
      );
    });

    it("time이 없으면 estimatedTime 필터 미포함", async () => {
      mockFindMany.mockResolvedValue([]);

      await getContents({ pageSize: 10 });

      const callArgs = mockFindMany.mock.calls[0][0];
      expect(callArgs?.where).not.toHaveProperty("estimatedTime");
    });
  });

  describe("AI Tools 필터", () => {
    it("tool이 있으면 where 조건에 추가", async () => {
      mockFindMany.mockResolvedValue([]);

      await getContents({ pageSize: 10, tool: "chatgpt" });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            aiTools: {
              some: {
                toolId: { in: ["chatgpt"] },
              },
            },
          }),
        })
      );
    });

    it("tool이 없으면 aiTools 필터 미포함", async () => {
      mockFindMany.mockResolvedValue([]);

      await getContents({ pageSize: 10 });

      const callArgs = mockFindMany.mock.calls[0][0];
      expect(callArgs?.where).not.toHaveProperty("aiTools");
    });
  });

  describe("검색 필터", () => {
    it("검색어가 있으면 AND 조건으로 각 단어 필터 적용", async () => {
      mockFindMany.mockResolvedValue([]);

      await getContents({ pageSize: 10, q: "AI 이미지" });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: [
              {
                OR: [
                  { title: { contains: "AI", mode: "insensitive" } },
                  { description: { contains: "AI", mode: "insensitive" } },
                  { author: { contains: "AI", mode: "insensitive" } },
                  { tags: { some: { tag: { name: { contains: "AI", mode: "insensitive" } } } } },
                ],
              },
              {
                OR: [
                  { title: { contains: "이미지", mode: "insensitive" } },
                  { description: { contains: "이미지", mode: "insensitive" } },
                  { author: { contains: "이미지", mode: "insensitive" } },
                  { tags: { some: { tag: { name: { contains: "이미지", mode: "insensitive" } } } } },
                ],
              },
            ],
          }),
        })
      );
    });

    it("빈 검색어는 AND 필터 미포함", async () => {
      mockFindMany.mockResolvedValue([]);

      await getContents({ pageSize: 10, q: "" });

      const callArgs = mockFindMany.mock.calls[0][0];
      expect(callArgs?.where).not.toHaveProperty("AND");
    });

    it("공백만 있는 검색어는 AND 필터 미포함", async () => {
      mockFindMany.mockResolvedValue([]);

      await getContents({ pageSize: 10, q: "   " });

      const callArgs = mockFindMany.mock.calls[0][0];
      expect(callArgs?.where).not.toHaveProperty("AND");
    });

    it("검색어가 null이면 AND 필터 미포함", async () => {
      mockFindMany.mockResolvedValue([]);

      await getContents({ pageSize: 10, q: null });

      const callArgs = mockFindMany.mock.calls[0][0];
      expect(callArgs?.where).not.toHaveProperty("AND");
    });
  });

  describe("복합 필터", () => {
    it("여러 필터 동시 적용", async () => {
      mockFindMany.mockResolvedValue([]);

      await getContents({
        pageSize: 10,
        category: "ai",
        difficulty: Difficulty.INTERMEDIATE,
        time: "10",
        tool: "chatgpt",
        q: "이미지 생성",
        sort: "popular",
      });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            categories: { some: { categoryId: { in: ["ai"] } } },
            difficulty: Difficulty.INTERMEDIATE,
            estimatedTime: { displayMinutes: { gte: 5, lte: 10 } },
            aiTools: { some: { toolId: { in: ["chatgpt"] } } },
            AND: expect.any(Array),
          }),
          orderBy: [{ viewCount: "desc" }, { publishedAt: "desc" }],
        })
      );
    });
  });

  describe("에러 처리", () => {
    it("DB 연결 풀 고갈 에러 (P2024) 처리", async () => {
      // Prisma 에러는 plain object 형태로 code와 message를 가짐
      const error = { code: "P2024", message: "Timed out fetching a new connection from the connection pool" };
      mockFindMany.mockRejectedValue(error);

      await expect(getContents({ pageSize: 10 })).rejects.toThrow(
        "Service temporarily unavailable. Please try again."
      );
    });

    it("max clients 에러 처리", async () => {
      // Error 인스턴스로 max clients 메시지 테스트
      const error = new Error("sorry, too many clients already - max clients exceeded");
      mockFindMany.mockRejectedValue(error);

      await expect(getContents({ pageSize: 10 })).rejects.toThrow(
        "Service temporarily unavailable. Please try again."
      );
    });

    it("Connection 에러 처리", async () => {
      const error = new Error("Connection refused");
      mockFindMany.mockRejectedValue(error);

      await expect(getContents({ pageSize: 10 })).rejects.toThrow(
        "Service temporarily unavailable. Please try again."
      );
    });

    it("기타 에러는 그대로 throw", async () => {
      const error = new Error("Unknown error");
      mockFindMany.mockRejectedValue(error);

      await expect(getContents({ pageSize: 10 })).rejects.toThrow("Unknown error");
    });
  });

  describe("include 옵션", () => {
    it("관계 테이블 데이터 포함 조회", async () => {
      mockFindMany.mockResolvedValue([]);

      await getContents({ pageSize: 10 });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: {
            estimatedTime: { select: { displayMinutes: true } },
            categories: {
              include: {
                category: { select: { id: true, name: true, slug: true } },
              },
            },
            tags: {
              include: {
                tag: { select: { id: true, name: true, slug: true } },
              },
            },
            aiTools: {
              include: {
                aiTool: { select: { id: true, name: true, slug: true, logoUrl: true } },
              },
            },
          },
        })
      );
    });
  });
});
