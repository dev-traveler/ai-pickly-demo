"use client";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { trackOnboardingStartClick } from "@/lib/tracking";

interface OnboardingFinalSlideProps {
  onGetStarted: () => void;
}

export function OnboardingFinalSlide({
  onGetStarted,
}: OnboardingFinalSlideProps) {
  const handleClick = () => {
    trackOnboardingStartClick();
    onGetStarted();
  };

  return (
    <div className="h-full flex flex-col items-center justify-center py-12 px-6 space-y-4 md:space-y-6">
      <Logo className="h-10 w-10 md:w-12 md:h-12" black />
      <div className="text-lg md:text-xl font-semibold text-center">
        지금 바로 AI Pickly를 사용해보세요!
      </div>

      <div className="text-xs md:text-sm text-muted-foreground text-center">
        회원가입 없이도 지금 바로 탐색할 수 있어요
      </div>

      <Button
        variant="cta"
        className="w-full max-w-xs h-10 md:h-12 text-base"
        onClick={handleClick}
      >
        AI Pickly 사용하기
      </Button>
    </div>
  );
}
