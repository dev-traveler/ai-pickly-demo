import { Header } from "./_components/Header";
import { Footer } from "./_components/Footer";
import { OnboardingDialog2 } from "@/components/onboarding2/OnboardingDialog2";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <OnboardingDialog2 />
    </>
  );
}
