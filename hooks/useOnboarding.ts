import { useState } from "react";

export function useOnboarding() {
  // useState의 초기값으로 함수를 전달 (Lazy Initialization)
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean>(() => {
    // 서버 사이드 렌더링(Next.js 등) 환경 체크
    if (typeof window === "undefined") return true;

    try {
      const saved = localStorage.getItem("ai-pickly-onboarding");
      return saved ? JSON.parse(saved) : false;
    } catch (error) {
      console.error("로컬 스토리지를 읽는 중 에러 발생:", error);
      return false;
    }
  });

  const markOnboardingAsViewed = () => {
    setHasSeenOnboarding(true);
    localStorage.setItem("ai-pickly-onboarding", JSON.stringify(true));
  };

  const resetOnboarding = () => {
    setHasSeenOnboarding(false);
    localStorage.removeItem("ai-pickly-onboarding");
  };

  return { hasSeenOnboarding, markOnboardingAsViewed, resetOnboarding };
}
