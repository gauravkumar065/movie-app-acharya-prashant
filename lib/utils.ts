import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function getImageUrl(path: string | null, size = "w500"): string {
  if (!path) return "/placeholder.svg?height=750&width=500"
  return `https://image.tmdb.org/t/p/${size}${path}`
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Add this function to get a consistent color for each genre
export function getGenreColor(genreId: number): string {
  // Map of genre IDs to tailwind color classes
  const colorMap: Record<number, string> = {
    28: "bg-red-500 text-white", // Action
    12: "bg-blue-500 text-white", // Adventure
    16: "bg-pink-500 text-white", // Animation
    35: "bg-yellow-500 text-black", // Comedy
    80: "bg-slate-700 text-white", // Crime
    99: "bg-emerald-600 text-white", // Documentary
    18: "bg-purple-600 text-white", // Drama
    10751: "bg-orange-500 text-white", // Family
    14: "bg-indigo-500 text-white", // Fantasy
    36: "bg-amber-800 text-white", // History
    27: "bg-black text-white", // Horror
    10402: "bg-pink-600 text-white", // Music
    9648: "bg-violet-800 text-white", // Mystery
    10749: "bg-rose-400 text-white", // Romance
    878: "bg-cyan-600 text-white", // Science Fiction
    10770: "bg-gray-500 text-white", // TV Movie
    53: "bg-red-700 text-white", // Thriller
    10752: "bg-green-800 text-white", // War
    37: "bg-amber-600 text-white", // Western
  }

  return colorMap[genreId] || "bg-gray-500 text-white"
}

