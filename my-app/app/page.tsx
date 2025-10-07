import { Button } from "@/components/ui/button"
import { getTeams, getRecentMatches, getUpcomingMatches, getTopScorers } from "@/lib/utils/data"
import { MatchList } from "@/components/features/match-card"
import { StandingsPreview, QuickStats } from "@/components/features/standings-preview"
import { FeaturedPlayer } from "@/components/features/featured-player"
import { 
  PageTransition, 
  StaggerContainer, 
  StaggerItem, 
  FloatingElement,
  HoverScale,
  RevealOnScroll,
  ParallaxText
} from "@/components/ui/animations"
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
  const recentMatches = getRecentMatches(2)
  const upcomingMatches = getUpcomingMatches(1)
  const topScorers = getTopScorers(1)
  const featuredPlayer = topScorers[0]
  const featuredTeam = teams.find(team => team.id === featuredPlayer?.teamId)

  return (
    <PageTransition className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent min-h-[60vh] lg:min-h-[70vh]">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-5xl text-center">
            <FloatingElement delay={0.2}>
              <h1 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
                <span className="block">Where Legends Rise</span>
              </h1>
            </FloatingElement>
            
            <FloatingElement delay={0.4}>
              <ParallaxText className="mt-6 text-base leading-7 text-primary-foreground/90 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9 max-w-4xl mx-auto text-balance">
                The premier basketball league bringing together the finest talent from across West Africa. 
                8 teams, 96 players, one championship dream.
              </ParallaxText>
            </FloatingElement>
            
            <FloatingElement delay={0.6}>
              <StaggerContainer className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-x-6">
                <StaggerItem>
                  <Link href="/teams">
                    <HoverScale>
                      <Button size="xl" variant="secondary" className="text-primary w-full sm:w-auto min-w-[160px]">
                        View Teams
                      </Button>
                    </HoverScale>
                  </Link>
                </StaggerItem>
                <StaggerItem>
                  <Link href="/schedule">
                    <HoverScale>
                      <Button size="xl" variant="outline" className="text-primary-foreground border-primary-foreground hover:bg-background hover:text-primary w-full sm:w-auto min-w-[160px]">
                        View Schedule
                      </Button>
                    </HoverScale>
                  </Link>
                </StaggerItem>
              </StaggerContainer>
            </FloatingElement>
          </div>
        </div>
      </section>

      <RevealOnScroll direction="up">
        <section className="py-12 lg:py-16 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <QuickStats teams={teams} />
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll direction="up" delay={0.2}>
        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto text-center mb-12">
              <ParallaxText>
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl mb-4">
                  Latest from WABL
                </h2>
                <p className="text-base text-muted-foreground sm:text-lg mx-auto optimal-text" style={{ maxWidth: '600px' }}>
                  Stay updated with the latest matches, standings, and league news
                </p>
              </ParallaxText>
            </div>

            <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <StaggerItem className="lg:col-span-2">
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
              </StaggerItem>

              <StaggerItem className="lg:mt-0">
                <Suspense fallback={<LoadingFallback />}>
                  <StandingsPreview teams={teams} limit={8} showTitle={true} />
                </Suspense>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>
      </RevealOnScroll>

      {featuredPlayer && featuredTeam && (
        <RevealOnScroll direction="up" delay={0.3}>
          <section className="py-12 lg:py-16 bg-background">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto text-center mb-12">
                <ParallaxText>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl mb-4">
                    Player Spotlight
                  </h2>
                  <p className="text-base text-muted-foreground sm:text-lg mx-auto optimal-text" style={{ maxWidth: '600px' }}>
                    Meet the top performers lighting up the WABL
                  </p>
                </ParallaxText>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <HoverScale scale={1.02}>
                  <Suspense fallback={<LoadingFallback />}>
                    <FeaturedPlayer player={featuredPlayer} team={featuredTeam} />
                  </Suspense>
                </HoverScale>
              </div>
            </div>
          </section>
        </RevealOnScroll>
      )}

      <RevealOnScroll direction="up" delay={0.4}>
        <section className="bg-gradient-to-r from-primary to-accent py-16 lg:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/20 rounded-full blur-xl" />
          </div>
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto text-center mb-12">
              <FloatingElement delay={0.5}>
                <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl mb-4">
                  Never Miss a Game
                </h2>
                <p className="text-lg text-primary-foreground/90 mx-auto mb-2 max-w-3xl">
                  Get live updates, match notifications, and exclusive content from West Africa&apos;s premier basketball league.
                </p>
                <p className="text-sm text-primary-foreground/80 mx-auto max-w-2xl">
                  Join 10,000+ fans already following WABL across 8 cities
                </p>
              </FloatingElement>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <FloatingElement delay={0.6}>
                <div className="text-center p-6 rounded-lg bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏀</span>
                  </div>
                  <h3 className="font-semibold text-primary-foreground mb-2">Live Scores</h3>
                  <p className="text-sm text-primary-foreground/80">Real-time updates from every WABL game</p>
                </div>
              </FloatingElement>
              
              <FloatingElement delay={0.7}>
                <div className="text-center p-6 rounded-lg bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📱</span>
                  </div>
                  <h3 className="font-semibold text-primary-foreground mb-2">Match Alerts</h3>
                  <p className="text-sm text-primary-foreground/80">Get notified when your team plays</p>
                </div>
              </FloatingElement>
              
              <FloatingElement delay={0.8}>
                <div className="text-center p-6 rounded-lg bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <h3 className="font-semibold text-primary-foreground mb-2">Player Stats</h3>
                  <p className="text-sm text-primary-foreground/80">Track your favorite players&apos; performance</p>
                </div>
              </FloatingElement>
            </div>
            
            <div className="text-center">
              <StaggerContainer className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <StaggerItem>
                  <Link href="/schedule">
                    <HoverScale>
                      <Button size="xl" variant="secondary" className="text-primary bg-primary-foreground hover:bg-primary-foreground/90 min-w-[180px]">
                        View Live Games
                      </Button>
                    </HoverScale>
                  </Link>
                </StaggerItem>
                <StaggerItem>
                  <Link href="/stats">
                    <HoverScale>
                      <Button size="xl" variant="outline" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary min-w-[180px]">
                        Player Rankings
                      </Button>
                    </HoverScale>
                  </Link>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </div>
        </section>
      </RevealOnScroll>
    </PageTransition>
  )
}
