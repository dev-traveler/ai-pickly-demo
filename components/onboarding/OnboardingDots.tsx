import { cn } from "@/lib/utils";

interface OnboardingDotsProps {
  total: number;
  current: number;
}

export function OnboardingDots({ total, current }: OnboardingDotsProps) {
  return (
    <div className="flex gap-2 justify-center py-4">
      {Array.from({ length: total }).map((_, idx) => (
        <div
          key={idx}
          className={cn(
            "w-2 h-2 rounded-full transition-colors duration-300",
            idx === current ? "bg-primary" : "bg-gray-300"
          )}
        />
      ))}
    </div>
  );
}
