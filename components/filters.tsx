"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Slider } from "@/components/ui/slider"
import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getGenreColor } from "@/lib/utils"
import type { Genre } from "@/lib/tmdb"
import { Filter, X } from "lucide-react"

interface FiltersProps {
  genres: Genre[]
}

const currentYear = new Date().getFullYear()
const MIN_YEAR = 1900
const MAX_YEAR = currentYear
const MIN_RATING = 0
const MAX_RATING = 10

export default function Filters({ genres }: FiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize state from URL params
  const [selectedGenres, setSelectedGenres] = useState<number[]>(() => {
    const genreParam = searchParams.get("genres")
    return genreParam ? genreParam.split(",").map(Number) : []
  })

  const [yearRange, setYearRange] = useState<[number, number]>(() => {
    const fromYear = searchParams.get("fromYear") ? Number.parseInt(searchParams.get("fromYear")!) : MIN_YEAR
    const toYear = searchParams.get("toYear") ? Number.parseInt(searchParams.get("toYear")!) : MAX_YEAR
    return [fromYear, toYear]
  })

  const [ratingRange, setRatingRange] = useState<[number, number]>(() => {
    const minRating = searchParams.get("minRating") ? Number.parseFloat(searchParams.get("minRating")!) : MIN_RATING
    const maxRating = searchParams.get("maxRating") ? Number.parseFloat(searchParams.get("maxRating")!) : MAX_RATING
    return [minRating, maxRating]
  })

  const [isFilterActive, setIsFilterActive] = useState(false)

  // Update state when URL params change, but only when they actually change
  useEffect(() => {
    const genreParam = searchParams.get("genres")
    const newGenres = genreParam ? genreParam.split(",").map(Number) : []

    const fromYear = searchParams.get("fromYear") ? Number.parseInt(searchParams.get("fromYear")!) : MIN_YEAR
    const toYear = searchParams.get("toYear") ? Number.parseInt(searchParams.get("toYear")!) : MAX_YEAR
    const newYearRange: [number, number] = [fromYear, toYear]

    const minRating = searchParams.get("minRating") ? Number.parseFloat(searchParams.get("minRating")!) : MIN_RATING
    const maxRating = searchParams.get("maxRating") ? Number.parseFloat(searchParams.get("maxRating")!) : MAX_RATING
    const newRatingRange: [number, number] = [minRating, maxRating]

    // Only update state if values have actually changed
    if (JSON.stringify(newGenres) !== JSON.stringify(selectedGenres)) {
      setSelectedGenres(newGenres)
    }

    if (newYearRange[0] !== yearRange[0] || newYearRange[1] !== yearRange[1]) {
      setYearRange(newYearRange)
    }

    if (newRatingRange[0] !== ratingRange[0] || newRatingRange[1] !== ratingRange[1]) {
      setRatingRange(newRatingRange)
    }
  }, [searchParams, selectedGenres, yearRange, ratingRange, yearRange[0], yearRange[1], ratingRange[0], ratingRange[1]])

  // Check if any filter is active
  useEffect(() => {
    const hasActiveFilters =
      selectedGenres.length > 0 ||
      yearRange[0] > MIN_YEAR ||
      yearRange[1] < MAX_YEAR ||
      ratingRange[0] > MIN_RATING ||
      ratingRange[1] < MAX_RATING

    setIsFilterActive(hasActiveFilters)
  }, [selectedGenres, yearRange, ratingRange])

  // Update URL with filter params
  const updateFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    // Preserve search query if it exists
    const searchQuery = searchParams.get("q")
    if (searchQuery) {
      params.set("q", searchQuery)
    }

    // Preserve sort if it exists
    const sort = searchParams.get("sort")
    if (sort) {
      params.set("sort", sort)
    }

    // Update genre params
    if (selectedGenres.length > 0) {
      params.set("genres", selectedGenres.join(","))
    } else {
      params.delete("genres")
    }

    // Update year range params
    if (yearRange[0] > MIN_YEAR) {
      params.set("fromYear", yearRange[0].toString())
    } else {
      params.delete("fromYear")
    }

    if (yearRange[1] < MAX_YEAR) {
      params.set("toYear", yearRange[1].toString())
    } else {
      params.delete("toYear")
    }

    // Update rating range params
    if (ratingRange[0] > MIN_RATING) {
      params.set("minRating", ratingRange[0].toString())
    } else {
      params.delete("minRating")
    }

    if (ratingRange[1] < MAX_RATING) {
      params.set("maxRating", ratingRange[1].toString())
    } else {
      params.delete("maxRating")
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  const toggleGenre = (genreId: number) => {
    setSelectedGenres((prev) => (prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]))
  }

  const resetFilters = () => {
    // Create new params with only search and sort
    const params = new URLSearchParams()

    // Preserve search query if it exists
    const searchQuery = searchParams.get("q")
    if (searchQuery) {
      params.set("q", searchQuery)
    }

    // Preserve sort if it exists
    const sort = searchParams.get("sort")
    if (sort) {
      params.set("sort", sort)
    }

    // Reset state
    setSelectedGenres([])
    setYearRange([MIN_YEAR, MAX_YEAR])
    setRatingRange([MIN_RATING, MAX_RATING])

    // Update URL
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          Filters
        </h2>
        {isFilterActive && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="text-red-500 hover:text-red-700">
            <X className="h-4 w-4 mr-1" />
            Reset
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["genres", "year", "rating"]} className="w-full">
        <AccordionItem value="genres">
          <AccordionTrigger>Genres</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2 mt-2">
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="year">
          <AccordionTrigger>Release Year</AccordionTrigger>
          <AccordionContent>
            <div className="px-2 pt-4 pb-2">
              <Slider
                min={MIN_YEAR}
                max={MAX_YEAR}
                step={1}
                value={yearRange}
                onValueChange={(value) => setYearRange(value as [number, number])}
                className="mb-6"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{yearRange[0]}</span>
                <span>{yearRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rating">
          <AccordionTrigger>Rating</AccordionTrigger>
          <AccordionContent>
            <div className="px-2 pt-4 pb-2">
              <Slider
                min={MIN_RATING}
                max={MAX_RATING}
                step={0.5}
                value={ratingRange}
                onValueChange={(value) => setRatingRange(value as [number, number])}
                className="mb-6"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{ratingRange[0].toFixed(1)}</span>
                <span>{ratingRange[1].toFixed(1)}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button onClick={updateFilters} className="w-full">
        Apply Filters
      </Button>
    </div>
  )
}

