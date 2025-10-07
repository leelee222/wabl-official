import Link from "next/link"
import Image from "next/image"
import { Instagram, Twitter, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/logos/wabl-1.png"
                  alt="WABL Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-xl font-bold text-primary">WABL</span>
                <p className="text-xs text-muted-foreground">Where Legends Rise</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground text-center md:text-left max-w-sm">
              The premier basketball league across West Africa.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-sm font-semibold text-foreground mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2 text-center md:text-left">
              <Link href="/teams" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Teams
              </Link>
              <Link href="/standings" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Standings
              </Link>
              <Link href="/schedule" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Schedule
              </Link>
              <Link href="/stats" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Stats
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-sm font-semibold text-foreground mb-4">Follow Us</h3>
            <div className="flex space-x-4 mb-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground text-center md:text-left">
              info@wabl.basketball
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <p className="text-xs text-muted-foreground text-center">
              © 2025 WABL. All rights reserved.
            </p>
            <div className="flex space-x-4 text-xs text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
