import { Suspense } from "react";
import MovieGrid from "@/components/movie-grid";
import SearchBar from "@/components/search-bar";
import FilterSidebar from "@/components/filter-sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="mb-6 text-3xl font-bold">Discover Movies</h1>
      <Suspense fallback={<MovieGridSkeleton />}>
        <SearchBar />
      </Suspense>
      <div className="mt-6 flex flex-col gap-6 md:flex-row">
        <div className="w-full shrink-0 md:w-64">
          <Suspense fallback={<MovieGridSkeleton />}>
            <FilterSidebar />
          </Suspense>
        </div>

        <div className="flex-1">
          <Suspense fallback={<MovieGridSkeleton />}>
            <MovieGrid />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

function MovieGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array(10)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
    </div>
  );
}
