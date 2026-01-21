import type { SearchParams } from "nuqs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  getContents,
  getContentsCount,
  GetContentsResult,
} from "@/lib/db/contents";
import { getAITools } from "@/lib/db/ai-tools";
import { getQueryClient } from "@/lib/get-query-client";
import { NewsletterBanner } from "../_components/NewsletterBanner";
import { ContentFeedClient } from "./_components/ContentFeedClient";
import {
  loadContentsSearchParams,
  normalizeSearchParams,
} from "./search-params";
import { PageViewTracker } from "@/components/PageViewTracker";
import { CategoryFilter } from "../_components/CategoryFilter";
import { PAGE_SIZE } from "@/lib/constants/content";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Home({ searchParams }: PageProps) {
  const contentsSearchParams = await loadContentsSearchParams(searchParams);
  // cursor는 prefetch에서 별도 관리, 필터 params만 추출
  const { cursor: _, ...filterParams } = contentsSearchParams;
  const normalizedParams = normalizeSearchParams(filterParams);
  const queryClient = getQueryClient();

  await Promise.all([
    // Prefetch infinite query (첫 페이지만, cursor 기반)
    queryClient.prefetchInfiniteQuery<GetContentsResult>({
      queryKey: ["contents", normalizedParams, PAGE_SIZE],
      queryFn: ({ pageParam }) =>
        getContents({
          cursor: pageParam as string | null,
          pageSize: PAGE_SIZE,
          ...filterParams,
        }),
      initialPageParam: null,
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.nextCursor : undefined,
      pages: 1,
    }),
    // Prefetch count (정규화된 params 사용)
    queryClient.prefetchQuery({
      queryKey: ["contents-count", normalizedParams],
      queryFn: () => getContentsCount({ ...filterParams }),
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
