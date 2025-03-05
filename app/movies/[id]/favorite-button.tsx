"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MovieDetails } from "@/lib/tmdb";

interface FavoriteButtonProps {
  movie: MovieDetails;
}

export default function FavoriteButton({ movie }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.some((fav: { id: number }) => fav.id === movie.id));
    setIsLoaded(true);
  }, [movie.id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (isFavorite) {
      const updatedFavorites = favorites.filter(
        (fav: { id: number }) => fav.id !== movie.id,
      );
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } else {
      favorites.push(movie);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    setIsFavorite(!isFavorite);
  };

  if (!isLoaded) return null;

  return (
    <Button
      onClick={toggleFavorite}
      variant={isFavorite ? "default" : "outline"}
      className={`w-full ${isFavorite ? "bg-red-500 hover:bg-red-600" : ""}`}
    >
      <Heart className={`mr-2 h-4 w-4 ${isFavorite ? "fill-white" : ""}`} />
      {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
    </Button>
  );
}
