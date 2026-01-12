"use client";

import { useEffect, useMemo } from "react";
import mixpanel from "mixpanel-browser";
import { useContentsSearchParams } from "@/hooks/useContentsSearchParams";

interface PageViewTrackerProps {
  pageName: string;
}

export function PageViewTracker({ pageName }: PageViewTrackerProps) {
  const [{ category, difficulty, time, tool, q }] = useContentsSearchParams();
  const properties = useMemo(() => {
    const entries = [
      ["category", category],
      ["difficulty", difficulty],
      ["time", time],
      ["tool", tool],
      ["q", q],
    ] as const;

    return entries.reduce<Record<string, string>>((acc, [key, value]) => {
      if (value) acc[key] = value;
      return acc;
    }, {});
  }, [category, difficulty, q, time, tool]);

  useEffect(() => {
    mixpanel.track(`pageview@${pageName}`, properties);
  }, [pageName, properties]);

  return null;
}
