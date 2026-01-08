import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface OnboardingState {
  // State
  hasSeenOnboarding: boolean;

  // Actions
  markOnboardingAsViewed: () => void;
  resetOnboarding: () => void; // 개발용
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      // Initial state
      hasSeenOnboarding: false,

      // Actions
      markOnboardingAsViewed: () => set({ hasSeenOnboarding: true }),
      resetOnboarding: () => set({ hasSeenOnboarding: false }),
    }),
    {
      name: "ai-pickly-onboarding", // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
