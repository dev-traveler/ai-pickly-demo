import type { SearchParams } from "nuqs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getContents, getContentsCount } from "@/lib/db/contents";
import { getAITools } from "@/lib/db/ai-tools";
import { getQueryClient } from "@/lib/get-query-client";
import { NewsletterBanner } from "../_components/NewsletterBanner";
import { ContentFeedClient } from "./_components/ContentFeedClient";
import { loadContentsSearchParams } from "./search-params";
import { PageViewTracker } from "@/components/PageViewTracker";
import { CategoryFilter } from "../_components/CategoryFilter";
import { PAGE_SIZE } from "@/lib/constants/content";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Home({ searchParams }: PageProps) {
  const contentsSearchParams = await loadContentsSearchParams(searchParams);
  const queryClient = getQueryClient();

  await Promise.all([
    // Prefetch infinite query (첫 페이지만)
    queryClient.prefetchInfiniteQuery({
      queryKey: ["contents", { ...contentsSearchParams }, PAGE_SIZE],
      queryFn: ({ pageParam = 1 }) =>
        getContents({
          page: pageParam,
          pageSize: PAGE_SIZE,
          ...contentsSearchParams,
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < PAGE_SIZE) return undefined;
        return allPages.length + 1;
      },
      pages: 1,
    }),
    // Prefetch count
    queryClient.prefetchQuery({
      queryKey: ["contents-count", { ...contentsSearchParams }],
      queryFn: () => getContentsCount({ ...contentsSearchParams }),
    }),
    // Prefetch AI tools
    queryClient.prefetchQuery({
      queryKey: ["ai-tools"],
      queryFn: () => getAITools(),
    }),
  ]);

  return (
    <>
      <div>
        <NewsletterBanner />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <CategoryFilter />

            {/* HydrationBoundary가 prefetch된 데이터를 클라이언트에 전달 */}
            <HydrationBoundary state={dehydrate(queryClient)}>
              <ContentFeedClient />
            </HydrationBoundary>
          </div>
        </div>
      </div>

      <PageViewTracker pageName="home" />
    </>
  );
}
