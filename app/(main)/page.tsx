import { getContents, getContentsCount } from "@/lib/db/contents";
import { ContentFeedClient } from "@/components/ContentFeedClient";

export default async function Home() {
  // 초기 데이터 병렬 fetch (SSR)
  const [contents, totalCount] = await Promise.all([
    getContents({ page: 1, pageSize: 20 }),
    getContentsCount({}),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* ContentFeedClient가 필터 오케스트레이션 담당 */}
        <ContentFeedClient
          initialData={contents}
          initialTotalCount={totalCount}
        />
      </div>
    </div>
  );
}
