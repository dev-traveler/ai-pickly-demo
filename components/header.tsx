import Link from "next/link";
import Image from "next/image";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="flex justify-center  sticky top-0 z-50 w-full bg-background shadow-xs">
      <div className="container flex h-16 max-w-screen-2xl p-4 items-center gap-6">
        {/* Logo */}
        <Link href="/">
          <div className="relative w-38 h-8 flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="AI Pickly"
              className="object-center"
              fill
            />
          </div>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-auto">
          <SearchBar />
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            className="rounded-full bg-gray-900 hover:bg-gray-800 hidden sm:inline-flex"
          >
            AI 뉴스레터 구독
          </Button>
        </nav>
      </div>
    </header>
  );
}
