import Link from "next/link";
import { Bookmark } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* Logo */}
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-lg">AI Pickly</span>
          </Link>
        </div>

        {/* Navigation - 향후 확장 */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            {/* 내 보관함 Link */}
            <Link
              href="/my-library"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
            >
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline-block">내 보관함</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
