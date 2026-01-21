import type { SearchParams } from "nuqs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  getContents,
  getContentsCount,
  GetContentsResult,
} from "@/lib/db/contents";
import { getAITools } from "@/lib/db/ai-tools";
import { getQueryClient } from "@/lib/get-query-client";
import { ContentFeedClient } from "./_components/ContentFeedClient";
import {
  loadContentsSearchParams,
  normalizeSearchParams,
} from "./search-params";
import { PageViewTracker } from "@/components/PageViewTracker";
import { PAGE_SIZE } from "@/lib/constants/content";
import { HeroSearchSection } from "../_components/HeroSearchSection";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

/**
 * searchParams에 유효한 필터 값이 있는지 확인합니다.
 */
function hasSearchFilters(params: {
  q?: string | null;
  category?: string | null;
  difficulty?: string | null;
  time?: string | null;
  tool?: string | null;
}): boolean {
  return Boolean(params.q || params.category || params.difficulty || params.time || params.tool);
}

export default async function Home({ searchParams }: PageProps) {
  const contentsSearchParams = await loadContentsSearchParams(searchParams);
  // cursor는 prefetch에서 별도 관리, 필터 params만 추출
  const { cursor: _, ...filterParams } = contentsSearchParams;

  // searchParams가 없으면 HeroSearchSection만 보여주고 data fetch 안함
  if (!hasSearchFilters(filterParams)) {
    return (
      <>
        <HeroSearchSection />
        <PageViewTracker pageName="search" />
      </>
    );
  }

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
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {/* HydrationBoundary가 prefetch된 데이터를 클라이언트에 전달 */}
            <HydrationBoundary state={dehydrate(queryClient)}>
              <ContentFeedClient />
            </HydrationBoundary>
          </div>
        </div>
      </div>

      <PageViewTracker pageName="search" />
    </>
  );
}
