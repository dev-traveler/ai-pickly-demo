"use client";

import { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OnboardingCarousel } from "./OnboardingCarousel";
import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { trackOnboardingModalImpression } from "@/lib/tracking";

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OnboardingDialog({
  open,
  onOpenChange,
}: OnboardingDialogProps) {
  const markOnboardingAsViewed = useOnboardingStore(
    (state) => state.markOnboardingAsViewed
  );

  // 모달 노출 추적
  useEffect(() => {
    if (open) {
      trackOnboardingModalImpression();
    }
  }, [open]);

  const handleComplete = () => {
    markOnboardingAsViewed();
    onOpenChange(false);
  };

  const handleSkip = () => {
    markOnboardingAsViewed();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[calc(100%-4rem)] md:max-w-2xl p-0 gap-0"
        showCloseButton={false}
      >
        <OnboardingCarousel onComplete={handleComplete} onSkip={handleSkip} />
      </DialogContent>
    </Dialog>
  );
}
