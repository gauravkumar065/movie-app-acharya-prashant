"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "")
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (debouncedSearchTerm) {
      params.set("query", debouncedSearchTerm)
    } else {
      params.delete("query")
    }

    router.push(`/?${params.toString()}`)
  }, [debouncedSearchTerm, router, searchParams])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search for movies..."
        className="pl-10"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  )
}

