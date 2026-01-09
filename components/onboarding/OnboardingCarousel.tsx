"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { OnboardingImageSlide } from "./OnboardingImageSlide";
import { OnboardingFinalSlide } from "./OnboardingFinalSlide";
import { OnboardingDots } from "./OnboardingDots";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  trackOnboardingStepImpression,
  trackOnboardingNavigation,
  trackOnboardingClose,
} from "@/lib/tracking";

interface OnboardingCarouselProps {
  onComplete: () => void;
  onSkip: () => void;
}

const imageSlides = [
  "/images/on-boarding-1.png",
  "/images/on-boarding-2.png",
  "/images/on-boarding-3.png",
  "/images/on-boarding-4.png",
];

const pageButton =
  "absolute top-1/2 -translate-y-[2.5rem] md:-translate-y-0 z-10 size-8 md:size-10 rounded-full bg-white/80 hover:bg-white shadow-md";

const TOTAL_STEPS = 5;

export function OnboardingCarousel({
  onComplete,
  onSkip,
}: OnboardingCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const previousSlideRef = useRef(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const newSlide = api.selectedScrollSnap();
      setCurrentSlide(newSlide);

      // 스텝 노출 추적 (슬라이드가 변경될 때만)
      if (newSlide !== previousSlideRef.current) {
        trackOnboardingStepImpression({
          step_index: newSlide,
          total_steps: TOTAL_STEPS,
        });
      }
      previousSlideRef.current = newSlide;
    };

    // 이벤트 리스너 등록 후 즉시 호출하여 초기 상태 동기화
    api.on("select", onSelect);
    // 초기 스텝 노출 추적
    trackOnboardingStepImpression({
      step_index: 0,
      total_steps: TOTAL_STEPS,
    });

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const handleNext = () => {
    if (api) {
      trackOnboardingNavigation({
        direction: "next",
        from_step: currentSlide,
        to_step: currentSlide + 1,
      });
      api.scrollNext();
    }
  };

  const handlePrev = () => {
    if (api) {
      trackOnboardingNavigation({
        direction: "prev",
        from_step: currentSlide,
        to_step: currentSlide - 1,
      });
      api.scrollPrev();
    }
  };

  const handleSkip = () => {
    trackOnboardingClose({ current_step: currentSlide });
    onSkip();
  };

  const isFinalSlide = currentSlide === 4;
  const isFirstSlide = currentSlide === 0;

  return (
    <div className="flex flex-col">
      <div className="md:hidden">
        <OnboardingDots total={5} current={currentSlide} />
      </div>
      <div className="relative">
        <Carousel
          opts={{
            loop: false,
            watchDrag: true,
          }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent>
            {/* 이미지 슬라이드 1-4 */}
            {imageSlides.map((imagePath, idx) => (
              <CarouselItem key={idx}>
                <OnboardingImageSlide
                  imagePath={imagePath}
                  slideNumber={idx + 1}
                />
              </CarouselItem>
            ))}

            {/* React 컴포넌트 슬라이드 5 */}
            <CarouselItem>
              <OnboardingFinalSlide onGetStarted={onComplete} />
            </CarouselItem>
          </CarouselContent>
        </Carousel>

        {/* 좌측 화살표 버튼 */}
        {!isFirstSlide && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrev}
            className={cn(pageButton, "left-2 md:left-4")}
          >
            <ChevronLeft className="size-6" />
          </Button>
        )}

        {/* 우측 화살표 버튼 */}
        {!isFinalSlide && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className={cn(pageButton, "right-2 md:right-4")}
          >
            <ChevronRight className="size-6" />
          </Button>
        )}
      </div>

      <div className="flex justify-center">
        {/* 페이지 인디케이터 */}
        <div className="absolute bottom-2 hidden md:block">
          <OnboardingDots total={5} current={currentSlide} />
        </div>

        {/* Skip 버튼 */}
        {!isFinalSlide && (
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="absolute bottom-1 right-4 z-10 text-xs text-muted-foreground hover:text-foreground"
          >
            건너뛰기
          </Button>
        )}
      </div>
    </div>
  );
}
