"use client";

import { useState, useSyncExternalStore } from "react";
import { FilterBar } from "@/app/(main)/search/_components/FilterBar";
import { FilterButton } from "@/app/(main)/search/_components/FilterButton";
import { FilterSheet } from "@/app/(main)/search/_components/FilterSheet";
import { InfiniteContentGrid } from "@/app/(main)/search/_components/InfiniteContentGrid";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { OnboardingDialog } from "@/components/onboarding/OnboardingDialog";
import { useContentsCount, useAITools } from "@/hooks/useContentsQuery";
import mixpanel from "mixpanel-browser";

const ONBOARDING_STORAGE_KEY = "onboarding.dismissed";
const ONBOARDING_EVENT_KEY = "onboarding-dismissed";

const subscribeToOnboarding = (callback: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = (event: Event) => {
    if (event instanceof StorageEvent && event.key !== ONBOARDING_STORAGE_KEY) {
      return;
    }

    callback();
  };

  window.addEventListener("storage", handler);
  window.addEventListener(ONBOARDING_EVENT_KEY, handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(ONBOARDING_EVENT_KEY, handler);
  };
};

const getOnboardingSnapshot = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem(ONBOARDING_STORAGE_KEY) === "true";
};

const getOnboardingServerSnapshot = () => true;

export function ContentFeedClient() {
  const hasSeenOnboarding = useSyncExternalStore(
    subscribeToOnboarding,
    getOnboardingSnapshot,
    getOnboardingServerSnapshot
  );

  const [sheetOpen, setSheetOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(
    () => !getOnboardingSnapshot()
  );

  // prefetch된 캐시에서 데이터 읽기
  const { data: totalCount } = useContentsCount();
  const { data: aiTools = [] } = useAITools();

  const markOnboardingDismissed = () => {
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
      window.dispatchEvent(new Event(ONBOARDING_EVENT_KEY));
    } catch {
      // 로컬 스토리지 접근 실패 시에도 세션 내에서는 닫히도록 처리
    }

    setOnboardingOpen(false);
  };

  const showOnboarding = !hasSeenOnboarding && onboardingOpen;

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
      <OnboardingDialog
        open={showOnboarding}
        onOpenChange={setOnboardingOpen}
        onComplete={markOnboardingDismissed}
        onSkip={markOnboardingDismissed}
      />
    </>
  );
}
