"use client";

import { useFilterResetOnRouteLeave } from "@/hooks/useFilterResetOnRouteLeave";

interface FilterResetProviderProps {
  children: React.ReactNode;
}

/**
 * 홈 페이지에서 다른 페이지로 이동할 때 필터를 리셋하는 Provider 컴포넌트
 *
 * 이 컴포넌트는 Main Layout을 감싸서 라우트 변경을 감지하고
 * 사용자가 홈 페이지를 떠날 때 자동으로 필터를 리셋합니다.
 *
 * @example
 * ```tsx
 * <main className="flex-1">
 *   <FilterResetProvider>
 *     {children}
 *   </FilterResetProvider>
 * </main>
 * ```
 */
export function FilterResetProvider({ children }: FilterResetProviderProps) {
  useFilterResetOnRouteLeave();

  return <>{children}</>;
}
