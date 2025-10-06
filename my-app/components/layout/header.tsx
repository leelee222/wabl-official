"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"

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
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8" aria-label="Global">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2 lg:space-x-3">
            <div className="relative w-8 h-8 lg:w-12 lg:h-12">
              <Image
                src="/images/logos/wabl-1.png"
                alt="WABL Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg lg:text-2xl font-bold text-primary">WABL</span>
              <span className="text-xs lg:text-sm text-muted-foreground hidden sm:block">Where Legends Rise</span>
            </div>
          </Link>
        </div>

        <div className="hidden lg:flex lg:items-center lg:space-x-6 xl:space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-semibold leading-6 px-3 py-2 rounded-md transition-all duration-200 hover:text-primary hover:bg-primary/5 whitespace-nowrap",
                pathname === item.href
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4">
          <Link href="/search">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <div className="lg:hidden border-t bg-background/95">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-center space-x-1 py-2 overflow-x-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium px-3 py-2 rounded-md transition-all duration-200 hover:text-primary hover:bg-primary/5 whitespace-nowrap flex-shrink-0",
                  pathname === item.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground"
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
