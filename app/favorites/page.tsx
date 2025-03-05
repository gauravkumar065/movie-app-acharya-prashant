"use client";

import { useState, useEffect } from "react";
import type { Movie } from "@/lib/tmdb";
import MovieCard from "@/components/movie-card";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]",
    );
    setFavorites(storedFavorites);
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className="container py-6 md:py-10">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Loading favorites...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 md:py-10">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Your Favorites</h1>
          <p className="text-muted-foreground">
            Movies you've saved to watch later
          </p>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5">
            {favorites.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <h2 className="text-xl font-semibold">No favorites yet</h2>
            <p className="text-muted-foreground mt-2">
              Start browsing and add movies to your favorites
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
