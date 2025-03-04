import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock, Calendar, Star } from "lucide-react"
import { getMovieDetails } from "@/lib/tmdb"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getImageUrl, formatDate } from "@/lib/utils"
import FavoriteButton from "./favorite-button"

interface MoviePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: MoviePageProps) {
  try {
    const movie = await getMovieDetails(Number.parseInt(params.id))

    return {
      title: `${movie.title} | MovieFlix`,
      description: movie.overview,
      openGraph: {
        images: [{ url: getImageUrl(movie.backdrop_path, "original") }],
      },
    }
  } catch (error) {
    return {
      title: "Movie Not Found | MovieFlix",
      description: "The requested movie could not be found.",
    }
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  try {
    const movie = await getMovieDetails(Number.parseInt(params.id))

    return (
      <div>
        {/* Backdrop Image */}
        <div className="relative h-[50vh] w-full">
          <Image
            src={getImageUrl(movie.backdrop_path, "original") || "/placeholder.svg"}
            alt={movie.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="container">
              <Link href="/" passHref>
                <Button variant="outline" size="sm" className="mb-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="container py-6 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
            {/* Poster and Actions */}
            <div className="space-y-4">
              <div className="relative aspect-[2/3] overflow-hidden rounded-lg border">
                <Image
                  src={getImageUrl(movie.poster_path, "w500") || "/placeholder.svg"}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>
              <FavoriteButton movie={movie} />
            </div>

            {/* Movie Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{movie.title}</h1>
                {movie.tagline && <p className="mt-2 text-xl italic text-muted-foreground">{movie.tagline}</p>}
              </div>

              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(movie.release_date)}</span>
                </div>
                {movie.runtime > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Overview</h2>
                <p className="text-muted-foreground">{movie.overview}</p>
              </div>

              {movie.production_companies.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Production</h2>
                  <div className="flex flex-wrap gap-4">
                    {movie.production_companies.map((company) => (
                      <div key={company.id} className="flex items-center gap-2">
                        {company.logo_path ? (
                          <Image
                            src={getImageUrl(company.logo_path, "w200") || "/placeholder.svg"}
                            alt={company.name}
                            width={50}
                            height={20}
                            className="object-contain"
                          />
                        ) : (
                          <span>{company.name}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
}

