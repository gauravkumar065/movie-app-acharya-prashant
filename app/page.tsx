import { Suspense } from "react"
import MovieGrid from "@/components/movie-grid"
import SearchBar from "@/components/search-bar"
import FilterSidebar from "@/components/filter-sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Discover Movies</h1>

      <SearchBar />

      <div className="flex flex-col md:flex-row gap-6 mt-6">
        <div className="w-full md:w-64 shrink-0">
          <FilterSidebar />
        </div>

        <div className="flex-1">
          <Suspense fallback={<MovieGridSkeleton />}>
            <MovieGrid />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

function MovieGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array(10)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="w-full aspect-[2/3] rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
    </div>
  )
}

