"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import mixpanel from "mixpanel-browser";

interface LinkableFullLogoProps {
  black?: boolean;
  section: "header" | "footer";
}

export function LinkableFullLogo({
  black = false,
  section,
}: LinkableFullLogoProps) {
  const router = useRouter();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    mixpanel.track("click@logo", {
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
