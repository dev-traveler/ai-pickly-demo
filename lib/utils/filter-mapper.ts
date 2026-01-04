import type { Difficulty, TimeRange } from "@/lib/stores/filter-store";
import type { GetContentsOptions } from "@/lib/db/contents";

/**
 * TimeRange 값을 minMinutes/maxMinutes 범위로 변환
 */
export function mapTimeRangeToMinutes(
  timeRange: TimeRange | null
): { minMinutes?: number; maxMinutes?: number } {
  if (!timeRange) return {};

  const mapping: Record<TimeRange, { minMinutes?: number; maxMinutes?: number }> = {
    "5": { maxMinutes: 4 }, // 5분 미만 (0-4분)
    "10": { minMinutes: 5, maxMinutes: 10 }, // 5-10분
    "30": { minMinutes: 11, maxMinutes: 30 }, // 10-30분 (실제로는 11-30분)
    "30+": { minMinutes: 31 }, // 30분 이상 (31분+)
  };

  return mapping[timeRange];
}

/**
 * Zustand FilterState를 Server Action GetContentsOptions로 변환
 */
export function mapFiltersToOptions(filterState: {
  selectedCategories: string[];
  selectedDifficulty: Difficulty | null;
  selectedTimeRange: TimeRange | null;
  selectedAITool: string | null;
}): Omit<GetContentsOptions, "page" | "pageSize"> {
  const options: Omit<GetContentsOptions, "page" | "pageSize"> = {};

  // 카테고리 (빈 배열이면 undefined)
  if (filterState.selectedCategories.length > 0) {
    options.categoryIds = filterState.selectedCategories;
  }

  // 난이도
  if (filterState.selectedDifficulty) {
    options.difficulty = filterState.selectedDifficulty;
  }

  // 소요시간 (범위 기반)
  const timeRangeMinutes = mapTimeRangeToMinutes(filterState.selectedTimeRange);
  if (timeRangeMinutes.minMinutes !== undefined) {
    options.minMinutes = timeRangeMinutes.minMinutes;
  }
  if (timeRangeMinutes.maxMinutes !== undefined) {
    options.maxMinutes = timeRangeMinutes.maxMinutes;
  }

  // AI Tools (단일 선택을 배열로 변환)
  if (filterState.selectedAITool) {
    options.aiToolIds = [filterState.selectedAITool];
  }

  return options;
}

/**
 * FilterState를 URL query string으로 직렬화
 */
export function serializeFiltersToURL(filterState: {
  selectedCategories: string[];
  selectedDifficulty: Difficulty | null;
  selectedTimeRange: TimeRange | null;
  selectedAITool: string | null;
}): URLSearchParams {
  const params = new URLSearchParams();

  // 카테고리 (쉼표로 구분)
  if (filterState.selectedCategories.length > 0) {
    params.set("categories", filterState.selectedCategories.join(","));
  }

  // 난이도
  if (filterState.selectedDifficulty) {
    params.set("difficulty", filterState.selectedDifficulty);
  }

  // 소요시간
  if (filterState.selectedTimeRange) {
    params.set("time", filterState.selectedTimeRange);
  }

  // AI Tool
  if (filterState.selectedAITool) {
    params.set("tools", filterState.selectedAITool);
  }

  return params;
}

/**
 * URL query params를 FilterState로 파싱
 */
export function parseFiltersFromURL(searchParams: URLSearchParams): Partial<{
  selectedCategories: string[];
  selectedDifficulty: Difficulty;
  selectedTimeRange: TimeRange;
  selectedAITool: string | null;
}> {
  const filters: Partial<{
    selectedCategories: string[];
    selectedDifficulty: Difficulty;
    selectedTimeRange: TimeRange;
    selectedAITool: string | null;
  }> = {};

  // 카테고리
  const categories = searchParams.get("categories");
  if (categories) {
    filters.selectedCategories = categories.split(",").filter(Boolean);
  }

  // 난이도
  const difficulty = searchParams.get("difficulty");
  if (
    difficulty &&
    ["BEGINNER", "INTERMEDIATE", "ADVANCED"].includes(difficulty)
  ) {
    filters.selectedDifficulty = difficulty as Difficulty;
  }

  // 소요시간
  const time = searchParams.get("time");
  if (time && ["5", "10", "30", "30+"].includes(time)) {
    filters.selectedTimeRange = time as TimeRange;
  }

  // AI Tools
  const tools = searchParams.get("tools");
  if (tools) {
    filters.selectedAITool = tools;
  }

  return filters;
}
