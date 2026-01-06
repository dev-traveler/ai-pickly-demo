"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useFilterStore } from "@/lib/stores/filter-store";

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useFilterStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const router = useRouter();
  const pathname = usePathname();

  // Sync Zustand back to local (for URL changes)
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchQuery(localQuery);

      // 현재 경로가 루트가 아니면 루트로 이동
      if (pathname !== "/") {
        router.push("/");
      }
    }
  };

  return (
    <div className="relative w-full max-w-2xl">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="어떤 AI를 찾으시나요?"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="pl-10 h-12 rounded-full border-gray-200 focus-visible:ring-2 focus-visible:ring-gray-900"
      />
    </div>
  );
}
