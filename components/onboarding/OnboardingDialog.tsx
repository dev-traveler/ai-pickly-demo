"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OnboardingCarousel } from "./OnboardingCarousel";
import { trackClose } from "@/lib/analytics/mixpanel";

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingDialog({
  open,
  onOpenChange,
  onComplete,
  onSkip,
}: OnboardingDialogProps) {
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Dialog가 닫힐 때만 close 이벤트 전송
      trackClose("modal", {
        page_name: "home",
        object_section: "onboarding_modal",
        object_id: "onboarding_modal",
        object_name: "onboarding_modal",
        closed_by: "외부영역", // 배경 클릭으로 닫힘
      });
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-[calc(100%-4rem)] md:max-w-2xl p-0 gap-0"
        showCloseButton={false}
      >
        <OnboardingCarousel onComplete={onComplete} onSkip={onSkip} />
      </DialogContent>
    </Dialog>
  );
}
