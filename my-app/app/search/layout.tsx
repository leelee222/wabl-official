import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Search | WABL - West African Basketball League",
  description: "Search teams, players, and matches across the West African Basketball League.",
  keywords: "WABL search, basketball search, West African basketball, find teams, find players",
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
