"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initMixpanel, trackPageview } from "@/lib/analytics/mixpanel";

export function MixpanelProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Mixpanel 초기화
  useEffect(() => {
    initMixpanel();
  }, []);

  // Pageview 자동 추적
  useEffect(() => {
    // 페이지 이름 매핑
    const getPageName = (path: string): string => {
      if (path === "/") return "home";
      if (path.startsWith("/newsletter/unsubscribe")) return "newletter_unsubscribe";
      if (path.startsWith("/policy/privacy")) return "policy_privacy";
      if (path.startsWith("/policy/marketing")) return "policy_marketing";
      return path.replace("/", "");
    };

    const pageName = getPageName(pathname);

    // 필터 파라미터 수집
    const filters: Record<string, any> = {};
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const time = searchParams.get("time");
    const tool = searchParams.get("tool");
    const keyword = searchParams.get("q");

    if (category) filters.category = category;
    if (difficulty) filters.difficulty = difficulty;
    if (time) filters.time = time;
    if (tool) filters.tool = tool;
    if (keyword) filters.keyword = keyword;

    // Pageview 이벤트 전송
    trackPageview(pageName, Object.keys(filters).length > 0 ? filters : undefined);
  }, [pathname, searchParams]);

  return <>{children}</>;
}
