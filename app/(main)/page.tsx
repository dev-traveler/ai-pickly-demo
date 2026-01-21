import { Suspense } from "react";
import { ContentCardSection, ContentCardSectionSkeleton } from "@/components/ContentCardSection";
import { PageViewTracker } from "@/components/PageViewTracker";
import { NewsletterBanner } from "./_components/NewsletterBanner";
import { getContents } from "@/lib/db/contents";
import { HeroSearchSection } from "./_components/HeroSearchSection";
import { OnboardingDialog2 } from "@/components/onboarding2/OnboardingDialog2";

export default async function Home() {
  const recentContents = await getContents({ pageSize: 4, sort: "latest" });

  return (
    <>
      <div>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <HeroSearchSection />
            <Suspense fallback={<ContentCardSectionSkeleton itemCount={4} />}>
              <ContentCardSection title={"최근 업로드된 콘텐츠"} contents={recentContents.data} />
            </Suspense>
          </div>
        </div>
        <NewsletterBanner />
      </div>

      {/* 온보딩 다이얼로그 */}
      {/* <OnboardingDialog /> */}
      <OnboardingDialog2 />
      <PageViewTracker pageName="home" />
    </>
  );
}
