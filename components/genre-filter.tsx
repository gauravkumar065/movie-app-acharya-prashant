"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Toggle } from "@/components/ui/toggle"
import type { Genre } from "@/lib/tmdb"
import { getGenreColor } from "@/lib/utils"

interface GenreFilterProps {
  genres: Genre[]
}

export default function GenreFilter({ genres }: GenreFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedGenres, setSelectedGenres] = useState<number[]>(() => {
    // Initialize from URL on first render only
    const genreParam = searchParams.get("genres")
    return genreParam ? genreParam.split(",").map(Number) : []
  })

  const toggleGenre = (genreId: number) => {
    // Create new array instead of modifying the existing one
    const newSelectedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter((id) => id !== genreId)
      : [...selectedGenres, genreId]

    // Update local state
    setSelectedGenres(newSelectedGenres)

    // Update URL directly without using useEffect
    const query = searchParams.get("q") || ""
    const url = newSelectedGenres.length
      ? `/search?q=${query}&genres=${newSelectedGenres.join(",")}`
      : `/search?q=${query}`

    router.push(url)
  }

  return (
    <div className="flex flex-wrap gap-2 my-4">
      {genres.map((genre) => {
        const isSelected = selectedGenres.includes(genre.id)
        const colorClasses = getGenreColor(genre.id)

        return (
          <Toggle
            key={genre.id}
            pressed={isSelected}
            onPressedChange={() => toggleGenre(genre.id)}
            className={`${isSelected ? colorClasses : "border-2"} transition-colors`}
            size="sm"
            aria-label={`Filter by ${genre.name}`}
          >
            {genre.name}
          </Toggle>
        )
      })}
    </div>
  )
}

