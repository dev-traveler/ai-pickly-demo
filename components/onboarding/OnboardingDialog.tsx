"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OnboardingCarousel } from "./OnboardingCarousel";
import { useOnboardingStore } from "@/lib/stores/onboarding-store";

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
