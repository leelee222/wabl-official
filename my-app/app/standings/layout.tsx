import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Standings | WABL - West African Basketball League",
  description: "View the complete WABL league standings, team records, and playoff positioning for the West African Basketball League.",
  keywords: "WABL standings, league table, basketball standings, West African basketball, team rankings, playoff race",
}

export default function StandingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
