"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import MovieCard from "@/components/movie-card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Movie } from "@/lib/tmdb"

interface MovieGridProps {
  initialMovies: Movie[]
  genres?: { [key: number]: string }
  loadMoreMovies?: (page: number) => Promise<Movie[]>
}

export default function MovieGrid({ initialMovies, genres = {}, loadMoreMovies }: MovieGridProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const observerTarget = useRef<HTMLDivElement>(null)

  const loadMore = useCallback(async () => {
    if (!loadMoreMovies || loading || !hasMore) return

    setLoading(true)
    try {
      const nextPage = page + 1
      const newMovies = await loadMoreMovies(nextPage)

      if (newMovies.length === 0) {
        setHasMore(false)
      } else {
        setMovies((prev) => [...prev, ...newMovies])
        setPage(nextPage)
      }
    } catch (error) {
      console.error("Error loading more movies:", error)
    } finally {
      setLoading(false)
    }
  }, [loadMoreMovies, page, loading, hasMore])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore()
        }
      },
      { threshold: 0.1 },
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [loadMore, hasMore])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} genres={genres} />
      ))}

      {loading && (
        <>
          {[...Array(5)].map((_, i) => (
            <div key={`skeleton-${i}`} className="space-y-3">
              <Skeleton className="h-[300px] w-full rounded-md" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </>
      )}

      {hasMore && loadMoreMovies && <div ref={observerTarget} className="h-20 w-full" />}
    </div>
  )
}

