"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [query, setQuery] = useState(initialQuery)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateSearchQuery(query)
  }

  const clearSearch = () => {
    setQuery("")
    updateSearchQuery("")
  }

  const updateSearchQuery = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set("q", value)
    } else {
      params.delete("q")
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Input
          type="search"
          placeholder="Search for movies..."
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="pr-20"
          aria-label="Search for movies"
        />

        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="absolute right-10 top-0 h-10 w-10"
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}

        <Button
          type="submit"
          variant="default"
          size="icon"
          className="absolute right-0 top-0 h-10 w-10 rounded-l-none"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}

