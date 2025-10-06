"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { SearchBar, MobileSearchBar } from "@/components/features/search-bar"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Teams", href: "/teams" },
  { name: "Standings", href: "/standings" },
  { name: "Schedule", href: "/schedule" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const pathname = usePathname()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8 gap-4" aria-label="Global">
        <div className="flex lg:flex-1 min-w-0 flex-shrink-0">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2 lg:space-x-3">
            <div className="relative w-8 h-8 lg:w-12 lg:h-12 flex-shrink-0">
              <Image
                src="/images/logos/wabl-1.png"
                alt="WABL Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-lg lg:text-2xl font-bold text-primary">WABL</span>
              <span className="text-xs lg:text-sm text-muted-foreground hidden sm:block">Where Legends Rise</span>
            </div>
          </Link>
        </div>

        <div className="flex lg:hidden items-center space-x-2 flex-shrink-0">
          <SearchBar />
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </Button>
        </div>

        <div className="hidden lg:flex lg:gap-x-6 xl:gap-x-8 flex-shrink-0">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-semibold leading-6 px-3 py-2 rounded-md transition-all duration-200 hover:text-primary hover:bg-primary/5 whitespace-nowrap",
                pathname === item.href
                  ? "text-primary bg-primary/10 border-b-2 border-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:space-x-4 min-w-0">
          <SearchBar />
          <ThemeToggle />
        </div>
      </nav>

      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50 bg-black/50" onClick={toggleMenu} />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border">
            <div className="flex items-center justify-between mb-6">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-3" onClick={toggleMenu}>
                <div className="relative w-8 h-8">
                  <Image
                    src="/images/logos/wabl-1.png"
                    alt="WABL Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-lg font-bold text-primary">WABL</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </Button>
            </div>
            <div className="flow-root">
              <div className="-my-6 divide-y divide-border">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={toggleMenu}
                      className={cn(
                        "-mx-3 block rounded-lg px-3 py-3 text-base font-semibold leading-7 transition-colors",
                        pathname === item.href
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-primary"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6 w-full">
                  <MobileSearchBar />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
