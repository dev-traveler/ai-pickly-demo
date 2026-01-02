import { getContents } from "@/lib/db/contents";
import { InfiniteContentGrid } from "@/components/InfiniteContentGrid";
import { CategoryFilter } from "@/components/CategoryFilter";
import { FilterBar } from "@/components/FilterBar";

export default async function Home() {
  const contents = await getContents({
    page: 1,
    pageSize: 20,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Category Filter */}
        <CategoryFilter />

        {/* Filter Bar with Results Count and Chips */}
        <FilterBar totalResults={contents.length} />

        {/* Content Grid */}
        <InfiniteContentGrid initialData={contents} />
      </div>
    </div>
  );
}
