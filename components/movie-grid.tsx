"use client";

import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { fetchMovies } from "@/lib/tmdb";
import MovieCard from "@/components/movie-card";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Film,
  Loader2,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useIntersection } from "@/hooks/use-intersection";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function MovieGrid() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const genre = searchParams.get("genre") || "";
  const year = searchParams.get("year") || "";
  const rating = searchParams.get("rating") || "";

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    const filters = [];
    if (query) filters.push(`Search: ${query}`);
    if (genre) filters.push(`Genre: ${genre}`);
    if (year) filters.push(`Year: ${year}`);
    if (rating) filters.push(`Rating: ${rating}+`);
    setActiveFilters(filters);
  }, [query, genre, year, rating]);

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
      <div className="flex flex-col items-center justify-center space-y-4 p-12">
        <Loader2 className="text-primary h-12 w-12 animate-spin" />
        <p className="text-muted-foreground animate-pulse">Loading movies...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <Alert variant="destructive" className="mx-auto max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          We couldn't load the movies. Please try again later or check your
          connection.
        </AlertDescription>
        <Button
          variant="outline"
          className="mt-4 w-full"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </Alert>
    );
  }

  const moviesMap = new Map();

  data.pages.forEach((page) => {
    page.results.forEach((movie: any) => {
      if (!moviesMap.has(movie.id)) {
        moviesMap.set(movie.id, movie);
      }
    });
  });

  const movies = Array.from(moviesMap.values());
  const totalResults = data.pages[0]?.total_results || 0;

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 rounded-lg border border-dashed p-12 text-center">
        <Search className="text-muted-foreground h-12 w-12" />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">No movies found</h3>
          <p className="text-muted-foreground max-w-md">
            We couldn't find any movies matching your criteria. Try adjusting
            your search or filters.
          </p>
        </div>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Clear All Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activeFilters.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="text-muted-foreground h-4 w-4" />
          <span className="text-muted-foreground text-sm">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="font-normal">
              {filter}
            </Badge>
          ))}
          <Badge variant="outline" className="ml-auto cursor-pointer">
            {totalResults.toLocaleString()} results
          </Badge>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
        >
          {movies.map((movie, index) => (
            <motion.div
              key={`grid-${movie.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, duration: 0.3 }}
            >
              <MovieCard movie={movie} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <div
        ref={loadMoreRef}
        className="mt-8 flex flex-col items-center justify-center space-y-4 py-8"
      >
        {isFetchingNextPage ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="text-primary h-6 w-6 animate-spin" />
            <p className="text-muted-foreground text-sm">
              Loading more movies...
            </p>
          </div>
        ) : hasNextPage ? (
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            className="group relative overflow-hidden"
          >
            <span className="relative z-10">Load More Movies</span>
            <span className="bg-primary/10 absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" />
          </Button>
        ) : (
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-dashed p-6 text-center">
            <Film className="text-muted-foreground h-6 w-6" />
            <p className="text-muted-foreground text-sm">
              You've reached the end of the list
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
