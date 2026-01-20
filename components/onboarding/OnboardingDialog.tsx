"use client";

import { useState, useSyncExternalStore } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OnboardingCarousel } from "./OnboardingCarousel";
import mixpanel from "mixpanel-browser";

const ONBOARDING_STORAGE_KEY = "onboarding.dismissed";
const ONBOARDING_EVENT_KEY = "onboarding-dismissed";

const subscribeToOnboarding = (callback: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = (event: Event) => {
    if (event instanceof StorageEvent && event.key !== ONBOARDING_STORAGE_KEY) {
      return;
    }

    callback();
  };

  window.addEventListener("storage", handler);
  window.addEventListener(ONBOARDING_EVENT_KEY, handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(ONBOARDING_EVENT_KEY, handler);
  };
};

const getOnboardingSnapshot = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem(ONBOARDING_STORAGE_KEY) === "true";
};

const getOnboardingServerSnapshot = () => true;

export function OnboardingDialog() {
  const hasSeenOnboarding = useSyncExternalStore(
    subscribeToOnboarding,
    getOnboardingSnapshot,
    getOnboardingServerSnapshot
  );

  const [onboardingOpen, setOnboardingOpen] = useState(
    () => !getOnboardingSnapshot()
  );

  const markOnboardingDismissed = () => {
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
      window.dispatchEvent(new Event(ONBOARDING_EVENT_KEY));
    } catch {
      // 로컬 스토리지 접근 실패 시에도 세션 내에서는 닫히도록 처리
    }

    setOnboardingOpen(false);
  };

  const showOnboarding = !hasSeenOnboarding && onboardingOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    if (showOnboarding && !nextOpen) {
      mixpanel.track("close@modal", {
        page_name: "home",
        object_section: "onboarding_modal",
        object_id: "onboarding_modal",
        object_name: "onboarding_modal",
      });
    }
    setOnboardingOpen(nextOpen);
  };

  return (
    <Dialog open={showOnboarding} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-[calc(100%-4rem)] md:max-w-2xl p-0 gap-0"
        showCloseButton={false}
      >
        <OnboardingCarousel
          onComplete={markOnboardingDismissed}
          onSkip={markOnboardingDismissed}
        />
      </DialogContent>
    </Dialog>
  );
}
