import { ContentCardSkeleton } from "@/components/ContentCardSkeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Hero Skeleton */}
        <div className="text-center space-y-4 py-8">
          <div className="h-12 bg-muted rounded-lg max-w-2xl mx-auto animate-pulse" />
          <div className="h-8 bg-muted rounded-lg max-w-xl mx-auto animate-pulse" />
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ContentCardSkeleton key={`loading-skeleton-${i}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
