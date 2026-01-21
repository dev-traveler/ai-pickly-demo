"use client";

import { usePathname } from "next/navigation";
import { useContentsSearchParams } from "@/hooks/useContentsSearchParams";
import { SearchBar } from "@/app/(main)/_components/SearchBar";

export function ConditionalSearchBar() {
  const pathname = usePathname();
  const [searchParams] = useContentsSearchParams();
  const hasSearchParams = Object.values(searchParams).some((v) => !!v);

  if (pathname !== "/search" || !hasSearchParams) return null;

  return <SearchBar />;
}

