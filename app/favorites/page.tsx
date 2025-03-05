import { Suspense } from "react"
import FavoriteMovies from "@/components/favorite-movies"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Favorite Movies",
  description: "Your saved favorite movies",
}

export default function FavoritesPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Your Favorites</h1>

      <Suspense fallback={<FavoritesSkeleton />}>
        <FavoriteMovies />
      </Suspense>
    </main>
  )
}

function FavoritesSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array(5)
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

