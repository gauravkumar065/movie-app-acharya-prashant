import Image from "next/image"
import { notFound } from "next/navigation"
import { getMovieDetails } from "@/lib/tmdb"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import FavoriteButton from "@/components/favorite-button"

export async function generateMetadata({ params }: { params: { id: string } }) {
  const movie = await getMovieDetails(params.id)

  if (!movie) {
    return {
      title: "Movie Not Found",
    }
  }

  return {
    title: `${movie.title} (${movie.release_date.split("-")[0]})`,
    description: movie.overview,
  }
}

export default async function MoviePage({ params }: { params: { id: string } }) {
  const movie = await getMovieDetails(params.id)

  if (!movie) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h1 className="text-3xl font-bold">
              {movie.title} <span className="text-muted-foreground">({movie.release_date.split("-")[0]})</span>
            </h1>
            <FavoriteButton movie={movie} />
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {movie.genres.map((genre) => (
              <Badge key={genre.id} variant="secondary">
                {genre.name}
              </Badge>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="text-muted-foreground">{movie.overview}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-medium">Release Date</h3>
                <p className="text-muted-foreground">{formatDate(movie.release_date)}</p>
              </div>
              <div>
                <h3 className="font-medium">Rating</h3>
                <p className="text-muted-foreground">{movie.vote_average.toFixed(1)} / 10</p>
              </div>
              <div>
                <h3 className="font-medium">Runtime</h3>
                <p className="text-muted-foreground">{movie.runtime} minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

