"use client";

import { usePathname } from "next/navigation";
import { useContentsSearchParams } from "@/hooks/useContentsSearchParams";
import { SearchBar } from "@/app/(main)/_components/SearchBar";

export function ConditionalSearchBar() {
  const pathname = usePathname();
  const [searchParams] = useContentsSearchParams();
  const hasSearchParams = Object.values(searchParams).some((v) => !!v);

  const isSearchPage = pathname === "/search" && hasSearchParams;
  const isCategoryPage = pathname.startsWith("/category/");

  if (!isSearchPage && !isCategoryPage) return null;

  return <SearchBar />;
}

