"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Loader2, Command } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Sample popular searches - in a real app, these could come from an API
  const popularSearches = [
    "Action",
    "Marvel",
    "2023",
    "Oscar Winners",
    "Sci-Fi",
  ];

  useEffect(() => {
    setIsSearching(true);
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearchTerm) {
      params.set("query", debouncedSearchTerm);
    } else {
      params.delete("query");
    }

    router.push(`/?${params.toString()}`);

    // Set a small timeout to show the loading state
    const timeout = setTimeout(() => {
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [debouncedSearchTerm, router, searchParams]);

  const handleClear = () => {
    setSearchTerm("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("query");
    router.push(`/?${params.toString()}`);
  };

  const handlePopularSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="w-full space-y-2">
      <div
        className={cn(
          "bg-background relative flex items-center rounded-lg border transition-all",
          isFocused ? "ring-primary ring-2 ring-offset-2" : "",
        )}
      >
        <div className="pointer-events-none absolute left-3 flex h-full items-center justify-center">
          {isSearching ? (
            <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
          ) : (
            <Search className="text-muted-foreground h-4 w-4" />
          )}
        </div>

        <Input
          type="search"
          placeholder="Search for movies, actors, directors..."
          className="border-0 pl-10 shadow-none focus-visible:ring-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-10 h-full rounded-none"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X className="text-muted-foreground h-4 w-4" />
          </Button>
        )}

        <div className="text-muted-foreground flex h-full items-center border-l px-3 text-xs">
          <Command className="mr-1 h-3 w-3" />
          <span>K</span>
        </div>
      </div>

      {!searchTerm && !isFocused && (
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="text-muted-foreground text-xs">Popular:</span>
          {popularSearches.map((term) => (
            <Badge
              key={term}
              variant="outline"
              className="hover:bg-secondary cursor-pointer"
              onClick={() => handlePopularSearch(term)}
            >
              {term}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
