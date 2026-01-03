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
  selectedAITools: string[];

  // Actions
  setSearchQuery: (query: string) => void;
  toggleCategory: (categoryId: string) => void;
  setDifficulty: (difficulty: Difficulty | null) => void;
  setTimeRange: (timeRange: TimeRange | null) => void;
  toggleAITool: (toolId: string) => void;
  resetFilters: () => void;

  // Bulk update actions (for URL sync)
  setCategories: (categories: string[]) => void;
  setAITools: (tools: string[]) => void;
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
  selectedAITools: [],

  // Actions
  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleCategory: (categoryId) =>
    set((state) => ({
      selectedCategories: state.selectedCategories.includes(categoryId)
        ? state.selectedCategories.filter((id) => id !== categoryId)
        : [...state.selectedCategories, categoryId],
    })),

  setDifficulty: (difficulty) => set({ selectedDifficulty: difficulty }),

  setTimeRange: (timeRange) => set({ selectedTimeRange: timeRange }),

  toggleAITool: (toolId) =>
    set((state) => ({
      selectedAITools: state.selectedAITools.includes(toolId)
        ? state.selectedAITools.filter((id) => id !== toolId)
        : [...state.selectedAITools, toolId],
    })),

  resetFilters: () =>
    set({
      searchQuery: "",
      selectedCategories: [],
      selectedDifficulty: null,
      selectedTimeRange: null,
      selectedAITools: [],
    }),

  // Bulk update actions (URL 동기화용)
  setCategories: (categories) => set({ selectedCategories: categories }),

  setAITools: (tools) => set({ selectedAITools: tools }),

  setAllFilters: (filters) =>
    set({
      searchQuery: filters.searchQuery ?? "",
      selectedCategories: filters.selectedCategories ?? [],
      selectedDifficulty: filters.selectedDifficulty ?? null,
      selectedTimeRange: filters.selectedTimeRange ?? null,
      selectedAITools: filters.selectedAITools ?? [],
    }),

  // Computed
  hasActiveFilters: () => {
    const state = get();
    return (
      state.selectedCategories.length > 0 ||
      state.selectedDifficulty !== null ||
      state.selectedTimeRange !== null ||
      state.selectedAITools.length > 0
    );
  },

  getActiveFilterCount: () => {
    const state = get();
    let count = 0;
    count += state.selectedCategories.length;
    if (state.selectedDifficulty) count++;
    if (state.selectedTimeRange) count++;
    count += state.selectedAITools.length;
    return count;
  },
}));
