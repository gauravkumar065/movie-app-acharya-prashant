"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Film, Heart, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export default function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Film className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">MovieFlix</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/" passHref>
            <Button variant={pathname === "/" ? "default" : "ghost"}>Discover</Button>
          </Link>
          <Link href="/favorites" passHref>
            <Button variant={pathname === "/favorites" ? "default" : "ghost"}>
              <Heart className="mr-2 h-4 w-4" />
              Favorites
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </nav>
      </div>
    </header>
  )
}

