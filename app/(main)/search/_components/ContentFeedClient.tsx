"use client";

import { useState } from "react";
import { FilterBar } from "@/app/(main)/search/_components/FilterBar";
import { FilterButton } from "@/app/(main)/search/_components/FilterButton";
import { FilterSheet } from "@/app/(main)/search/_components/FilterSheet";
import { InfiniteContentGrid } from "@/app/(main)/search/_components/InfiniteContentGrid";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { OnboardingDialog } from "@/components/onboarding/OnboardingDialog";
import { useContentsCount, useAITools } from "@/hooks/useContentsQuery";
import mixpanel from "mixpanel-browser";

export function ContentFeedClient() {
  const [sheetOpen, setSheetOpen] = useState(false);

  // prefetch된 캐시에서 데이터 읽기
  const { data: totalCount } = useContentsCount();
  const { data: aiTools = [] } = useAITools();

  return (
    <>
      {/* 카테고리 필터 */}

      {/* 필터 바 (결과 개수 + 활성 필터 칩 + 필터 버튼) */}
      <FilterBar
        totalResults={totalCount}
        aiTools={aiTools}
        onOpenFilter={() => {
          mixpanel.track("click@button", {
            page_name: "home",
            object_section: "body",
            object_id: "open_filter_sheet",
            object_name: "open_filter_sheet",
          });
          setSheetOpen(true);
        }}
      />

      {/* 무한 스크롤 콘텐츠 그리드 */}
      <InfiniteContentGrid />

      <div className="w-full fixed bottom-6 left-1/2 z-50 -translate-x-1/2 md:hidden">
        <div className="flex items-center justify-center w-full">
          <FilterButton
            responsive
            onClick={() => {
              mixpanel.track("click@button", {
                page_name: "home",
                object_section: "body",
                object_id: "open_filter_sheet",
                object_name: "open_filter_sheet",
              });
              setSheetOpen(true);
            }}
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
      <OnboardingDialog />
    </>
  );
}
