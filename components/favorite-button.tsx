"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Movie } from "@/types"
import { useFavorites } from "@/context/favorites-context"
import type React from "react"

interface FavoriteButtonProps {
  movie: Movie
}

export default function FavoriteButton({ movie }: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const favorite = isFavorite(movie.id)

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (favorite) {
      removeFavorite(movie.id)
    } else {
      addFavorite(movie)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`rounded-full ${favorite ? "text-primary" : "text-muted-foreground"} transition-colors duration-200`}
      onClick={toggleFavorite}
      aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={`h-5 w-5 ${favorite ? "fill-current" : ""} transition-all duration-200`} />
    </Button>
  )
}

