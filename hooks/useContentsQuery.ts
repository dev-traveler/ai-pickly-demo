"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getContents,
  getContentsCount,
  GetContentsResult,
} from "@/lib/db/contents";
import { getAITools } from "@/lib/db/ai-tools";
import { useContentsSearchParams } from "./useContentsSearchParams";
import { normalizeSearchParams } from "@/app/(main)/search/search-params";
import { PAGE_SIZE } from "@/lib/constants/content";

/**
 * 무한 스크롤 콘텐츠 쿼리 hook
 * URL search params를 자동으로 읽어 queryKey 구성
 * 정규화된 params로 캐시 키를 안정화
 */
export function useInfiniteContents() {
  const [searchParams] = useContentsSearchParams();
  // cursor는 페이지네이션에서 별도 관리, 필터 params만 추출
  const { cursor: _, ...filterParams } = searchParams;
  const normalizedParams = normalizeSearchParams(filterParams);

  return useInfiniteQuery<GetContentsResult>({
    // 정규화된 params로 캐시 키 생성 (cursor 제외)
    queryKey: ["contents", normalizedParams, PAGE_SIZE],
    queryFn: ({ pageParam }) =>
      getContents({
        cursor: pageParam as string | null,
        pageSize: PAGE_SIZE,
        ...filterParams,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: null,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 콘텐츠 총 개수 쿼리 hook
 * 필터 변경 시 자동으로 새로운 count를 fetch
 * 정규화된 params로 캐시 키를 안정화
 */
export function useContentsCount() {
  const [searchParams] = useContentsSearchParams();
  // cursor는 count에 영향 없음, 필터 params만 추출
  const { cursor: _, ...filterParams } = searchParams;
  const normalizedParams = normalizeSearchParams(filterParams);

  return useQuery({
    queryKey: ["contents-count", normalizedParams],
    queryFn: () => getContentsCount({ ...filterParams }),
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
