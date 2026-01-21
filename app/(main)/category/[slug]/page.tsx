import { notFound } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  getContents,
  getContentsCount,
  GetContentsResult,
} from "@/lib/db/contents";
import { getAITools } from "@/lib/db/ai-tools";
import { getQueryClient } from "@/lib/get-query-client";
import { ContentFeedClient } from "@/app/(main)/search/_components/ContentFeedClient";
import {
  loadContentsSearchParams,
  normalizeSearchParams,
} from "@/app/(main)/search/search-params";
import { PageViewTracker } from "@/components/PageViewTracker";
import { PAGE_SIZE } from "@/lib/constants/content";
import { CATEGORIES } from "@/lib/constants/filters";
import { CategoryLinkList } from "../../search/_components/CategoryLinkList";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

/**
 * 유효한 카테고리 slug인지 확인합니다.
 */
function isValidCategorySlug(slug: string): boolean {
  return CATEGORIES.some((category) => category.id === slug);
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;

  // 유효하지 않은 카테고리 slug인 경우 404
  if (!isValidCategorySlug(slug)) {
    notFound();
  }

  // URL searchParams 로드 (추가 필터: 난이도, 소요시간, AI 툴)
  const contentsSearchParams = await loadContentsSearchParams(searchParams);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { cursor: _cursor, ...filterParams } = contentsSearchParams;

  // slug를 category로 설정 (URL params보다 slug 우선)
  const categoryFilterParams = {
    ...filterParams,
    category: slug,
  };

  const normalizedParams = normalizeSearchParams(categoryFilterParams);
  const queryClient = getQueryClient();

  await Promise.all([
    // Prefetch infinite query (첫 페이지만, cursor 기반)
    queryClient.prefetchInfiniteQuery<GetContentsResult>({
      queryKey: ["contents", normalizedParams, PAGE_SIZE],
      queryFn: ({ pageParam }) =>
        getContents({
          cursor: pageParam as string | null,
          pageSize: PAGE_SIZE,
          ...categoryFilterParams,
        }),
      initialPageParam: null,
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.nextCursor : undefined,
      pages: 1,
    }),
    // Prefetch count (정규화된 params 사용)
    queryClient.prefetchQuery({
      queryKey: ["contents-count", normalizedParams],
      queryFn: () => getContentsCount({ ...categoryFilterParams }),
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
            <div className="flex flex-wrap gap-3">
              <CategoryLinkList pageName={`category/${slug}`} />
            </div>
            {/* HydrationBoundary가 prefetch된 데이터를 클라이언트에 전달 */}
            <HydrationBoundary state={dehydrate(queryClient)}>
              <ContentFeedClient defaultCategory={slug} pageName="category" />
            </HydrationBoundary>
          </div>
        </div>
      </div>

      <PageViewTracker pageName="category" />
    </>
  );
}