"use client";

import { createSerializer, useQueryStates, UseQueryStatesReturn } from "nuqs";
import { filtersSearchParams } from "@/app/(main)/search-params";

type Return = UseQueryStatesReturn<typeof filtersSearchParams>;

export function useFiltersSearchParams(): [...Return, number] {
  const useSearchParams = useQueryStates(filtersSearchParams);
  const filteringCount = Object.entries(useSearchParams[0]).filter(
    (p) => !!p[1]
  ).length;

  return [...useSearchParams, filteringCount];
}

export const serialize = createSerializer(filtersSearchParams);
