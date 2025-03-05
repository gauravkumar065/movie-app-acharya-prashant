### MovieFlix - Modern Movie Browsing App

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS, shadcn/ui components
- **State Management**: React Context, TanStack Query
- **Animation**: Framer Motion
- **API**: The Movie Database (TMDB)


## Architecture

![Alt text](https://jgxzlyexzm.ufs.sh/f/tKKL1YC9XfJ4ZFbUPjNxfrZ6htzRlb2pImgv3VAC89Kj5UNi)

## Key Features

- **Movie Discovery**: Browse popular movies with infinite scrolling
- **Search**: Real-time search with debounced input
- **Filtering**: Filter movies by genre, year, and rating
- **Favorites**: Save and manage favorite movies with localStorage persistence
- **Responsive Design**: Optimized for all device sizes
- **Dark Mode**: Toggle between light and dark themes
- **Detailed Movie Pages**: Comprehensive movie information with trailers


## Architecture & Implementation

- **App Router**: File-based routing with Next.js App Router
- **Server Components**: Used for initial data fetching and SEO
- **Client Components**: Used for interactive elements
- **React Query**: Efficient data fetching, caching, and state management
- **Context API**: Global state management for favorites and theme


## Key Components

1. **MovieGrid**: Displays movies with infinite scrolling using Intersection Observer
2. **SearchBar**: Debounced search input that updates URL parameters
3. **FilterSidebar**: Advanced filtering options with genre, year, and rating filters
4. **FavoriteButton**: Toggle for adding/removing movies from favorites
5. **MovieDetail**: Comprehensive movie information display with visual elements


## Data Flow

1. User interactions update URL parameters
2. React Query fetches data based on these parameters
3. Components render based on the fetched data
4. Favorites are stored in localStorage and managed via Context


## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Add your TMDB API key to `.env.local`
4. Run the development server with `npm run dev`
5. env.local have these value : `NEXT_PUBLIC_TMDB_API_KEY=""`
                                `TMDB_BASE_URL="https://api.themoviedb.org/3"`
