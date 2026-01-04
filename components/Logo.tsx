"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFilterStore } from "@/lib/stores/filter-store";

interface LogoProps {
  darkMode: boolean;
}

export function Logo({ darkMode }: LogoProps) {
  const router = useRouter();
  const resetFilters = useFilterStore((state) => state.resetFilters);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    resetFilters();
    router.push("/");
  };

  return (
    <Link href="/" onClick={handleLogoClick}>
      <div className="relative w-38 h-8 flex items-center space-x-2">
        <Image
          src={darkMode ? "/logo-black.png" : "/logo-white.png"}
          alt="AI Pickly"
          className="object-center"
          fill
        />
      </div>
    </Link>
  );
}
