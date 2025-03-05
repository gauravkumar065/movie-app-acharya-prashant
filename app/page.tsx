import { Suspense } from "react";
import { getGenres, getFilteredMovies } from "@/lib/tmdb";
import MovieGrid from "@/components/movie-grid";
import Filters from "@/components/filters";
import SearchBar from "@/components/search-bar";
import SortSelector from "@/components/sort-selector";
import { Skeleton } from "@/components/ui/skeleton";
import type { SortOption } from "@/lib/tmdb";

interface HomePageProps {
  searchParams: {
    q?: string;
    genres?: string;
    fromYear?: string;
    toYear?: string;
    minRating?: string;
    maxRating?: string;
    sort?: string;
  };
}

export default async function Home({ searchParams }: HomePageProps) {
  const [genresData] = await Promise.all([getGenres()]);

  // Parse filter parameters
  const searchQuery = searchParams.q || "";
  const genreIds = searchParams.genres
    ? searchParams.genres.split(",").map(Number)
    : undefined;
  const fromYear = searchParams.fromYear
    ? Number.parseInt(searchParams.fromYear)
    : undefined;
  const toYear = searchParams.toYear
    ? Number.parseInt(searchParams.toYear)
    : undefined;
  const minRating = searchParams.minRating
    ? Number.parseFloat(searchParams.minRating)
    : undefined;
  const maxRating = searchParams.maxRating
    ? Number.parseFloat(searchParams.maxRating)
    : undefined;
  const sortBy = (searchParams.sort as SortOption) || "popularity.desc";

  // Determine if search or filters are active
  const isSearchActive = searchQuery.length > 0;
  const hasActiveFilters =
    genreIds || fromYear || toYear || minRating || maxRating;

  // Fetch movies based on search or filters
  const moviesData = await getFilteredMovies(1, {
    query: searchQuery,
    genres: genreIds,
    fromYear,
    toYear,
    minRating,
    maxRating,
    sortBy,
  });

  // Create a map of genre IDs to names for easier lookup
  const genreMap: { [key: number]: string } = {};
  genresData.genres.forEach((genre) => {
    genreMap[genre.id] = genre.name;
  });

  // Determine page title and description
  let pageTitle = "Trending Movies";
  let pageDescription = "Discover the most popular movies this week";

  if (isSearchActive) {
    pageTitle = `Search Results: "${searchQuery}"`;
    pageDescription = `Movies matching your search for "${searchQuery}"`;
  } else if (hasActiveFilters) {
    pageTitle = "Filtered Movies";
    pageDescription = "Movies matching your selected filters";
  }

  return (
    <div className="container py-6 md:py-10">
      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[250px_1fr]">
        {/* Filters Sidebar */}
        <div className="order-2 md:order-1">
          <Filters genres={genresData.genres} />
        </div>

        {/* Main Content */}
        <div className="order-1 space-y-6 md:order-2">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
              <p className="text-muted-foreground">{pageDescription}</p>
            </div>
            <SortSelector />
          </div>

          <Suspense fallback={<MovieGridSkeleton />}>
            {moviesData.results.length > 0 ? (
              <MovieGrid
                initialMovies={moviesData.results}
                genres={genreMap}
                loadMoreMovies={async (page) => {
                  "use server";
                  const data = await getFilteredMovies(page, {
                    query: searchQuery,
                    genres: genreIds,
                    fromYear,
                    toYear,
                    minRating,
                    maxRating,
                    sortBy,
                  });
                  return data.results;
                }}
              />
            ) : (
              <div className="py-10 text-center">
                <h2 className="text-xl font-semibold">No movies found</h2>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function MovieGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-[300px] w-full rounded-md" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}
