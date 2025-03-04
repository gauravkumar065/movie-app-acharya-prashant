import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getGenreColor(genreId: number): string {
  const colorMap: Record<number, string> = {
    28: "bg-red-500 text-white",
    12: "bg-blue-500 text-white",
    16: "bg-pink-500 text-white",
    35: "bg-yellow-500 text-black",
    80: "bg-slate-700 text-white",
    99: "bg-emerald-600 text-white",
    18: "bg-purple-600 text-white",
    10751: "bg-orange-500 text-white",
    14: "bg-indigo-500 text-white",
    36: "bg-amber-800 text-white",
    27: "bg-black text-white",
    10402: "bg-pink-600 text-white",
    9648: "bg-violet-800 text-white",
    10749: "bg-rose-400 text-white",
    878: "bg-cyan-600 text-white",
    10770: "bg-gray-500 text-white",
    53: "bg-red-700 text-white",
    10752: "bg-green-800 text-white",
    37: "bg-amber-600 text-white",
  }

  return colorMap[genreId] || "bg-gray-500 text-white"
}

export function getImageUrl(path: string | null, size = "w500"): string {
  if (!path) return "/placeholder.svg?height=750&width=500"
  return `https://image.tmdb.org/t/p/${size}${path}`
}