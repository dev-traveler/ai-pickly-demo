"use client";

import { useState } from "react";
import { FeedbackHeroSection } from "@/app/(main)/search/_components/FeedbackHeroSection";
import { FilterBar } from "@/app/(main)/search/_components/FilterBar";
import { FilterButton } from "@/app/(main)/search/_components/FilterButton";
import { FilterSheet } from "@/app/(main)/search/_components/FilterSheet";
import { InfiniteContentGrid } from "@/app/(main)/search/_components/InfiniteContentGrid";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { useContentsCount, useAITools } from "@/hooks/useContentsQuery";
import { useContentsSearchParams } from "@/hooks/useContentsSearchParams";
import mixpanel from "mixpanel-browser";
import { SearchX, Sparkles } from "lucide-react";
import { CategoryLinkList } from "./CategoryLinkList";

interface ContentFeedClientProps {
  defaultCategory?: string;
  pageName?: string;
}

export function ContentFeedClient({ defaultCategory, pageName = "search" }: ContentFeedClientProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchParams] = useContentsSearchParams({ defaultCategory });

  // prefetch된 캐시에서 데이터 읽기
  const { data: totalCount } = useContentsCount({ defaultCategory });
  const { data: aiTools = [] } = useAITools();

  const searchQuery = searchParams.q;

  if (totalCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="flex flex-col items-center text-center space-y-6 max-w-md w-full">
          {/* 아이콘 */}
          <div className="rounded-full bg-muted p-4">
            <SearchX className="h-10 w-10 text-muted-foreground" />
          </div>
          {/* 개인화된 메시지 */}
          <div className="space-y-2">
            {searchQuery ? (
              <>
                <h3 className="text-lg font-semibold text-foreground">
                  &apos;{searchQuery}&apos;에 대한
                  <br />
                  콘텐츠는 아직 준비 중이에요
                </h3>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-foreground">
                  조건에 맞는 콘텐츠는 아직 없어요
                </h3>
              </>
            )}
          </div>

          {/* 피드백 섹션 (상단) */}
          <FeedbackHeroSection />

          {/* 구분선 */}
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground">또는</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* 카테고리 필터 (하단) */}
          <div className="w-full space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">카테고리별 콘텐츠 둘러보기</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <CategoryLinkList pageName={pageName} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>

      {/* 필터 바 (결과 개수 + 활성 필터 칩 + 필터 버튼) */}
      <FilterBar
        totalResults={totalCount}
        aiTools={aiTools}
        onOpenFilter={() => {
          mixpanel.track("click@button", {
            page_name: pageName,
            object_section: "body",
            object_id: "open_filter_sheet",
            object_name: "open_filter_sheet",
          });
          setSheetOpen(true);
        }}
      />

      {/* 무한 스크롤 콘텐츠 그리드 */}
      <InfiniteContentGrid defaultCategory={defaultCategory} />

      <div className="w-full fixed bottom-6 left-1/2 z-50 -translate-x-1/2 md:hidden">
        <div className="flex items-center justify-center w-full">
          <FilterButton
            responsive
            onClick={() => {
              mixpanel.track("click@button", {
                page_name: pageName,
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
    </>
  );
}
