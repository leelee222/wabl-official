"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { SearchBar } from "@/components/features/search-bar-fixed"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Teams", href: "/teams" },
  { name: "Standings", href: "/standings" },
  { name: "Schedule", href: "/schedule" },
  { name: "Stats", href: "/stats" },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8" aria-label="Global">
        <div className="flex items-center min-w-0">
          <Link href="/" className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
            <div className="relative w-10 h-10 lg:w-12 lg:h-12 flex-shrink-0">
              <Image
                src="/images/logos/wabl-1.png"
                alt="WABL Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xl lg:text-2xl font-bold text-primary truncate">WABL</span>
              <span className="text-xs lg:text-sm text-muted-foreground hidden sm:block truncate">Where Legends Rise</span>
            </div>
          </Link>
        </div>

        <div className="hidden lg:flex lg:items-center lg:space-x-6 xl:space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-semibold leading-6 px-4 py-2.5 rounded-lg transition-all duration-200 hover:text-primary hover:bg-primary/10 hover:scale-105 whitespace-nowrap active:scale-95",
                pathname === item.href
                  ? "text-primary-foreground bg-primary shadow-lg shadow-primary/25 ring-2 ring-primary/20"
                  : "text-muted-foreground hover:shadow-md"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4">
          <Link href="/search">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" title="Search Page">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search Page</span>
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <div className="lg:hidden border-t bg-background/95">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-start space-x-1 py-3 overflow-x-auto scrollbar-hide">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium px-4 py-2.5 rounded-lg transition-all duration-200 hover:text-primary hover:bg-primary/10 whitespace-nowrap flex-shrink-0 active:scale-95",
                  pathname === item.href
                    ? "text-primary-foreground bg-primary shadow-md shadow-primary/25 ring-1 ring-primary/30"
                    : "text-muted-foreground hover:shadow-sm"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
