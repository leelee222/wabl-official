import { getTeams, getPlayers } from "@/lib/utils/data"
import { StatsChartViewer } from "@/components/features/stats-dashboard"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "League Statistics | WABL - West African Basketball League",
  description: "Comprehensive statistics and analytics for the West African Basketball League. View player leaders, team comparisons, and performance trends.",
  keywords: "WABL statistics, basketball analytics, league leaders, team comparison, player stats, West African basketball data",
}

function StatsLoadingFallback() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-muted rounded-lg p-6 h-96">
            <div className="h-6 bg-muted-foreground/20 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-muted-foreground/20 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function StatsPage() {
  const teams = getTeams()
  const players = getPlayers()

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary to-accent text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold">
              League Statistics
            </h1>
            <p className="text-white/90 text-lg max-w-4xl mx-auto">
              Dive deep into the numbers that tell the story of WABL. Explore player performance, 
              team comparisons, and statistical trends that shape the league.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<StatsLoadingFallback />}>
          <StatsChartViewer teams={teams} players={players} />
        </Suspense>
      </div>

      <div className="bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold">Statistical Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Interactive Charts</h3>
                <p className="text-muted-foreground">
                  Explore data through dynamic visualizations powered by Recharts
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Real-time Comparisons</h3>
                <p className="text-muted-foreground">
                  Compare teams and players across multiple statistical categories
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">League Leaders</h3>
                <p className="text-muted-foreground">
                  Track the top performers in every major statistical category
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
