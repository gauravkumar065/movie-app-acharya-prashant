import { Suspense } from "react";
import { Film, Search, Filter } from "lucide-react";
import MovieGrid from "@/components/movie-grid";
import SearchBar from "@/components/search-bar";
import FilterSidebar from "@/components/filter-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function HomePage() {
  return (
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-b">
      <main className="container mx-auto px-4 py-8">
        <header className="mb-8 space-y-4">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Discover Movies
            </h1>
            <Badge variant="outline" className="ml-2">
              Beta
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Find your next favorite movie from our curated collection
          </p>
          <Separator />
        </header>

        <div className="relative mb-8">
          <Suspense fallback={<MovieGridSkeleton />}>
            <SearchBar />
          </Suspense>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <div className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Movies</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="new">New Releases</TabsTrigger>
              <TabsTrigger value="top">Top Rated</TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-6 flex flex-col gap-8 md:flex-row">
            <div className="w-full shrink-0 md:w-72 lg:w-80">
              <div className="bg-card sticky top-4 rounded-lg border p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="text-primary h-5 w-5" />
                    <h2 className="text-xl font-semibold">Filters</h2>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Clear All
                  </Badge>
                </div>
                <ScrollArea className="h-[calc(100vh-220px)]">
                  <Suspense fallback={<MovieGridSkeleton />}>
                    <FilterSidebar />
                  </Suspense>
                </ScrollArea>
              </div>
            </div>

            <div className="flex-1">
              <TabsContent value="all" className="mt-0">
                <Suspense fallback={<MovieGridSkeleton />}>
                  <MovieGrid />
                </Suspense>
              </TabsContent>
              <TabsContent value="trending" className="mt-0">
                <Suspense fallback={<MovieGridSkeleton />}>
                  <MovieGrid />
                </Suspense>
              </TabsContent>
              <TabsContent value="new" className="mt-0">
                <Suspense fallback={<MovieGridSkeleton />}>
                  <MovieGrid />
                </Suspense>
              </TabsContent>
              <TabsContent value="top" className="mt-0">
                <Suspense fallback={<MovieGridSkeleton />}>
                  <MovieGrid />
                </Suspense>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </main>
    </div>
  );
}

function MovieGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array(10)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="bg-card group space-y-3 overflow-hidden rounded-lg border transition-all hover:shadow-md"
          >
            <Skeleton className="aspect-[2/3] w-full rounded-t-lg" />
            <div className="p-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="mt-2 h-4 w-2/3" />
              <div className="mt-3 flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
