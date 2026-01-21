"use client";

import { SearchBar } from "@/app/(main)/_components/SearchBar";
import { useContentsSearchParams } from "@/hooks/useContentsSearchParams";

export function ConditionalSearchBar() {
  const [searchParams] = useContentsSearchParams();
  const hasSearchParams = Object.values(searchParams).some((v) => !!v);

  if (!hasSearchParams) return null;

  return <SearchBar />;
}

