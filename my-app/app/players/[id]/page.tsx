"use client"

import { getPlayers, getTeams, getMatches } from "@/lib/utils/data"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, User, MapPin, TrendingUp, Target, Award } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { use } from "react"

interface PlayerPageProps {
  params: Promise<{ id: string }>
}

export default function PlayerPage({ params }: PlayerPageProps) {
  const { id } = use(params)
  const players = getPlayers()
  const teams = getTeams()
  const matches = getMatches()
  
  const player = players.find(p => p.id === id)
  
  if (!player) {
    notFound()
  }

  const team = teams.find(t => t.id === player.teamId)
  
  if (!team) {
    notFound()
  }

  const teamMatches = matches.filter(match => 
    (match.homeTeamId === team.id || match.awayTeamId === team.id) && 
    match.status === 'completed'
  )
  
  const teamWins = teamMatches.filter(match => {
    if (match.homeTeamId === team.id) {
      return match.score && match.score.home > match.score.away
    } else {
      return match.score && match.score.away > match.score.home
    }
  }).length

  const getPositionName = (pos: string) => {
    switch (pos) {
      case 'PG': return 'Point Guard'
      case 'SG': return 'Shooting Guard'
      case 'SF': return 'Small Forward'
      case 'PF': return 'Power Forward'
      case 'C': return 'Center'
      default: return pos
    }
  }

  const getStatCategory = (stat: number, type: 'ppg' | 'rpg' | 'apg' | 'fg') => {
    switch (type) {
      case 'ppg':
        if (stat >= 20) return 'Excellent'
        if (stat >= 15) return 'Good'
        if (stat >= 10) return 'Average'
        return 'Developing'
      case 'rpg':
        if (stat >= 10) return 'Excellent'
        if (stat >= 7) return 'Good'
        if (stat >= 5) return 'Average'
        return 'Developing'
      case 'apg':
        if (stat >= 8) return 'Excellent'
        if (stat >= 5) return 'Good'
        if (stat >= 3) return 'Average'
        return 'Developing'
      case 'fg':
        if (stat >= 0.5) return 'Excellent'
        if (stat >= 0.45) return 'Good'
        if (stat >= 0.4) return 'Average'
        return 'Developing'
      default:
        return 'Average'
    }
  }

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
            <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-white/20">
              <Image
                src={player.photo}
                alt={player.name}
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
                {player.name.split(' ').map(word => word[0]).join('')}
              </div>
            </div>
            
            <div className="text-center lg:text-left flex-1">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <Badge variant="outline" className="text-white border-white">
                  #{player.number}
                </Badge>
                <Badge variant="outline" className="text-white border-white">
                  {getPositionName(player.position)}
                </Badge>
                <Badge variant="outline" className="text-white border-white">
                  {player.nationality}
                </Badge>
              </div>
              
              <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">
                {player.name}
              </h1>
              
              <div className="flex items-center justify-center lg:justify-start gap-6 text-white/90 mb-6">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="text-lg">{player.height} • {player.weight}</span>
                </div>
                <Link href={`/teams/${team.id}`} className="flex items-center gap-2 hover:text-white transition-colors">
                  <MapPin className="h-5 w-5" />
                  <span className="text-lg">{team.name}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Season Statistics</h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-foreground">{player.stats.ppg.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground mb-2">Points Per Game</div>
                <Badge variant="outline" className="text-xs">
                  {getStatCategory(player.stats.ppg, 'ppg')}
                </Badge>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-foreground">{player.stats.rpg.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground mb-2">Rebounds Per Game</div>
                <Badge variant="outline" className="text-xs">
                  {getStatCategory(player.stats.rpg, 'rpg')}
                </Badge>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-foreground">{player.stats.apg.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground mb-2">Assists Per Game</div>
                <Badge variant="outline" className="text-xs">
                  {getStatCategory(player.stats.apg, 'apg')}
                </Badge>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-foreground">{(player.stats.fg * 100).toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground mb-2">Field Goal %</div>
                <Badge variant="outline" className="text-xs">
                  {getStatCategory(player.stats.fg, 'fg')}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Career Highlights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Current Season PPG</span>
                    <span className="font-semibold">{player.stats.ppg.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Position Rank</span>
                    <Badge variant="outline">{getPositionName(player.position)}</Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Jersey Number</span>
                    <span className="font-semibold">#{player.number}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">Shooting Efficiency</span>
                    <Badge variant={player.stats.fg >= 0.45 ? 'default' : 'secondary'}>
                      {(player.stats.fg * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Current Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/teams/${team.id}`} className="block group">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 group-hover:bg-muted/50 transition-colors">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={team.logo}
                        alt={`${team.name} logo`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform"
                        sizes="64px"
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
                        {team.name.split(' ').map(word => word[0]).join('')}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {team.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{team.city}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="text-sm">
                          <span className="text-green-600 font-semibold">{teamWins}W</span>
                          <span className="text-muted-foreground mx-1">-</span>
                          <span className="text-red-600 font-semibold">{teamMatches.length - teamWins}L</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {teamMatches.length} GP
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Home Venue</span>
                    <span className="font-medium">{team.stadium}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Founded</span>
                    <span className="font-medium">{team.founded}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
