"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

interface LinkableFullLogoProps {
  black?: boolean;
}

export function LinkableFullLogo({ black = false }: LinkableFullLogoProps) {
  const router = useRouter();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // resetFilters();
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
