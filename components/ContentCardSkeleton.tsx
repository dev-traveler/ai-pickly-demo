import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ContentCardSkeleton() {
  return (
    <Card className="p-0 gap-4 border-none shadow-none overflow-hidden">
      {/* Thumbnail skeleton - aspect-video */}
      <div className="relative aspect-video mt-2">
        <Skeleton className="w-full h-full rounded-2xl" />

        {/* Avatar skeleton - positioned at bottom-right with double circle structure */}
        <div className="absolute -bottom-7 right-7">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-background">
            <Skeleton className="w-12 h-12 rounded-full" />
          </div>
        </div>
      </div>

      <CardContent className="px-4 space-y-4">
        {/* Author and Date skeleton */}
        <div className="flex items-center gap-2 text-sm">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-1" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Title skeleton - 2 lines, larger font */}
        <div className="space-y-2">
          <Skeleton className="h-7 w-full" />
        </div>

        {/* Description skeleton - 2 lines */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Meta information skeleton - 3 items */}
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardContent>

      {/* Tags skeleton */}
      <CardFooter className="p-4 pt-0">
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-5 w-20 rounded-md" />
          <Skeleton className="h-5 w-14 rounded-md" />
          <Skeleton className="h-5 w-18 rounded-md" />
        </div>
      </CardFooter>
    </Card>
  );
}
