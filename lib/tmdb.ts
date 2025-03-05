const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "3e837d475d297d80f5b489a3901ed6ec" // Demo key
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

interface FetchMoviesParams {
  page?: number
  query?: string
  genre?: number
  year?: number
  rating?: number
}

export async function fetchMovies({ page = 1, query = "", genre, year, rating }: FetchMoviesParams) {
  const endpoint = query ? `${TMDB_BASE_URL}/search/movie` : `${TMDB_BASE_URL}/discover/movie`

  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    page: page.toString(),
    language: "en-US",
    include_adult: "false",
  })

  if (query) {
    params.append("query", query)
  }

  if (genre) {
    params.append("with_genres", genre.toString())
  }

  if (year) {
    params.append("primary_release_year", year.toString())
  }

  if (rating) {
    params.append("vote_average.gte", rating.toString())
  }

  // Sort by popularity by default
  if (!query) {
    params.append("sort_by", "popularity.desc")
  }

  const response = await fetch(`${endpoint}?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.status}`)
  }

  return response.json()
}

export async function getMovieDetails(id: string) {
  const response = await fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`)

  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error(`Failed to fetch movie details: ${response.status}`)
  }

  return response.json()
}

export async function fetchGenres() {
  const response = await fetch(`${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`)

  if (!response.ok) {
    throw new Error(`Failed to fetch genres: ${response.status}`)
  }

  const data = await response.json()
  return data.genres
}

