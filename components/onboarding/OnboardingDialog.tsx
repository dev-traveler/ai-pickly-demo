"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OnboardingCarousel } from "./OnboardingCarousel";
import mixpanel from "mixpanel-browser";

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
  const handleOpenChange = (nextOpen: boolean) => {
    if (open && !nextOpen) {
      mixpanel.track("close@modal", {
        page_name: "home",
        object_section: "onboarding_modal",
        object_id: "onboarding_modal",
        object_name: "onboarding_modal",
      });
    }
    onOpenChange(nextOpen);
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
