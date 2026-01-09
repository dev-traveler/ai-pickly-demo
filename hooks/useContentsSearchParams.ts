"use client";

import { createSerializer, useQueryStates } from "nuqs";
import { contentsSearchParams } from "@/app/(main)/search-params";

export function useContentsSearchParams() {
  return useQueryStates(contentsSearchParams);
}

export const serialize = createSerializer(contentsSearchParams);
