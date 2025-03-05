"use client";

import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { fetchMovies } from "@/lib/tmdb";
import MovieCard from "@/components/movie-card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useIntersection } from "@/hooks/use-intersection";

export default function MovieGrid() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const genre = searchParams.get("genre") || "";
  const year = searchParams.get("year") || "";
  const rating = searchParams.get("rating") || "";

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersection(loadMoreRef, {
    rootMargin: "200px",
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["movies", query, genre, year, rating],
      queryFn: ({ pageParam = 1 }) =>
        fetchMovies({
          page: pageParam,
          query,
          genre: genre ? Number(genre) : undefined,
          year: year ? Number(year) : undefined,
          rating: rating ? Number(rating) : undefined,
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "pending") {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-destructive p-8 text-center">
        Error loading movies
      </div>
    );
  }

  // Create a map to deduplicate movies by ID
  const moviesMap = new Map();

  data.pages.forEach((page) => {
    page.results.forEach((movie: any) => {
      // Only add the movie if it's not already in the map
      if (!moviesMap.has(movie.id)) {
        moviesMap.set(movie.id, movie);
      }
    });
  });

  // Convert the map back to an array
  const movies = Array.from(moviesMap.values());

  if (movies.length === 0) {
    return (
      <div className="text-muted-foreground p-8 text-center">
        No movies found. Try adjusting your search or filters.
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {movies.map((movie) => (
          <MovieCard key={`grid-${movie.id}`} movie={movie} />
        ))}
      </div>

      <div ref={loadMoreRef} className="flex justify-center p-8">
        {isFetchingNextPage ? (
          <Loader2 className="animate-spin" />
        ) : hasNextPage ? (
          <Button variant="outline" onClick={() => fetchNextPage()}>
            Load More
          </Button>
        ) : (
          <p className="text-muted-foreground text-sm">
            No more movies to load
          </p>
        )}
      </div>
    </div>
  );
}
