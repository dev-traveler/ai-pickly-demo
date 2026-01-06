import { FilterResetProvider } from "./FilterResetProvider";
import { Header } from "./Header";
import { Footer } from "./Footer";

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
