"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFilterStore } from "@/lib/stores/filter-store";
import {
  serializeFiltersToURL,
  parseFiltersFromURL,
} from "@/lib/utils/filter-mapper";

/**
 * Zustand filter store와 URL query params를 양방향 동기화하는 Hook
 *
 * 기능:
 * 1. 컴포넌트 마운트 시: URL → Zustand 동기화 (URL에서 필터 복원)
 * 2. 필터 변경 시: Zustand → URL 동기화 (히스토리 쌓지 않음)
 * 3. 브라우저 뒤로가기/앞으로가기 지원
 */
export function useFilterSync() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterStore = useFilterStore();
  const isInitialMount = useRef(true);

  // 마운트 시: URL → Zustand 동기화
  useEffect(() => {
    if (isInitialMount.current) {
      const urlFilters = parseFiltersFromURL(searchParams);

      // URL에 필터가 있으면 Zustand에 일괄 업데이트
      if (Object.keys(urlFilters).length > 0) {
        filterStore.setAllFilters(urlFilters);
      }

      isInitialMount.current = false;
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // Zustand 변경 시: URL 업데이트
  useEffect(() => {
    // 초기 마운트 시에는 URL 업데이트 건너뛰기 (위의 useEffect에서 URL을 읽는 중)
    if (isInitialMount.current) {
      return;
    }

    const params = serializeFiltersToURL({
      selectedCategories: filterStore.selectedCategories,
      selectedDifficulty: filterStore.selectedDifficulty,
      selectedTimeRange: filterStore.selectedTimeRange,
      selectedAITool: filterStore.selectedAITool,
      searchQuery: filterStore.searchQuery,
    });

    const currentUrl = searchParams.toString();
    const newUrl = params.toString();

    // URL이 변경된 경우에만 업데이트 (불필요한 히스토리 방지)
    if (newUrl !== currentUrl) {
      // scroll: false로 스크롤 위치 유지
      router.replace(newUrl ? `?${newUrl}` : window.location.pathname, {
        scroll: false,
      });
    }
  }, [
    filterStore.selectedCategories,
    filterStore.selectedDifficulty,
    filterStore.selectedTimeRange,
    filterStore.selectedAITool,
    filterStore.searchQuery,
    router,
    searchParams,
  ]);
}
