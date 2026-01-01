import { getContents } from "@/lib/data/contents";
import { ContentGrid } from "@/components/ContentGrid";

export default async function Home() {
  const contents = await getContents({
    page: 1,
    pageSize: 20,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl font-bold tracking-tight">
            실무에 바로 쓰는 AI 툴 가이드
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            마케터, 디자이너, 기획자를 위한 실전 AI 활용법
          </p>
        </div>

        {/* Content Grid */}
        <ContentGrid contents={contents} />
      </div>
    </div>
  );
}
