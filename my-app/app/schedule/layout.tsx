import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Schedule | WABL - West African Basketball League",
  description: "View the complete match schedule for the West African Basketball League. Calendar view, filters, and export functionality.",
  keywords: "WABL schedule, basketball matches, West African basketball games, game times, fixtures, calendar",
}

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
