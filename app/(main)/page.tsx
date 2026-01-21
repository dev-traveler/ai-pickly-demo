import { ContentCardSection } from "@/components/ContentCardSection";
import { OnboardingDialog } from "@/components/onboarding/OnboardingDialog";
import { PageViewTracker } from "@/components/PageViewTracker";
import { NewsletterBanner } from "./_components/NewsletterBanner";
import { getContents } from "@/lib/db/contents";

export default async function Home() {
  const recentContents = await getContents({ pageSize: 4, sort: "popular" });

  return (
    <>
      <div>
        <NewsletterBanner />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
              <ContentCardSection title={"최근 업로드된 콘텐츠"} contents={recentContents.data} />
          </div>
        </div>
      </div>

      {/* 온보딩 다이얼로그 */}
      <OnboardingDialog />
      <PageViewTracker pageName="home" />
    </>
  );
}
