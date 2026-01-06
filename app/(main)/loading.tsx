import { ContentGridSkeleton } from "@/app/(main)/ContentGrid";

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
        <ContentGridSkeleton />
      </div>
    </div>
  );
}
