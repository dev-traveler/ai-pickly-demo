"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import mixpanel from "mixpanel-browser";

export function HeroSearchSection() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      mixpanel.track("search@keyword", {
        page_name: "home",
        object_section: "hero",
        object_id: trimmedQuery,
        object_name: trimmedQuery,
      });
    }

    const searchParams = new URLSearchParams();
    if (trimmedQuery) {
      searchParams.set("q", trimmedQuery);
    }

    const queryString = searchParams.toString();
    router.push(queryString ? `/search?${queryString}` : "/search");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) {
      return;
    }
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6">
          {/* 메인 타이틀 */}
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
            <span className="bg-linear-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
              원하는 작업에 맞는
            </span>
            <br />
            <span className="bg-linear-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
              AI 툴을 찾아보세요
            </span>
          </h1>

          {/* 서브 타이틀 */}
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <p className="text-gray-500 text-base md:text-lg max-w-xs sm:max-w-md md:max-w-xl leading-relaxed">
              업무를 입력하면 최적의 AI 툴과
              <br className="sm:hidden" />
              {" "}사용 방법을 알려드립니다
            </p>
            <p className="text-gray-500 text-sm max-w-xs sm:max-w-md text-center leading-relaxed">
              예: 프레젠테이션 만들기, 이미지 배경 제거, 영상 편집...
            </p>
          </div>

          {/* 검색 폼 */}
          <div className="w-full max-w-2xl mt-8">
            <div className="relative flex items-center bg-white rounded-full shadow-lg border border-gray-100 p-1.5 pl-4">
              <Search className="h-5 w-5 text-gray-400 shrink-0" />
              <Input
                type="text"
                placeholder="어떤 업무가 필요하신가요?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 border-0 shadow-none focus-visible:ring-0 text-base placeholder:text-gray-400"
              />
              <Button
                onClick={handleSearch}
                className="rounded-full px-6 py-2 h-10 bg-linear-to-r from-blue-500 via-indigo-500 to-violet-500 hover:from-blue-600 hover:via-indigo-600 hover:to-violet-600 text-white font-medium shrink-0"
              >
                검색
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
