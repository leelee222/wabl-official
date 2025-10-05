import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Teams | WABL - West African Basketball League",
  description: "Explore team profiles, rosters, and statistics from the West African Basketball League.",
  keywords: "WABL teams, West African basketball, team profiles, basketball rosters, team statistics",
}

export default function TeamsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
