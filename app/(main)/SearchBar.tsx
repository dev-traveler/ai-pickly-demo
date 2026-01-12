"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";
import mixpanel from "mixpanel-browser";
import {
  useFiltersSearchParams,
  serialize,
} from "@/hooks/useFiltersSearchParams";

export function SearchBar() {
  const [q, setQ] = useQueryState("q", { shallow: true });
  const [localQuery, setLocalQuery] = useState(q ?? "");
  const [filters] = useFiltersSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleClickX = () => {
    mixpanel.track("search@keyword", {
      page_name: "home",
      object_section: "header",
      object_id: "searchbar_x_icon",
      object_name: "searchbar_x_icon",
      keyword: localQuery,
    });
    setQ(null);
    setLocalQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 한글 IME 조합 중 Enter는 조합 확정 이벤트와 충돌해 마지막 글자 중복을 유발할 수 있음
    if (e.nativeEvent.isComposing) {
      return;
    }
    if (e.key === "Enter") {
      const trimmedQuery = localQuery.trim();

      if (localQuery) {
        mixpanel.track("search@keyword", {
          page_name: "home",
          object_section: "header",
          object_id: localQuery,
          object_name: localQuery,
        });
      }
      e.currentTarget.blur();

      // 현재 경로가 루트가 아니면 루트로 이동
      if (pathname !== "/") {
        const searchParams = new URLSearchParams(serialize(filters));

        if (trimmedQuery) {
          searchParams.set("q", trimmedQuery);
        } else {
          searchParams.delete("q");
        }

        const queryString = searchParams.toString();
        router.push(queryString ? `/?${queryString}` : "/");
        return;
      }

      setLocalQuery(trimmedQuery);
      setQ(trimmedQuery);
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
        className="pl-10 h-12 rounded-full border-gray-200"
      />
      {localQuery !== "" && localQuery !== undefined && (
        <XIcon
          className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          onClick={handleClickX}
        />
      )}
    </div>
  );
}
