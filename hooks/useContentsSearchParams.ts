"use client";

import { createSerializer, useQueryStates } from "nuqs";
import { contentsSearchParams } from "@/app/(main)/search/search-params";

interface UseContentsSearchParamsOptions {
  defaultCategory?: string;
}

export function useContentsSearchParams(options?: UseContentsSearchParamsOptions) {
  const [params, setParams] = useQueryStates(contentsSearchParams);

  // URL에 category가 없으면 defaultCategory 사용
  const effectiveParams = {
    ...params,
    category: params.category ?? options?.defaultCategory ?? null,
  };

  return [effectiveParams, setParams] as const;
}

export const serialize = createSerializer(contentsSearchParams);
