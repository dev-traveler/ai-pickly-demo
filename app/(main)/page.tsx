import { NewsletterBanner } from "./_components/NewsletterBanner";
import { PageViewTracker } from "@/components/PageViewTracker";
import { CategoryFilter } from "./_components/CategoryFilter";

export default async function Home() {

  return (
    <>
      <div>
        <NewsletterBanner />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <CategoryFilter />
          </div>
        </div>
      </div>

      <PageViewTracker pageName="home" />
    </>
  );
}
