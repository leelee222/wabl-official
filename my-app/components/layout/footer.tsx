import Link from "next/link"
import Image from "next/image"
import { Instagram, Twitter, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
                <span className="text-xl font-bold text-secondary">WABL</span>
                <p className="text-xs text-white/70">Where Legends Rise</p>
              </div>
            </Link>
            <p className="text-sm text-white/70 text-center md:text-left max-w-l">
              The premier basketball league across West Africa.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-sm font-semibold text-white mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2 text-center md:text-left">
              <Link href="/teams" className="text-sm text-white/70 hover:text-secondary transition-colors">
                Teams
              </Link>
              <Link href="/standings" className="text-sm text-white/70 hover:text-secondary transition-colors">
                Standings
              </Link>
              <Link href="/schedule" className="text-sm text-white/70 hover:text-secondary transition-colors">
                Schedule
              </Link>
              <Link href="/about" className="text-sm text-white/70 hover:text-secondary transition-colors">
                About
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-sm font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex space-x-4 mb-4">
              <Link href="#" className="text-white/70 hover:text-secondary transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-white/70 hover:text-secondary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-white/70 hover:text-secondary transition-colors">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
            <p className="text-xs text-white/70 text-center md:text-left">
              info@wabl.basketball
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/20">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <p className="text-xs text-white/70 text-center">
              © 2025 WABL. All rights reserved.
            </p>
            <div className="flex space-x-4 text-xs text-white/70">
              <Link href="/privacy" className="hover:text-secondary transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-secondary transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
