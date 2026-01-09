import { useFilterStore } from "@/lib/stores/filter-store";
import type { FilterParams } from "./types";

/**
 * 현재 필터 상태를 가져옵니다. 이벤트 발생 시점에 호출해야 합니다.
 */
export function getFilterParams(): FilterParams {
  const state = useFilterStore.getState();
  return {
    categories: state.selectedCategories,
    difficulty: state.selectedDifficulty,
    time: state.selectedTimeRange,
    tools: state.selectedAITool,
    q: state.searchQuery,
  };
}

/**
 * referrer URL을 가져옵니다.
 */
export function getReferrer(): string {
  if (typeof document !== "undefined") {
    return document.referrer || "direct";
  }
  return "unknown";
}
