import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Players | WABL - West African Basketball League",
  description: "Explore player profiles, statistics, and career highlights from the West African Basketball League.",
  keywords: "WABL players, West African basketball players, player profiles, basketball statistics, player highlights",
}

export default function PlayersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
