"use client";

import { useState, useEffect } from "react";
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

export function OnboardingCarousel({
  onComplete,
  onSkip,
}: OnboardingCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };

    // 이벤트 리스너 등록 후 즉시 호출하여 초기 상태 동기화
    api.on("select", onSelect);
    onSelect(); // 초기 상태 설정

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const handleNext = () => api?.scrollNext();
  const handlePrev = () => api?.scrollPrev();
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
            onClick={onSkip}
            className="absolute bottom-1 right-4 z-10 text-xs text-muted-foreground hover:text-foreground"
          >
            건너뛰기
          </Button>
        )}
      </div>
    </div>
  );
}
