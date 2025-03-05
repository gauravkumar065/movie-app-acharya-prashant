import { notFound } from "next/navigation"
import { getMovieDetails } from "@/lib/tmdb"
import MovieDetail from "@/components/movie-detail"

export async function generateMetadata({ params }: { params: { id: string } }) {
  const movie = await getMovieDetails(params.id)

  if (!movie) {
    return {
      title: "Movie Not Found",
    }
  }

  return {
    title: `${movie.title} (${movie.release_date?.split("-")[0] || "Unknown"})`,
    description: movie.overview,
  }
}

export default async function MoviePage({ params }: { params: { id: string } }) {
  const movie = await getMovieDetails(params.id)

  if (!movie) {
    notFound()
  }

  return <MovieDetail movie={movie} />
}

