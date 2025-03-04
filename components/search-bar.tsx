"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { debounce } from "@/lib/utils"

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [query, setQuery] = useState(initialQuery)

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (value) {
        router.push(`/search?q=${encodeURIComponent(value)}`)
      } else {
        router.push("/search")
      }
    }, 500),
    [],
  )

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    debouncedSearch(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Input
          type="search"
          placeholder="Search for movies..."
          value={query}
          onChange={handleChange}
          className="pr-10"
          aria-label="Search for movies"
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-10 w-10"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}

