export interface Movie {
  id: number
  title: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  overview: string
  vote_average: number
  genre_ids: number[]
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[]
  runtime: number
  status: string
  tagline: string
  production_companies: {
    id: number
    logo_path: string | null
    name: string
    origin_country: string
  }[]
}

export interface Genre {
  id: number
  name: string
}

export interface MovieResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export type SortOption =
  | "popularity.desc"
  | "popularity.asc"
  | "vote_average.desc"
  | "vote_average.asc"
  | "release_date.desc"
  | "release_date.asc"

const API_KEY = process.env.TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"

export async function getTrendingMovies(page = 1): Promise<MovieResponse> {
  const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${page}`, {
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch trending movies")
  }

  return response.json()
}

export async function getMovieDetails(id: number): Promise<MovieDetails> {
  const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`, { next: { revalidate: 86400 } })

  if (!response.ok) {
    throw new Error("Failed to fetch movie details")
  }

  return response.json()
}

export async function searchMovies(query: string, page = 1): Promise<MovieResponse> {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`,
    { cache: "no-store" },
  )

  if (!response.ok) {
    throw new Error("Failed to search movies")
  }

  return response.json()
}

export async function getGenres(): Promise<{ genres: Genre[] }> {
  const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`, { next: { revalidate: 86400 } })

  if (!response.ok) {
    throw new Error("Failed to fetch genres")
  }

  return response.json()
}

export async function getMoviesByGenre(genreId: number, page = 1): Promise<MovieResponse> {
  const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`, {
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch movies by genre")
  }

  return response.json()
}

export async function getFilteredMovies(
  page = 1,
  options: {
    query?: string
    genres?: number[]
    fromYear?: number
    toYear?: number
    minRating?: number
    maxRating?: number
    sortBy?: SortOption
  } = {},
): Promise<MovieResponse> {
  const { query, genres, fromYear, toYear, minRating, maxRating, sortBy = "popularity.desc" } = options

  // If there's a search query, use the search endpoint
  if (query && query.trim() !== "") {
    return searchMovies(query, page)
  }

  // Otherwise use the discover endpoint with filters
  let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=${sortBy}&include_adult=false`

  if (genres && genres.length > 0) {
    url += `&with_genres=${genres.join(",")}`
  }

  if (fromYear) {
    url += `&primary_release_date.gte=${fromYear}-01-01`
  }

  if (toYear) {
    url += `&primary_release_date.lte=${toYear}-12-31`
  }

  if (minRating !== undefined) {
    url += `&vote_average.gte=${minRating}`
  }

  if (maxRating !== undefined) {
    url += `&vote_average.lte=${maxRating}`
  }

  const response = await fetch(url, { cache: "no-store" })

  if (!response.ok) {
    throw new Error("Failed to fetch filtered movies")
  }

  return response.json()
}

