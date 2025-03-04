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
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`,
    { next: { revalidate: 3600 } },
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

