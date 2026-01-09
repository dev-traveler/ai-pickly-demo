import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/app/(main)/SearchBar";
import { SearchBarSkeleton } from "@/app/(main)/SearchBarSkeleton";
import { SubscribeNewsletterDialog } from "@/app/(main)/SubscribeNewsletterDialog";
import { LinkableFullLogo } from "./LinkableFullLogo";

export function Header() {
  return (
    <header className="flex justify-center sticky top-0 z-50 w-full bg-background shadow-xs">
      <div className="container flex flex-col md:flex-row max-w-screen-2xl p-4 md:h-16 md:items-center gap-3 md:gap-6">
        {/* First Row on Mobile: Logo and Button */}
        <div className="flex items-center justify-between md:contents">
          <LinkableFullLogo black />

          {/* Navigation - visible on mobile */}
          <nav className="md:hidden">
            <SubscribeNewsletterDialog
              triggerComponent={
                <Button
                  className="bg-black font-bold text-white hover:bg-neutral-700 hover:text-white hover:cursor-pointer whitespace-nowrap"
                  variant="outline"
                >
                  AI 뉴스레터 구독
                </Button>
              }
            />
          </nav>
        </div>

        {/* Second Row on Mobile: Search Bar */}
        <div className="flex-1 max-w-2xl mx-auto w-full md:w-auto">
          <Suspense fallback={<SearchBarSkeleton />}>
            <SearchBar />
          </Suspense>
        </div>

        {/* Navigation - visible on desktop */}
        <nav className="hidden md:flex justify-end gap-2">
          <SubscribeNewsletterDialog
            triggerComponent={
              <Button
                className="bg-black font-bold text-white hover:bg-neutral-700 hover:text-white hover:cursor-pointer whitespace-nowrap"
                variant="outline"
              >
                AI 뉴스레터 구독
              </Button>
            }
          />
        </nav>
      </div>
    </header>
  );
}
