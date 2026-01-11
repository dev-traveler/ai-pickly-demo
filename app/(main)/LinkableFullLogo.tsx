"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { trackClick } from "@/lib/analytics/mixpanel";

interface LinkableFullLogoProps {
  black?: boolean;
}

export function LinkableFullLogo({ black = false }: LinkableFullLogoProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Determine section based on current location
    const section = pathname === "/" ? "header" : "footer";

    trackClick("logo", {
      page_name: "home",
      object_section: section,
      object_id: "logo",
      object_name: "logo",
    });

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
