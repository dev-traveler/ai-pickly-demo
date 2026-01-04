import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { SearchBar } from "@/components/SearchBar";
import { SubscribeNewsletterDialog } from "./SubscribeNewsletterDialog";

export function Header() {
  return (
    <header className="flex justify-center  sticky top-0 z-50 w-full bg-background shadow-xs">
      <div className="container flex h-16 max-w-screen-2xl p-4 items-center gap-6">
        <Logo black responsive />

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-auto hidden md:block">
          <SearchBar />
        </div>

        {/* Navigation */}
        <nav className="flex-1 md:flex-0 flex justify-end gap-2">
          <SubscribeNewsletterDialog
            triggerComponent={
              <Button
                className="bg-black font-bold text-white hover:bg-neutral-700 hover:text-white hover:cursor-pointer"
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
