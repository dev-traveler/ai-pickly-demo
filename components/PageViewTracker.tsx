"use client";

import { useEffect } from "react";
import mixpanel from "mixpanel-browser";

interface PageViewTrackerProps {
  pageName: string;
}

export function PageViewTracker({ pageName }: PageViewTrackerProps) {
  useEffect(() => {
    mixpanel.track(`pageview@${pageName}`);
  }, [pageName]);

  return null;
}
