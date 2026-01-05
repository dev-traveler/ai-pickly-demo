import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FilterResetProvider } from "@/components/FilterResetProvider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <FilterResetProvider>{children}</FilterResetProvider>
      </main>
      <Footer />
    </div>
  );
}
