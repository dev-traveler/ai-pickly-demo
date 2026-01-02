"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useFilterStore } from "@/lib/stores/filter-store";

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useFilterStore();

  return (
    <div className="relative w-full max-w-2xl">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="어떤 AI를 찾으시나요?"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 h-12 rounded-full border-gray-200 focus-visible:ring-2 focus-visible:ring-gray-900"
      />
    </div>
  );
}
