"use client"

import { getTeams, getPlayers, getMatches } from "@/lib/utils/data"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, MapPin, Calendar, TrendingUp, Star } from "lucide-react"
import Image from "next/image"
import { MatchList } from "@/components/features/match-card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { use } from "react"

interface TeamPageProps {
  params: Promise<{ slug: string }>
}

export default function TeamPage({ params }: TeamPageProps) {
  const { slug } = use(params)
  const router = useRouter()
  
  const teams = getTeams()
  const team = teams.find(t => t.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') === slug)
  
  if (!team) {
    notFound()
  }

  const players = getPlayers().filter(p => p.teamId === team.id)
  const matches = getMatches()
  
  const teamMatches = matches.filter(match => 
    (match.homeTeamId === team.id || match.awayTeamId === team.id) && 
    match.status === 'completed'
  )
  
  const wins = teamMatches.filter(match => {
    if (match.homeTeamId === team.id) {
      return match.score && match.score.home > match.score.away
    } else {
      return match.score && match.score.away > match.score.home
    }
  }).length
  
  const losses = teamMatches.length - wins
  const winPercentage = teamMatches.length > 0 ? (wins / teamMatches.length) * 100 : 0
  
  const recentMatches = teamMatches
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
  
  const totalGames = teamMatches.length
  const totalPoints = teamMatches.reduce((acc, match) => {
    if (match.score) {
      return acc + (match.homeTeamId === team.id ? match.score.home : match.score.away)
    }
    return acc
  }, 0)
  const avgPointsScored = totalGames > 0 ? (totalPoints / totalGames).toFixed(1) : "0.0"
  
  const totalPointsAllowed = teamMatches.reduce((acc, match) => {
    if (match.score) {
      return acc + (match.homeTeamId === team.id ? match.score.away : match.score.home)
    }
    return acc
  }, 0)
  const avgPointsAllowed = totalGames > 0 ? (totalPointsAllowed / totalGames).toFixed(1) : "0.0"

  const topScorers = players
    .sort((a, b) => b.stats.ppg - a.stats.ppg)
    .slice(0, 3)

  return (
    <div className="flex flex-col">
      <section 
        className="relative overflow-hidden py-16 lg:py-20"
        style={{
          background: `linear-gradient(135deg, ${team.colors.primary}ee, ${team.colors.secondary}ee)`
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="relative w-34 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-white/20">
              <Image
                src={team.logo}
                alt={`${team.name} logo`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 128px, 160px"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div 
                className="absolute inset-0 rounded-full flex items-center justify-center text-white font-bold text-2xl lg:text-3xl"
                style={{ 
                  display: 'none',
                  backgroundColor: team.colors.primary
                }}
              >
                {team.name.split(' ').map(word => word[0]).join('')}
              </div>
            </div>
            
            <div className="text-center lg:text-left flex-1">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <Badge variant="outline" className="text-white border-white">
                  {team.founded}
                </Badge>
                <Badge variant="outline" className="text-white border-white">
                  {wins}-{losses}
                </Badge>
              </div>
              
              <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">
                {team.name}
              </h1>
              
              <div className="flex items-center justify-center lg:justify-start gap-6 text-white/90 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span className="text-lg">{team.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span className="text-lg">{players.length} Players</span>
                </div>
              </div>
              
              <p className="text-lg text-white/80 max-w-4xl">
                Home venue: {team.stadium}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Team Statistics</h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{wins}</div>
                <div className="text-sm text-muted-foreground">Wins</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{losses}</div>
                <div className="text-sm text-muted-foreground">Losses</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{winPercentage.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Win Rate</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{totalGames}</div>
                <div className="text-sm text-muted-foreground">Games Played</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{avgPointsScored}</div>
                <div className="text-sm text-muted-foreground">Average Points Scored</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">{avgPointsAllowed}</div>
                <div className="text-sm text-muted-foreground">Average Points Allowed</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Team Roster</h2>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Top Scorers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topScorers.map((player, index) => (
                <Link key={player.id} href={`/players/${player.id}`} className="block group">
                  <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group-hover:border-primary/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted">
                          <Image
                            src={player.photo}
                            alt={player.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-200"
                            sizes="48px"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div 
                            className="absolute inset-0 rounded-full flex items-center justify-center text-white font-bold text-sm"
                            style={{ 
                              display: 'none',
                              backgroundColor: team.colors.primary
                            }}
                          >
                            {player.name.split(' ').map(word => word[0]).join('')}
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-sm group-hover:text-primary transition-colors">{player.name}</div>
                          <div className="text-xs text-muted-foreground">#{player.number} • {player.position}</div>
                        </div>
                        {index === 0 && <Badge variant="outline" className="ml-auto">Top Scorer</Badge>}
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-primary">{player.stats.ppg.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">PPG</div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Full Roster</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-semibold">#</th>
                      <th className="text-left py-3 px-2 font-semibold">Player</th>
                      <th className="text-left py-3 px-2 font-semibold">Pos</th>
                      <th className="text-left py-3 px-2 font-semibold">Height</th>
                      <th className="text-left py-3 px-2 font-semibold">PPG</th>
                      <th className="text-left py-3 px-2 font-semibold">RPG</th>
                      <th className="text-left py-3 px-2 font-semibold">APG</th>
                      <th className="text-left py-3 px-2 font-semibold">FG%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players
                      .sort((a, b) => a.number - b.number)
                      .map((player) => (
                        <tr 
                          key={player.id} 
                          className="border-b hover:bg-muted/50 transition-colors group cursor-pointer"
                          onClick={() => router.push(`/players/${player.id}`)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              router.push(`/players/${player.id}`)
                            }
                          }}
                          tabIndex={0}
                          role="button"
                          aria-label={`View ${player.name} profile`}
                        >
                          <td className="py-3 px-2 font-mono">{player.number}</td>
                          <td className="py-3 px-2">
                            <div className="font-medium group-hover:text-primary transition-colors">{player.name}</div>
                            <div className="text-sm text-muted-foreground">{player.nationality}</div>
                          </td>
                          <td className="py-3 px-2 font-mono">{player.position}</td>
                          <td className="py-3 px-2 font-mono">{player.height}</td>
                          <td className="py-3 px-2 font-mono">{player.stats.ppg.toFixed(1)}</td>
                          <td className="py-3 px-2 font-mono">{player.stats.rpg.toFixed(1)}</td>
                          <td className="py-3 px-2 font-mono">{player.stats.apg.toFixed(1)}</td>
                          <td className="py-3 px-2 font-mono">{(player.stats.fg * 100).toFixed(1)}%</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {recentMatches.length > 0 && (
        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">Recent Matches</h2>
            <MatchList matches={recentMatches} teams={teams} title="" />
          </div>
        </section>
      )}
    </div>
  )
}