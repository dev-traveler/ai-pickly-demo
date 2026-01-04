import Link from "next/link";
import Image from "next/image";
import { Bookmark } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="relative w-38 h-8 flex items-center space-x-2"
        >
          <div className="">
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
          <Link
            href="/my-library"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
          >
            <Bookmark className="h-4 w-4" />
            <span className="hidden md:inline-block">내 보관함</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
