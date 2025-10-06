import { getTeams, getMatches, getPlayers } from "@/lib/utils/data"
import { TeamCard } from "@/components/features/team-card"
import { PageTransition, StaggerContainer, StaggerItem, RevealOnScroll } from "@/components/ui/animations"
import { Suspense } from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Teams | WABL - West African Basketball League",
  description: "Discover all 8 teams competing in the West African Basketball League. View team statistics, standings, and player rosters.",
  keywords: "WABL teams, West African basketball teams, Lagos Lions, Dakar Sharks, Accra Panthers, basketball league teams",
}

function TeamsLoadingFallback() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-muted rounded-lg p-6 h-96">
            <div className="w-16 h-16 bg-muted-foreground/20 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-3 bg-muted-foreground/20 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function TeamsPage() {
  const teams = getTeams()
  const matches = getMatches()
  const players = getPlayers()

  const teamRecords = teams.map(team => {
    const teamMatches = matches.filter(match => 
      (match.homeTeamId === team.id || match.awayTeamId === team.id) && 
      match.status === 'completed'
    )
    
    let wins = 0
    let losses = 0
    
    teamMatches.forEach(match => {
      if (!match.score) return
      
      const isHome = match.homeTeamId === team.id
      const teamScore = isHome ? match.score.home : match.score.away
      const opponentScore = isHome ? match.score.away : match.score.home
      
      if (teamScore > opponentScore) {
        wins++
      } else {
        losses++
      }
    })
    
    const teamPlayers = players.filter(player => player.teamId === team.id)
    const topScorer = teamPlayers.reduce((top, player) => 
      player.stats.ppg > (top?.stats.ppg || 0) ? player : top
    , teamPlayers[0])
    
    return {
      ...team,
      record: { wins, losses },
      topScorer,
      gamesPlayed: wins + losses
    }
  })

  const sortedTeams = teamRecords.sort((a, b) => {
    const aWinPct = a.gamesPlayed > 0 ? a.record.wins / a.gamesPlayed : 0
    const bWinPct = b.gamesPlayed > 0 ? b.record.wins / b.gamesPlayed : 0
    return bWinPct - aWinPct
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <section className="py-16 lg:py-24 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6">
              WABL Teams
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl max-w-5xl mx-auto leading-relaxed">
              Meet the eight elite teams competing for the championship in the inaugural season of the West African Basketball League
            </p>
            <div className="mt-8 flex justify-center space-x-8 text-sm text-muted-foreground">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{teams.length}</div>
                <div>Teams</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{players.length}</div>
                <div>Players</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{matches.filter(m => m.status === 'completed').length}</div>
                <div>Games Played</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PageTransition>
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<TeamsLoadingFallback />}>
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {sortedTeams.map((team, index) => (
                  <StaggerItem key={team.id}>
                    <TeamCard 
                      team={team} 
                      rank={index + 1}
                      className="h-full"
                    />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </Suspense>
          </div>
        </section>
      </PageTransition>

      <RevealOnScroll direction="up">
        <section className="py-16 bg-muted/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              2024 Inaugural Season
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              The West African Basketball League brings together the best talent from across the region, 
              with teams representing major cities and showcasing the incredible basketball culture of West Africa. 
              Each team plays a full season schedule culminating in an exciting playoff tournament to crown 
              the first-ever WABL champion.
            </p>
          </div>
        </section>
      </RevealOnScroll>
    </div>
  )
}
