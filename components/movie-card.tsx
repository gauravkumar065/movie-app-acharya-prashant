"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getImageUrl } from "@/lib/utils"
import type { Movie } from "@/lib/tmdb"

interface MovieCardProps {
  movie: Movie
  genres?: { [key: number]: string }
}

export default function MovieCard({ movie, genres }: MovieCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    // Check if movie is in favorites
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    setIsFavorite(favorites.some((fav: Movie) => fav.id === movie.id))
  }, [movie.id])

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")

    if (isFavorite) {
      const updatedFavorites = favorites.filter((fav: Movie) => fav.id !== movie.id)
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
    } else {
      favorites.push(movie)
      localStorage.setItem("favorites", JSON.stringify(favorites))
    }

    setIsFavorite(!isFavorite)
  }

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "Unknown"

  return (
    <Link href={`/movies/${movie.id}`} passHref>
      <Card className="overflow-hidden h-full transition-all hover:shadow-lg">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={getImageUrl(movie.poster_path) || "/placeholder.svg"}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform hover:scale-105"
            priority={false}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm hover:bg-background/70"
            onClick={toggleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-1">{movie.title}</h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-muted-foreground">{releaseYear}</span>
            <Badge variant="secondary" className="text-xs">
              {movie.vote_average.toFixed(1)}
            </Badge>
          </div>
          {genres && movie.genre_ids && movie.genre_ids.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {movie.genre_ids.slice(0, 2).map(
                (genreId) =>
                  genres[genreId] && (
                    <Badge key={genreId} variant="outline" className="text-xs">
                      {genres[genreId]}
                    </Badge>
                  ),
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

