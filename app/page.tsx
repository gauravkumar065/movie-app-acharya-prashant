import { getTrendingMovies, getGenres } from "@/lib/tmdb"
import MovieGrid from "@/components/movie-grid"

export default async function Home() {
  const [moviesData, genresData] = await Promise.all([getTrendingMovies(), getGenres()])

  // Create a map of genre IDs to names for easier lookup
  const genreMap: { [key: number]: string } = {}
  genresData.genres.forEach((genre) => {
    genreMap[genre.id] = genre.name
  })

  return (
    <div className="container py-6 md:py-10">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Trending Movies</h1>
          <p className="text-muted-foreground">Discover the most popular movies this week</p>
        </div>

        <MovieGrid
          initialMovies={moviesData.results}
          genres={genreMap}
          loadMoreMovies={async (page) => {
            "use server"
            const data = await getTrendingMovies(page)
            return data.results
          }}
        />
      </div>
    </div>
  )
}

