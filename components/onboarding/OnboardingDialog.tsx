import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OnboardingCarousel } from "./OnboardingCarousel";

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[calc(100%-4rem)] md:max-w-2xl p-0 gap-0"
        showCloseButton={false}
      >
        <OnboardingCarousel onComplete={onComplete} onSkip={onSkip} />
      </DialogContent>
    </Dialog>
  );
}
