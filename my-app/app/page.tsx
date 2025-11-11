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
import { 
  BouncingBasketballs, 
  CourtLines,  
} from "@/components/animations/basketball-animations"
import Link from "next/link"
import Image from "next/image"
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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent min-h-screen">
        <BouncingBasketballs />
        
        <CourtLines className="opacity-30" />
        
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/images/latest.jpeg')`,
              // filter: 'brightness(0.2)'
            }}
          />
          <div className="absolute inset-0" />
        </div>
        
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-4 border-secondary animate-basketball-bounce" />
          <div className="absolute top-20 right-20 w-24 h-24 rounded-full border-2 border-accent animate-float" />
          <div className="absolute bottom-20 left-20 w-20 h-20 rounded-full border-3 border-primary-foreground animate-pulse" />
          <div className="absolute bottom-10 right-10 text-4xl animate-dribble opacity-30">🏀</div>
          <div className="absolute top-40 left-1/4 text-3xl animate-spin-ball opacity-20">🏀</div>
          <div className="absolute bottom-40 right-1/4 text-3xl animate-basketball-bounce opacity-20" style={{ animationDelay: '0.5s' }}>🏀</div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32 flex items-center justify-center min-h-screen">
          <div className="mx-auto max-w-5xl text-center">
            <FloatingElement delay={0.2}>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl drop-shadow-2xl">
                <span className="block animate-buzzer-beater">Where Legends Rise</span>
              </h1>
            </FloatingElement>
            
            <FloatingElement delay={0.4}>
              <ParallaxText className="mt-6 text-base leading-7 text-white/95 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9 max-w-4xl mx-auto text-balance drop-shadow-lg">
                The premier basketball league bringing together the finest talent from across West Africa. 
                8 teams, 96 players, one championship dream.
              </ParallaxText>
            </FloatingElement>
            
            <FloatingElement delay={0.6}>
              <StaggerContainer className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-x-6">
                <StaggerItem>
                  <Link href="/teams" className="cursor-pointer">
                    <HoverScale scale={1.05} tapScale={0.95}>
                      <Button size="xl" className="basketball-card bg-gradient-to-r from-yellow-500 to-yellow-400 text-black hover:from-yellow-400 hover:to-yellow-300 w-full sm:w-auto min-w-[200px] px-8 py-4 text-lg font-bold shadow-2xl hover:shadow-yellow-500/50 cursor-pointer transform transition-all duration-300 animate-hype-pulse">
                        🏀 View Teams
                      </Button>
                    </HoverScale>
                  </Link>
                </StaggerItem>
                <StaggerItem>
                  <Link href="/schedule" className="cursor-pointer">
                    <HoverScale scale={1.05} tapScale={0.95}>
                      <Button size="xl" className="hover-basketball-bounce bg-white/20 text-white hover:bg-white hover:text-black w-full sm:w-auto min-w-[200px] px-8 py-4 text-lg font-bold cursor-pointer shadow-2xl hover:shadow-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                        📅 View Schedule
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

      <RevealOnScroll direction="up" delay={0.1}>
        <section className="py-16 lg:py-20 bg-muted/20 relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <ParallaxText>
                  <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl mb-6 font-display">
                    Elite Basketball
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    Experience the intensity, skill, and passion that defines West African basketball. 
                    From thunderous dunks to clutch three-pointers, WABL delivers world-class basketball entertainment.
                  </p>
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary font-sport">96</div>
                      <div className="text-sm text-muted-foreground">Elite Players</div>
                    </div>
                    <div className="text-center p-4 bg-secondary/5 rounded-lg">
                      <div className="text-2xl font-bold text-secondary font-sport">8</div>
                      <div className="text-sm text-muted-foreground">Cities</div>
                    </div>
                  </div>
                </ParallaxText>
                <Link href="/teams">
                  <HoverScale>
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-sport cursor-pointer">
                      Explore Teams →
                    </Button>
                  </HoverScale>
                </Link>
              </div>
              
              <div className="relative">
                <FloatingElement delay={0.3}>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <Image 
                      src="/images/latest.jpeg" 
                      alt="WABL Basketball Action" 
                      width={600}
                      height={400}
                      className="w-full h-[400px] object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white">
                        <div className="text-sm font-medium opacity-90">West African Basketball League</div>
                        <div className="text-lg font-bold font-sport">Where Champions Are Made</div>
                      </div>
                    </div>
                  </div>
                </FloatingElement>
                
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary/20 rounded-full blur-xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-xl" />
              </div>
            </div>
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
          <div className="absolute inset-0">
            <Image
              src="/images/down.jpg"
              alt="WABL Never Miss a Game"
              fill
              className="object-cover opacity-20"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80" />
          </div>
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
                  <Link href="/schedule" className="cursor-pointer">
                    <HoverScale>
                      <Button size="xl" variant="secondary" className="text-primary bg-primary-foreground hover:bg-primary-foreground/90 min-w-[180px] cursor-pointer">
                        View Live Games
                      </Button>
                    </HoverScale>
                  </Link>
                </StaggerItem>
                <StaggerItem>
                  <Link href="/stats" className="cursor-pointer">
                    <HoverScale>
                      <Button size="xl" variant="outline" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary min-w-[180px] cursor-pointer">
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
