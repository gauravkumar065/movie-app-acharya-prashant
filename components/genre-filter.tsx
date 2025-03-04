"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Toggle } from "@/components/ui/toggle"
import type { Genre } from "@/lib/tmdb"

interface GenreFilterProps {
  genres: Genre[]
}

export default function GenreFilter({ genres }: GenreFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])

  useEffect(() => {
    const genreParam = searchParams.get("genres")
    if (genreParam) {
      setSelectedGenres(genreParam.split(",").map(Number))
    } else {
      setSelectedGenres([])
    }
  }, [searchParams])

  const toggleGenre = (genreId: number) => {
    const newSelectedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter((id) => id !== genreId)
      : [...selectedGenres, genreId]

    setSelectedGenres(newSelectedGenres)

    const query = searchParams.get("q") || ""
    const url = newSelectedGenres.length
      ? `/search?q=${query}&genres=${newSelectedGenres.join(",")}`
      : `/search?q=${query}`

    router.push(url)
  }

  return (
    <div className="flex flex-wrap gap-2 my-4">
      {genres.map((genre) => (
        <Toggle
          key={genre.id}
          pressed={selectedGenres.includes(genre.id)}
          onPressedChange={() => toggleGenre(genre.id)}
          variant="outline"
          size="sm"
          aria-label={`Filter by ${genre.name}`}
        >
          {genre.name}
        </Toggle>
      ))}
    </div>
  )
}

