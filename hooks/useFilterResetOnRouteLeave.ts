"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useFilterStore } from "@/lib/stores/filter-store";

/**
 * 홈 페이지(/)에서 다른 페이지로 이동할 때 필터를 자동으로 리셋하는 Hook
 *
 * 동작 방식:
 * - 경로가 "/" → 다른 경로로 변경될 때 resetFilters() 호출
 * - Link 클릭, router.push, 브라우저 뒤로가기/앞으로가기 모두 지원
 * - 홈으로 돌아올 때는 리셋하지 않음 (useFilterSync가 URL에서 복원)
 *
 * 사용법:
 * Layout 또는 App 레벨에서 호출하여 모든 라우트 변경을 감지합니다.
 *
 * @example
 * ```tsx
 * export function FilterResetProvider({ children }) {
 *   useFilterResetOnRouteLeave();
 *   return <>{children}</>;
 * }
 * ```
 */
export function useFilterResetOnRouteLeave() {
  const pathname = usePathname();
  const previousPathnameRef = useRef<string>(pathname);
  const resetFilters = useFilterStore((state) => state.resetFilters);

  useEffect(() => {
    const previousPathname = previousPathnameRef.current;
    const currentPathname = pathname;

    // 홈(/)에서 다른 페이지로 이동하는 경우만 체크
    const isLeavingHome = previousPathname === "/" && currentPathname !== "/";

    if (isLeavingHome) {
      resetFilters();
    }

    // 다음 비교를 위해 현재 경로 저장
    previousPathnameRef.current = currentPathname;
  }, [pathname, resetFilters]);
}
