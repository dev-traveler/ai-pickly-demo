import { getContents, getContentsCount } from "@/lib/db/contents";
import { getAITools } from "@/lib/db/ai-tools";
import { NewsletterBanner } from "./NewsletterBanner";
import { ContentFeedClient } from "./ContentFeedClient";

export default async function Home() {
  // 초기 데이터 병렬 fetch (SSR)
  const [contents, totalCount, aiTools] = await Promise.all([
    getContents({ page: 1, pageSize: 20 }),
    getContentsCount({}),
    getAITools(),
  ]);

  return (
    <div>
      <NewsletterBanner />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* ContentFeedClient가 필터 오케스트레이션 담당 */}
          <ContentFeedClient
            initialData={contents}
            initialTotalCount={totalCount}
            aiTools={aiTools}
          />
        </div>
      </div>
    </div>
  );
}
