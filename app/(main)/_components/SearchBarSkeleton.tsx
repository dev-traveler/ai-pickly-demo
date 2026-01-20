import { Skeleton } from "@/components/ui/skeleton";

export function SearchBarSkeleton() {
  return (
    <div className="relative w-full max-w-2xl">
      <Skeleton className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full" />
      <Skeleton className="h-12 w-full rounded-full" />
      <Skeleton className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full" />
    </div>
  );
}
