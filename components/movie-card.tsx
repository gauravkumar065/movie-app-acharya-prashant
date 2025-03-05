"use client"

import Image from "next/image"
import Link from "next/link"
import type { Movie } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import FavoriteButton from "@/components/favorite-button"

interface MovieCardProps {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Card className="overflow-hidden group">
      <div className="relative">
        <Link href={`/movies/${movie.id}`} className="block">
          <div className="aspect-[2/3] relative overflow-hidden">
            <Image
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "/placeholder.svg?height=750&width=500"
              }
              alt={movie.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          </div>
        </Link>
        <div className="absolute top-2 right-2">
          <FavoriteButton movie={movie} />
        </div>
      </div>
      <CardContent className="p-3">
        <Link href={`/movies/${movie.id}`} className="block">
          <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">{movie.title}</h3>
          <p className="text-sm text-muted-foreground">{movie.release_date?.split("-")[0] || "Unknown"}</p>
        </Link>
      </CardContent>
    </Card>
  )
}

