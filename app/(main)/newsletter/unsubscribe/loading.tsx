import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <div className="flex justify-center bg-black text-white p-8 md:p-12">
        <div className="container px-4 flex flex-col gap-2">
          <Skeleton className="h-7 md:h-9 w-48 md:w-64 bg-white/20" />
          <Skeleton className="h-4 md:h-5 w-full max-w-xl bg-white/10" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-52" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-12 w-full" />
          </div>

          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <Skeleton className="h-4 w-16" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-11/12" />
              <Skeleton className="h-3 w-10/12" />
              <Skeleton className="h-3 w-9/12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
