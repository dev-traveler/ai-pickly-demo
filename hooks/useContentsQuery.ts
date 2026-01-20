"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getContents, getContentsCount } from "@/lib/db/contents";
import { getAITools } from "@/lib/db/ai-tools";
import { useContentsSearchParams } from "./useContentsSearchParams";
import { PAGE_SIZE } from "@/lib/constants/content";

/**
 * 무한 스크롤 콘텐츠 쿼리 hook
 * URL search params를 자동으로 읽어 queryKey 구성
 */
export function useInfiniteContents() {
  const [searchParams] = useContentsSearchParams();

  return useInfiniteQuery({
    queryKey: ["contents", { ...searchParams }, PAGE_SIZE],
    queryFn: ({ pageParam = 1 }) =>
      getContents({ page: pageParam, pageSize: PAGE_SIZE, ...searchParams }),
    getNextPageParam: (lastPage, allPages) => {
      // 마지막 페이지가 pageSize보다 작으면 더 이상 페이지 없음
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 콘텐츠 총 개수 쿼리 hook
 * 필터 변경 시 자동으로 새로운 count를 fetch
 */
export function useContentsCount() {
  const [searchParams] = useContentsSearchParams();

  return useQuery({
    queryKey: ["contents-count", { ...searchParams }],
    queryFn: () => getContentsCount({ ...searchParams }),
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * AI 툴 목록 쿼리 hook
 * 정적 데이터로 긴 staleTime 사용
 */
export function useAITools() {
  return useQuery({
    queryKey: ["ai-tools"],
    queryFn: () => getAITools(),
    staleTime: 1000 * 60 * 30, // 30분
  });
}
