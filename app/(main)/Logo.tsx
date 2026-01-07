"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFilterStore } from "@/lib/stores/filter-store";
import { cn } from "@/lib/utils";

interface LogoProps {
  black?: boolean;
  responsive?: boolean;
}

export function Logo({ black = false, responsive = false }: LogoProps) {
  const router = useRouter();
  const resetFilters = useFilterStore((state) => state.resetAllFilters);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    resetFilters();
    router.push("/");
  };

  return (
    <Link
      href="/"
      onClick={handleLogoClick}
      className="flex justify-center items-center space-x-2"
    >
      <div className="relative w-6 h-6 flex items-center space-x-2">
        <Image
          src={black ? "/logo-black.png" : "/logo-white.png"}
          alt="AI Pickly"
          className="object-center"
          fill
        />
      </div>

      <div
        className={cn(
          "text-2xl font-bold text-white",
          black && "text-black",
          responsive && "hidden md:block"
        )}
      >
        AI Pickly
      </div>
    </Link>
  );
}
