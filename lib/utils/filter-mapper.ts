import { TimeRange } from "@/types/filter";

/**
 * TimeRange 값을 minMinutes/maxMinutes 범위로 변환
 */
export function mapTimeRangeToMinutes(timeRange?: TimeRange | null): {
  minMinutes?: number;
  maxMinutes?: number;
} {
  if (!timeRange) return {};

  const mapping: Record<
    TimeRange,
    { minMinutes?: number; maxMinutes?: number }
  > = {
    "5": { maxMinutes: 4 }, // 5분 미만 (0-4분)
    "10": { minMinutes: 5, maxMinutes: 10 }, // 5-10분
    "30": { minMinutes: 11, maxMinutes: 30 }, // 10-30분 (실제로는 11-30분)
    "30+": { minMinutes: 31 }, // 30분 이상 (31분+)
  };

  return mapping[timeRange];
}
