"use client";

import { useEffect, useRef } from "react";
import { trackPageView } from "../track";

/**
 * 페이지뷰를 한 번만 추적합니다.
 */
export function useTrackPageView() {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!hasTracked.current) {
      trackPageView();
      hasTracked.current = true;
    }
  }, []);
}
