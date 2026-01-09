"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { useFilterStore } from "@/lib/stores/filter-store";
import { cn } from "@/lib/utils";
import { trackLogoClick } from "@/lib/tracking";

interface LinkableFullLogoProps {
  black?: boolean;
  location?: "header" | "footer";
}

export function LinkableFullLogo({
  black = false,
  location = "header",
}: LinkableFullLogoProps) {
  const router = useRouter();
  const resetFilters = useFilterStore((state) => state.resetAllFilters);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    trackLogoClick(location);
    resetFilters();
    router.push("/");
  };

  return (
    <Link
      href="/"
      onClick={handleLogoClick}
      className="flex justify-center items-center space-x-2"
    >
      <Logo black={black} />

      <div
        className={cn("text-2xl font-bold text-white", black && "text-black")}
      >
        AI Pickly
      </div>
    </Link>
  );
}
