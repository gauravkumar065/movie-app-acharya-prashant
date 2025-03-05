"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import type { Movie } from "@/types"

interface FavoritesContextType {
  favorites: Movie[]
  addFavorite: (movie: Movie) => void
  removeFavorite: (movieId: number) => void
  isFavorite: (movieId: number) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Movie[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFavorites = localStorage.getItem("favorites")
      if (storedFavorites) {
        try {
          setFavorites(JSON.parse(storedFavorites))
        } catch (error) {
          console.error("Failed to parse favorites from localStorage", error)
          localStorage.removeItem("favorites")
        }
      }
      setIsLoaded(true)
    }
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem("favorites", JSON.stringify(favorites))
    }
  }, [favorites, isLoaded])

  const addFavorite = (movie: Movie) => {
    setFavorites((prev) => {
      // Check if movie is already in favorites to avoid duplicates
      if (prev.some((fav) => fav.id === movie.id)) {
        return prev
      }
      return [...prev, movie]
    })
  }

  const removeFavorite = (movieId: number) => {
    setFavorites((prev) => prev.filter((movie) => movie.id !== movieId))
  }

  const isFavorite = (movieId: number) => {
    return favorites.some((movie) => movie.id === movieId)
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}

