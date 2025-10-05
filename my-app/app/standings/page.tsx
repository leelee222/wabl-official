"use client"

import { getTeams, getMatches } from "@/lib/utils/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, TrendingUp, TrendingDown, Minus, Crown, Target } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface TeamStanding {
  id: string
  name: string
  city: string
  logo: string
  colors: { primary: string; secondary: string }
  gamesPlayed: number
  wins: number
  losses: number
  winPercentage: number
  pointsFor: number
  pointsAgainst: number
  pointsDiff: number
  streak: { type: 'W' | 'L'; count: number }
  last5: ('W' | 'L')[]
}

export default function StandingsPage() {
  const teams = getTeams()
  const matches = getMatches()
  
  const standings: TeamStanding[] = teams.map(team => {
    const teamMatches = matches.filter(match => 
      (match.homeTeamId === team.id || match.awayTeamId === team.id) && 
      match.status === 'completed'
    )
    
    let wins = 0
    let losses = 0
    let pointsFor = 0
    let pointsAgainst = 0
    const results: ('W' | 'L')[] = []
    
    teamMatches.forEach(match => {
      if (match.score) {
        const isHome = match.homeTeamId === team.id
        const teamScore = isHome ? match.score.home : match.score.away
        const opponentScore = isHome ? match.score.away : match.score.home
        
        pointsFor += teamScore
        pointsAgainst += opponentScore
        
        if (teamScore > opponentScore) {
          wins++
          results.push('W')
        } else {
          losses++
          results.push('L')
        }
      }
    })
    
    const gamesPlayed = wins + losses
    const winPercentage = gamesPlayed > 0 ? (wins / gamesPlayed) * 100 : 0
    const pointsDiff = pointsFor - pointsAgainst
    
    let streak: { type: 'W' | 'L'; count: number } = { type: 'W', count: 0 }
    if (results.length > 0) {
      const lastResult = results[results.length - 1]
      streak = { type: lastResult, count: 1 }
      
      for (let i = results.length - 2; i >= 0; i--) {
        if (results[i] === lastResult) {
          streak.count++
        } else {
          break
        }
      }
    }
    
    return {
      id: team.id,
      name: team.name,
      city: team.city,
      logo: team.logo,
      colors: team.colors,
      gamesPlayed,
      wins,
      losses,
      winPercentage,
      pointsFor: gamesPlayed > 0 ? pointsFor / gamesPlayed : 0,
      pointsAgainst: gamesPlayed > 0 ? pointsAgainst / gamesPlayed : 0,
      pointsDiff,
      streak,
      last5: results.slice(-5)
    }
  }).sort((a, b) => {
    if (b.winPercentage !== a.winPercentage) {
      return b.winPercentage - a.winPercentage
    }
    return b.pointsDiff - a.pointsDiff
  })

  const getStreakIcon = (streak: { type: 'W' | 'L'; count: number }) => {
    if (streak.count === 0) return <Minus className="h-4 w-4 text-muted-foreground" />
    if (streak.type === 'W') return <TrendingUp className="h-4 w-4 text-green-600" />
    return <TrendingDown className="h-4 w-4 text-red-600" />
  }

  const getStreakColor = (streak: { type: 'W' | 'L'; count: number }) => {
    if (streak.count === 0) return "text-muted-foreground"
    if (streak.type === 'W') return "text-green-600"
    return "text-red-600"
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="h-4 w-4 text-yellow-500" />
    if (rank <= 4) return <Target className="h-4 w-4 text-green-600" />
    return null
  }

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-accent py-16 lg:py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Trophy className="h-8 w-8 text-white mr-3" />
              <Badge variant="outline" className="text-white border-white">
                2024 Season
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl mb-6">
              League Standings
            </h1>
            <p className="text-lg text-white/90 max-w-4xl mx-auto">
              Current standings and team performance across the West African Basketball League
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                2024 Season Standings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-border">
                      <th className="text-left py-4 px-2 font-semibold">#</th>
                      <th className="text-left py-4 px-2 font-semibold">Team</th>
                      <th className="text-center py-4 px-2 font-semibold">GP</th>
                      <th className="text-center py-4 px-2 font-semibold">W</th>
                      <th className="text-center py-4 px-2 font-semibold">L</th>
                      <th className="text-center py-4 px-2 font-semibold">PCT</th>
                      <th className="text-center py-4 px-2 font-semibold">PF</th>
                      <th className="text-center py-4 px-2 font-semibold">PA</th>
                      <th className="text-center py-4 px-2 font-semibold">DIFF</th>
                      <th className="text-center py-4 px-2 font-semibold">STRK</th>
                      <th className="text-center py-4 px-2 font-semibold">L5</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((team, index) => {
                      const rank = index + 1
                      const isPlayoffPosition = rank <= 4
                      
                      return (
                        <tr 
                          key={team.id} 
                          className={`border-b hover:bg-muted/30 transition-colors ${
                            isPlayoffPosition ? 'bg-green-50/50 dark:bg-green-950/20' : ''
                          }`}
                        >
                          <td className="py-4 px-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-semibold w-6 text-center">{rank}</span>
                              {getRankBadge(rank)}
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <Link 
                              href={`/teams/${team.id}`}
                              className="flex items-center gap-3 hover:text-primary transition-colors group"
                            >
                              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                <Image
                                  src={team.logo}
                                  alt={`${team.name} logo`}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform"
                                  sizes="32px"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const fallback = target.nextElementSibling as HTMLElement;
                                    if (fallback) fallback.style.display = 'flex';
                                  }}
                                />
                                <div 
                                  className="absolute inset-0 rounded-full flex items-center justify-center text-white font-bold text-xs"
                                  style={{ 
                                    display: 'none',
                                    backgroundColor: team.colors.primary
                                  }}
                                >
                                  {team.name.split(' ').map(word => word[0]).join('')}
                                </div>
                              </div>
                              <div>
                                <div className="font-semibold group-hover:text-primary transition-colors">
                                  {team.name}
                                </div>
                                <div className="text-sm text-muted-foreground">{team.city}</div>
                              </div>
                            </Link>
                          </td>
                          <td className="py-4 px-2 text-center font-mono">{team.gamesPlayed}</td>
                          <td className="py-4 px-2 text-center font-mono font-semibold text-green-600">{team.wins}</td>
                          <td className="py-4 px-2 text-center font-mono font-semibold text-red-600">{team.losses}</td>
                          <td className="py-4 px-2 text-center font-mono font-semibold">{team.winPercentage.toFixed(3)}</td>
                          <td className="py-4 px-2 text-center font-mono">{team.pointsFor.toFixed(1)}</td>
                          <td className="py-4 px-2 text-center font-mono">{team.pointsAgainst.toFixed(1)}</td>
                          <td className={`py-4 px-2 text-center font-mono font-semibold ${
                            team.pointsDiff > 0 ? 'text-green-600' : team.pointsDiff < 0 ? 'text-red-600' : 'text-muted-foreground'
                          }`}>
                            {team.pointsDiff > 0 ? '+' : ''}{team.pointsDiff.toFixed(0)}
                          </td>
                          <td className="py-4 px-2 text-center">
                            <div className={`flex items-center justify-center gap-1 ${getStreakColor(team.streak)}`}>
                              {getStreakIcon(team.streak)}
                              <span className="font-mono font-semibold">
                                {team.streak.count > 0 ? `${team.streak.type}${team.streak.count}` : '-'}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {team.last5.map((result, i) => (
                                <Badge 
                                  key={i} 
                                  variant={result === 'W' ? 'default' : 'destructive'}
                                  className="w-6 h-6 p-0 text-xs font-mono"
                                >
                                  {result}
                                </Badge>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-8 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Legend</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  <span>League Leader</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span>Playoff Position (Top 4)</span>
                </div>
                <div><strong>GP:</strong> Games Played</div>
                <div><strong>W:</strong> Wins</div>
                <div><strong>L:</strong> Losses</div>
                <div><strong>PCT:</strong> Win Percentage</div>
                <div><strong>PF:</strong> Points For (Average)</div>
                <div><strong>PA:</strong> Points Against (Average)</div>
                <div><strong>DIFF:</strong> Point Differential</div>
                <div><strong>STRK:</strong> Current Streak</div>
                <div><strong>L5:</strong> Last 5 Games</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
