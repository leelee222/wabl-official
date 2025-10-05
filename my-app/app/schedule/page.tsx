import { getMatches, getTeams } from "@/lib/utils/data"
import { MatchList } from "@/components/features/match-card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Trophy } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Schedule | WABL - West African Basketball League",
  description: "View the complete match schedule for the West African Basketball League. Upcoming matches, recent results, and game times.",
  keywords: "WABL schedule, basketball matches, West African basketball games, game times, fixtures",
}

export default function SchedulePage() {
  const matches = getMatches()
  const teams = getTeams()
  
  const upcomingMatches = matches.filter(match => match.status === 'upcoming')
  const completedMatches = matches.filter(match => match.status === 'completed')
  const liveMatches = matches.filter(match => match.status === 'live')

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-accent py-16 lg:py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex items-center justify-center mb-6">
              <Calendar className="h-8 w-8 text-white mr-3" />
              <Badge variant="outline" className="text-white border-white">
                2024 Season
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl mb-6">
              WABL Match Schedule
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Follow all the action from the West African Basketball League. Complete fixtures, live scores, and match results.
            </p>
          </div>
        </div>
      </section>

      {liveMatches.length > 0 && (
        <section className="py-12 lg:py-16 bg-red-50 dark:bg-red-950/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-8">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Live Now
              </h2>
            </div>
            <MatchList matches={liveMatches} teams={teams} title="" />
          </div>
        </section>
      )}

      <section className="py-12 lg:py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <Calendar className="h-6 w-6 text-primary mr-3" />
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Upcoming Matches
            </h2>
            <Badge variant="outline" className="ml-3">
              {upcomingMatches.length} games
            </Badge>
          </div>
          
          {upcomingMatches.length > 0 ? (
            <MatchList matches={upcomingMatches} teams={teams} title="" />
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No upcoming matches scheduled.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <Trophy className="h-6 w-6 text-primary mr-3" />
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Recent Results
            </h2>
            <Badge variant="outline" className="ml-3">
              {completedMatches.length} completed
            </Badge>
          </div>
          
          {completedMatches.length > 0 ? (
            <MatchList matches={completedMatches.slice(0, 10)} teams={teams} title="" />
          ) : (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No completed matches yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
