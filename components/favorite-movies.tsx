"use client"

import { useFavorites } from "@/context/favorites-context"
import MovieCard from "@/components/movie-card"

export default function FavoriteMovies() {
  const { favorites } = useFavorites()

  if (favorites.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        You haven't added any favorites yet. Browse movies and click the heart icon to add them here.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {favorites.map((movie) => (
        <MovieCard key={`fav-${movie.id}`} movie={movie} />
      ))}
    </div>
  )
}

