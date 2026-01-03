"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { ContentGrid } from "@/components/ContentGrid";
import { ContentCardSkeleton } from "@/components/ContentCardSkeleton";
import { getContents, GetContentsOptions } from "@/lib/db/contents";

type Content = Awaited<ReturnType<typeof getContents>>[number];

interface InfiniteContentGridProps {
  filters?: Omit<GetContentsOptions, "page" | "pageSize">;
  pageSize?: number;
  emptyMessage?: string;
  initialData?: Content[];
}

export function InfiniteContentGrid({
  filters = {},
  pageSize = 20,
  emptyMessage = "콘텐츠가 없습니다.",
  initialData,
}: InfiniteContentGridProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 필터가 활성화되어 있는지 확인
  const hasFilters =
    filters &&
    Object.keys(filters).length > 0 &&
    Object.values(filters).some((value) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null;
    });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["contents", filters, pageSize],
    queryFn: ({ pageParam = 1 }) =>
      getContents({
        ...filters,
        page: pageParam,
        pageSize,
      }),
    getNextPageParam: (lastPage, allPages) => {
      // 마지막 페이지가 pageSize보다 작으면 더 이상 페이지가 없음
      if (lastPage.length < pageSize) {
        return undefined;
      }
      return allPages.length + 1;
    },
    initialPageParam: 1,
    // 필터가 없을 때만 initialData 사용 (필터 적용 시 서버에서 새로 가져옴)
    initialData:
      initialData && !hasFilters
        ? {
            pages: [initialData],
            pageParams: [1],
          }
        : undefined,
    // 필터가 없고 initialData가 있을 때만 캐시 유지
    staleTime: initialData && !hasFilters ? 1000 * 60 * 5 : 0, // 5분
  });

  // Intersection Observer로 무한 스크롤 구현
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
        // 뷰포트 하단에서 500px 전에 미리 로드 시작
        rootMargin: "0px 0px 500px 0px",
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="space-y-8" role="status" aria-label="콘텐츠 로딩 중">
        <span className="sr-only">콘텐츠를 불러오는 중입니다...</span>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ContentCardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      </div>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="text-center space-y-3">
          <p className="text-lg text-destructive">
            콘텐츠를 불러오는데 실패했습니다.
          </p>
        </div>
      </div>
    );
  }

  // 전체 콘텐츠 배열 생성
  const allContents = data?.pages.flatMap((page) => page) || [];

  return (
    <div className="space-y-8">
      <ContentGrid
        contents={allContents}
        emptyMessage={emptyMessage}
      />

      {/* 무한 스크롤 트리거 */}
      <div ref={loadMoreRef} className="py-8 text-center">
        {isFetchingNextPage ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <ContentCardSkeleton key={`pagination-skeleton-${i}`} />
            ))}
          </div>
        ) : hasNextPage ? (
          <p className="text-muted-foreground text-sm">
            스크롤하여 더 보기
          </p>
        ) : allContents.length > 0 ? (
          <p className="text-muted-foreground text-sm">
            모든 콘텐츠를 확인했습니다
          </p>
        ) : null}
      </div>
    </div>
  );
}
