"use client";

import { useEffect, useRef } from "react";
import { ContentGrid, ContentGridSkeleton } from "@/app/(main)/search/_components/ContentGrid";
import { useInfiniteContents } from "@/hooks/useContentsQuery";

interface InfiniteContentGridProps {
  defaultCategory?: string;
  emptyMessage?: string;
}

export function InfiniteContentGrid({
  defaultCategory,
  emptyMessage = "콘텐츠가 없습니다.",
}: InfiniteContentGridProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteContents({ defaultCategory });

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
        <ContentGridSkeleton />
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

  // 응답 구조 변경에 따른 flatMap 수정: page.data 사용
  const allContents = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="space-y-8">
      <ContentGrid contents={allContents} emptyMessage={emptyMessage} />

      {/* 무한 스크롤 트리거 */}
      <div ref={loadMoreRef} className="py-8 text-center">
        {isFetchingNextPage && <ContentGridSkeleton />}
      </div>
    </div>
  );
}
