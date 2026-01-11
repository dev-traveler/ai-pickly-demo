import Image from "next/image";
import { cn } from "@/lib/utils";
import { getOptimizedImageProps } from "@/lib/image-utils";

interface LogoProps {
  className?: string | undefined;
  black?: boolean;
}

export function Logo({ className, black = false }: LogoProps) {
  return (
    <div className={cn("relative w-6 h-6", className)}>
      <Image
        src={black ? "/logo-black.png" : "/logo-white.png"}
        alt="AI Pickly"
        className="object-center"
        fill
        {...getOptimizedImageProps({ priority: true })}
      />
    </div>
  );
}
