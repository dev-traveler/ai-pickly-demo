export const TimeRange = {
  "5": "5",
  "10": "10",
  "30": "30",
  "30+": "30+",
} as const;

export type TimeRange = keyof typeof TimeRange;

export type filterChip = { id: string; label: string; onRemove: () => void };
