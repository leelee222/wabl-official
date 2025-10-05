import { Button } from "@/components/ui/button"
import { getTeams, getRecentMatches, getUpcomingMatches, getTopScorers } from "@/lib/utils/data"
import { MatchList } from "@/components/features/match-card"
import { StandingsPreview, QuickStats } from "@/components/features/standings-preview"
import { FeaturedPlayer } from "@/components/features/featured-player"
import Link from "next/link"
import { Suspense } from "react"

function LoadingFallback() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-muted rounded w-1/2"></div>
    </div>
  )
}

export default function HomePage() {
  const teams = getTeams()
  const recentMatches = getRecentMatches(3)
  const upcomingMatches = getUpcomingMatches(1)
  const topScorers = getTopScorers(1)
  const featuredPlayer = topScorers[0]
  const featuredTeam = teams.find(team => team.id === featuredPlayer?.teamId)

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent min-h-[60vh] lg:min-h-[70vh]">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl animate-fade-in-up">
              <span className="block">Where Legends Rise</span>
            </h1>
            <p className="mt-6 text-base leading-7 text-white/90 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9 max-w-4xl mx-auto animate-fade-in-up text-balance" style={{ animationDelay: '0.2s' }}>
              The premier basketball league bringing together the finest talent from across West Africa. 
              8 teams, 96 players, one championship dream.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-x-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link href="/teams">
                <Button size="xl" variant="secondary" className="text-primary w-full sm:w-auto min-w-[160px]">
                  View Teams
                </Button>
              </Link>
              <Link href="/schedule">
                <Button size="xl" variant="outline" className="text-white border-white hover:bg-white hover:text-primary w-full sm:w-auto min-w-[160px]">
                  View Schedule
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <QuickStats teams={teams} />
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl mb-4">
              Latest from WABL
            </h2>
            <p className="text-base text-muted-foreground sm:text-lg mx-auto optimal-text" style={{ maxWidth: '600px' }}>
              Stay updated with the latest matches, standings, and league news
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold mb-6">Recent Matches</h3>
              <Suspense fallback={<LoadingFallback />}>
                <MatchList matches={recentMatches} teams={teams} title="" />
              </Suspense>
              
              {upcomingMatches.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-6">Next Up</h3>
                  <Suspense fallback={<LoadingFallback />}>
                    <MatchList matches={upcomingMatches} teams={teams} title="" />
                  </Suspense>
                </div>
              )}
            </div>

            <div>
              <Suspense fallback={<LoadingFallback />}>
                <StandingsPreview teams={teams} limit={8} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {featuredPlayer && featuredTeam && (
        <section className="py-12 lg:py-16 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto text-center mb-12">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl mb-4">
                Player Spotlight
              </h2>
              <p className="text-base text-muted-foreground sm:text-lg mx-auto optimal-text" style={{ maxWidth: '600px' }}>
                Meet the top performers lighting up the WABL
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <Suspense fallback={<LoadingFallback />}>
                <FeaturedPlayer player={featuredPlayer} team={featuredTeam} />
              </Suspense>
            </div>
          </div>
        </section>
      )}

      <section className="bg-primary py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto text-center">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl mb-6">
              Join the WABL Community
            </h2>
            <p className="text-base text-white/90 sm:text-lg mx-auto mb-8 optimal-text" style={{ maxWidth: '700px' }}>
              Follow your favorite teams, get match notifications, and be part of the West African basketball revolution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/teams">
                <Button size="lg" variant="secondary" className="text-primary">
                  Explore Teams
                </Button>
              </Link>
              <Link href="/standings">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                  View Standings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
