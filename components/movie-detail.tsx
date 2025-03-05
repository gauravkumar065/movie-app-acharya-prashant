"use client"

import Image from "next/image"
import { useState } from "react"
import { Calendar, Clock, Star, ExternalLink, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface MovieDetailProps {
  movie: any
}

export default function MovieDetail({ movie }: MovieDetailProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  // Format runtime to hours and minutes
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* Backdrop with gradient overlay */}
      <div className="absolute inset-0 -z-10 h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-background/90 z-10" />
        {movie.backdrop_path && (
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt=""
            fill
            className={cn(
              "object-cover object-center transition-opacity duration-1000",
              isImageLoaded ? "opacity-100" : "opacity-0",
            )}
            onLoad={() => setIsImageLoaded(true)}
            priority
          />
        )}
      </div>

      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {/* Poster */}
          <div className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-2xl md:sticky md:top-24 self-start">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 300px"
              priority
            />
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-4xl font-bold tracking-tight">{movie.title}</h1>
                {movie.tagline && <p className="text-xl italic text-muted-foreground mt-2">"{movie.tagline}"</p>}
              </motion.div>

              <div className="flex flex-wrap gap-2 mt-4">
                {movie.genres.map((genre: any) => (
                  <Badge key={genre.id} variant="secondary" className="text-xs">
                    {genre.name}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-muted-foreground">
                {movie.release_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(movie.release_date)}</span>
                  </div>
                )}

                {movie.runtime > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                )}

                {movie.vote_average > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium text-foreground">{movie.vote_average.toFixed(1)}</span>
                    <span className="text-xs">({movie.vote_count} votes)</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Overview */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Overview</h2>
              <p className="text-muted-foreground leading-relaxed">{movie.overview}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Play className="h-4 w-4" />
                    Watch Trailer
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] p-0 bg-black">
                  <div className="aspect-video w-full">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                      title="Movie Trailer"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="border-0"
                    ></iframe>
                  </div>
                </DialogContent>
              </Dialog>

              {movie.homepage && (
                <Button variant="outline" className="gap-2" asChild>
                  <a href={movie.homepage} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Official Site
                  </a>
                </Button>
              )}
            </div>

            <Separator />

            {/* Additional Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Production Companies */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Production</h3>
                <div className="flex flex-wrap gap-6">
                  {movie.production_companies.map((company: any) => (
                    <div key={company.id} className="flex flex-col items-center">
                      {company.logo_path ? (
                        <div className="relative h-12 w-24 bg-white/5 rounded-md overflow-hidden">
                          <Image
                            src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                            alt={company.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-24 bg-muted flex items-center justify-center rounded-md">
                          <span className="text-xs text-muted-foreground text-center px-2">{company.name}</span>
                        </div>
                      )}
                      <span className="text-xs text-muted-foreground mt-2">{company.origin_country}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages and Countries */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Details</h3>
                <dl className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                  <dt className="text-muted-foreground">Status:</dt>
                  <dd>{movie.status}</dd>

                  <dt className="text-muted-foreground">Languages:</dt>
                  <dd>{movie.spoken_languages.map((lang: any) => lang.english_name).join(", ")}</dd>

                  <dt className="text-muted-foreground">Countries:</dt>
                  <dd>{movie.production_countries.map((country: any) => country.name).join(", ")}</dd>

                  {movie.budget > 0 && (
                    <>
                      <dt className="text-muted-foreground">Budget:</dt>
                      <dd>${movie.budget.toLocaleString()}</dd>
                    </>
                  )}

                  {movie.revenue > 0 && (
                    <>
                      <dt className="text-muted-foreground">Revenue:</dt>
                      <dd>${movie.revenue.toLocaleString()}</dd>
                    </>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

