"use client";

import { useEffect, useRef } from "react";

interface UseTrackImpressionOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Intersection Observer를 사용해 요소가 뷰포트에 노출될 때 콜백을 실행합니다.
 */
export function useTrackImpression<T extends HTMLElement>(
  onImpression: () => void,
  options: UseTrackImpressionOptions = {}
) {
  const { threshold = 0.5, rootMargin = "0px", triggerOnce = true } = options;
  const elementRef = useRef<T>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && (!triggerOnce || !hasTriggered.current)) {
          onImpression();
          hasTriggered.current = true;
          if (triggerOnce) {
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [onImpression, threshold, rootMargin, triggerOnce]);

  return elementRef;
}
