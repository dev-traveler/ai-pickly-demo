export type FilterType = "category" | "difficulty" | "time" | "tool";

export type filterChip = {
  id: string;
  label: string;
  filterType: FilterType;
  onRemove: () => void;
};
