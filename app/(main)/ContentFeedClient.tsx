"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";
import { CategoryFilter } from "./CategoryFilter";
import { FilterBar } from "@/app/(main)/FilterBar";
import { FilterButton } from "@/app/(main)/FilterButton";
import { FilterSheet } from "@/app/(main)/FilterSheet";
import { InfiniteContentGrid } from "@/app/(main)/InfiniteContentGrid";
import { ScrollToTopButton } from "@/app/(main)/ScrollToTopButton";
import { useFilterStore } from "@/lib/stores/filter-store";
import { useFilterSync } from "@/hooks/useFilterSync";
import { mapFiltersToOptions } from "@/lib/utils/filter-mapper";
import { getContentsCount } from "@/lib/db/contents";
import type { ContentCardData } from "@/types/content";
import type { AIToolData } from "@/lib/db/ai-tools";
import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { OnboardingDialog } from "@/components/onboarding/OnboardingDialog";

interface ContentFeedClientProps {
  initialData: ContentCardData[];
  initialTotalCount: number;
  aiTools: AIToolData[];
}

/**
 * 콘텐츠 피드의 클라이언트 측 오케스트레이션 컴포넌트
 *
 * 역할:
 * 1. Zustand filter store와 URL query params 동기화
 * 2. 필터 상태를 Server Action 형식으로 변환
 * 3. 필터링된 콘텐츠 총 개수 조회
 * 4. InfiniteContentGrid에 필터 적용
 */
export function ContentFeedClient({
  initialData,
  initialTotalCount,
  aiTools,
}: ContentFeedClientProps) {
  const filterStore = useFilterStore();
  const [sheetOpen, setSheetOpen] = useState(false);

  // 온보딩 상태 관리
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  const hasSeenOnboarding = useOnboardingStore(
    (state) => state.hasSeenOnboarding
  );

  const isOnboardingHydrated = useSyncExternalStore(
    (onStoreChange) =>
      useOnboardingStore.persist.onFinishHydration(onStoreChange),
    () => useOnboardingStore.persist.hasHydrated(),
    () => false
  );
  const showOnboarding =
    isOnboardingHydrated && !hasSeenOnboarding && !onboardingDismissed;

  // URL ↔ Zustand 양방향 동기화
  useFilterSync();

  // Zustand 상태를 Server Action GetContentsOptions 형식으로 변환
  const filterOptions = useMemo(
    () =>
      mapFiltersToOptions({
        selectedCategories: filterStore.selectedCategories,
        selectedDifficulty: filterStore.selectedDifficulty,
        selectedTimeRange: filterStore.selectedTimeRange,
        selectedAITool: filterStore.selectedAITool,
        searchQuery: filterStore.searchQuery,
      }),
    [
      filterStore.selectedCategories,
      filterStore.selectedDifficulty,
      filterStore.selectedTimeRange,
      filterStore.selectedAITool,
      filterStore.searchQuery,
    ]
  );

  // 필터링된 콘텐츠 총 개수 조회 (React Query로 캐싱)
  const { data: totalCount } = useQuery({
    queryKey: ["contents-count", filterOptions],
    queryFn: () => getContentsCount(filterOptions),
    initialData: initialTotalCount,
    staleTime: 30000, // 30초간 캐시
  });

  // 필터가 활성화되어 있는지 확인
  const hasFilters = filterStore.hasActiveFilters();
  const activeFilters = filterStore.getActiveFilterCount();

  return (
    <>
      {/* 카테고리 필터 */}
      <CategoryFilter />

      {/* 필터 바 (결과 개수 + 활성 필터 칩 + 필터 버튼) */}
      <FilterBar
        totalResults={totalCount ?? 0}
        aiTools={aiTools}
        onOpenFilter={() => setSheetOpen(true)}
      />

      {/* 무한 스크롤 콘텐츠 그리드 */}
      <InfiniteContentGrid
        filters={filterOptions}
        initialData={hasFilters ? undefined : initialData}
      />

      <div className="w-full fixed bottom-6 left-1/2 z-50 -translate-x-1/2 md:hidden">
        <div className="flex items-center justify-center w-full">
          <FilterButton
            responsive
            activeFilters={activeFilters}
            onClick={() => setSheetOpen(true)}
          />
          <ScrollToTopButton className="absolute right-6" />
        </div>
      </div>

      <FilterSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        aiTools={aiTools}
      />

      {/* 온보딩 다이얼로그 */}
      <OnboardingDialog
        open={showOnboarding}
        onOpenChange={(open) => {
          if (!open) {
            setOnboardingDismissed(true);
          }
        }}
      />
    </>
  );
}
