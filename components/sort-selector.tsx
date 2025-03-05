"use client"

import { useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown } from "lucide-react"
import type { SortOption } from "@/lib/tmdb"

const sortOptions = [
  { value: "popularity.desc", label: "Popularity (High to Low)" },
  { value: "popularity.asc", label: "Popularity (Low to High)" },
  { value: "vote_average.desc", label: "Rating (High to Low)" },
  { value: "vote_average.asc", label: "Rating (Low to High)" },
  { value: "release_date.desc", label: "Release Date (Newest)" },
  { value: "release_date.asc", label: "Release Date (Oldest)" },
]

export default function SortSelector() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [sort, setSort] = useState<SortOption>(() => {
    return (searchParams.get("sort") as SortOption) || "popularity.desc"
  })

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value !== "popularity.desc") {
      params.set("sort", value)
    } else {
      params.delete("sort")
    }

    setSort(value as SortOption)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      <Select value={sort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px] md:w-[220px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

