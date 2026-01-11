"use client";

import Image from "next/image";
import { useEffect } from "react";
import mixpanel from "mixpanel-browser";

interface OnboardingImageSlideProps {
  imagePath: string;
  slideNumber: number;
}

export function OnboardingImageSlide({
  imagePath,
  slideNumber,
}: OnboardingImageSlideProps) {
  useEffect(() => {
    mixpanel.track("impression@onboarding", {
      page_name: "home",
      object_section: "onboarding_modal",
      object_id: "onboarding_slide",
      object_name: "onboarding_slide",
      object_position: String(slideNumber),
    });
  }, [slideNumber]);

  return (
    <>
      <div className="relative w-full aspect-13/14 mb-4 md:hidden">
        <Image
          src={"/m" + imagePath}
          alt={`온보딩 ${slideNumber}단계`}
          fill
          className="object-contain"
          priority={slideNumber === 1}
          loading={slideNumber === 1 ? undefined : "lazy"}
        />
      </div>
      <div className="relative w-full aspect-10/8 hidden md:block">
        <Image
          src={imagePath}
          alt={`온보딩 ${slideNumber}단계`}
          fill
          className="object-contain"
          priority={slideNumber === 1}
          loading={slideNumber === 1 ? undefined : "lazy"}
        />
      </div>
    </>
  );
}
