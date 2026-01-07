import { create } from "zustand";

export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type TimeRange = "5" | "10" | "30" | "30+";

interface FilterState {
  // Search
  searchQuery: string;

  // Filters
  selectedCategories: string[];
  selectedDifficulty: Difficulty | null;
  selectedTimeRange: TimeRange | null;
  selectedAITool: string | null;

  // Actions
  setSearchQuery: (query: string) => void;
  toggleCategory: (categoryId: string) => void;
  setDifficulty: (difficulty: Difficulty | null) => void;
  setTimeRange: (timeRange: TimeRange | null) => void;
  toggleAITool: (toolId: string) => void;
  resetSearchQuery: () => void;
  resetFilterChips: () => void;
  resetFilters: () => void;

  // Bulk update actions (for URL sync)
  setCategories: (categories: string[]) => void;
  setAITools: (tools: string | null) => void;
  setAllFilters: (filters: Partial<FilterState>) => void;

  // Computed
  hasActiveFilters: () => boolean;
  getActiveFilterCount: () => number;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  // Initial state
  searchQuery: "",
  selectedCategories: [],
  selectedDifficulty: null,
  selectedTimeRange: null,
  selectedAITool: null,

  // Actions
  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleCategory: (categoryId) =>
    set((state) => ({
      selectedCategories: state.selectedCategories.includes(categoryId)
        ? [] // 이미 선택된 카테고리를 다시 클릭하면 선택 해제
        : [categoryId], // 새로운 카테고리 하나만 선택 (기존 선택은 자동으로 해제됨)
    })),

  setDifficulty: (difficulty) => set({ selectedDifficulty: difficulty }),

  setTimeRange: (timeRange) => set({ selectedTimeRange: timeRange }),

  toggleAITool: (toolId) =>
    set((state) => ({
      selectedAITool:
        state.selectedAITool === toolId
          ? null // 이미 선택된 AI 툴을 다시 클릭하면 선택 해제
          : toolId, // 새로운 AI 툴 하나만 선택 (기존 선택은 자동으로 해제됨)
    })),

  resetSearchQuery: () => set({ searchQuery: "" }),
  resetFilterChips: () =>
    set({
      selectedCategories: [],
      selectedDifficulty: null,
      selectedTimeRange: null,
      selectedAITool: null,
    }),
  resetFilters: () => {
    get().resetSearchQuery();
    get().resetFilterChips();
  },

  // Bulk update actions (URL 동기화용)
  setCategories: (categories) => set({ selectedCategories: categories }),

  setAITools: (tools) => set({ selectedAITool: tools }),

  setAllFilters: (filters) =>
    set({
      searchQuery: filters.searchQuery ?? "",
      selectedCategories: filters.selectedCategories ?? [],
      selectedDifficulty: filters.selectedDifficulty ?? null,
      selectedTimeRange: filters.selectedTimeRange ?? null,
      selectedAITool: filters.selectedAITool ?? null,
    }),

  // Computed
  hasActiveFilters: () => {
    const state = get();
    return (
      state.searchQuery.trim().length > 0 ||
      state.selectedCategories.length > 0 ||
      state.selectedDifficulty !== null ||
      state.selectedTimeRange !== null ||
      state.selectedAITool !== null
    );
  },

  getActiveFilterCount: () => {
    const state = get();
    let count = 0;
    count += state.selectedCategories.length;
    if (state.selectedDifficulty) count++;
    if (state.selectedTimeRange) count++;
    if (state.selectedAITool) count++;
    return count;
  },
}));
