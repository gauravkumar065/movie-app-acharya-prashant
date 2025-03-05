"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { fetchGenres } from "@/lib/tmdb"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

export default function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [genre, setGenre] = useState(searchParams.get("genre") || "")
  const [year, setYear] = useState(searchParams.get("year") || "")
  const [rating, setRating] = useState(searchParams.get("rating") || "")

  const { data: genres = [] } = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
  })

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i)

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (genre) {
      params.set("genre", genre)
    } else {
      params.delete("genre")
    }

    if (year) {
      params.set("year", year)
    } else {
      params.delete("year")
    }

    if (rating) {
      params.set("rating", rating)
    } else {
      params.delete("rating")
    }

    router.push(`/?${params.toString()}`)
  }

  const resetFilters = () => {
    setGenre("")
    setYear("")
    setRating("")

    const params = new URLSearchParams(searchParams.toString())
    params.delete("genre")
    params.delete("year")
    params.delete("rating")

    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="genre">Genre</Label>
        <Select value={genre} onValueChange={setGenre}>
          <SelectTrigger id="genre">
            <SelectValue placeholder="All Genres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">All Genres</SelectItem>
            {genres.map((genre) => (
              <SelectItem key={genre.id} value={genre.id.toString()}>
                {genre.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="year">Release Year</Label>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger id="year">
            <SelectValue placeholder="Any Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Any Year</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <Label htmlFor="rating">Minimum Rating</Label>
          <span className="text-sm text-muted-foreground">{rating ? `${rating}/10` : "Any"}</span>
        </div>
        <Slider
          id="rating"
          min={0}
          max={10}
          step={1}
          value={rating ? [Number.parseInt(rating)] : [0]}
          onValueChange={(value) => setRating(value[0].toString())}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Button onClick={applyFilters}>Apply Filters</Button>
        <Button variant="outline" onClick={resetFilters}>
          Reset
        </Button>
      </div>
    </div>
  )
}

