import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ContentCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Thumbnail skeleton - aspect-video */}
      <div className="relative aspect-video bg-muted">
        <Skeleton className="w-full h-full rounded-none" />

        {/* Avatar skeleton - positioned bottom-right */}
        <div className="absolute bottom-3 right-3">
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Author and Date skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-1" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Title skeleton - 2 lines */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>

        {/* Description skeleton - 2 lines */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Meta information skeleton */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardContent>

      {/* Tags skeleton */}
      <CardFooter className="p-4 pt-0">
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-6 w-18 rounded-full" />
        </div>
      </CardFooter>
    </Card>
  );
}
