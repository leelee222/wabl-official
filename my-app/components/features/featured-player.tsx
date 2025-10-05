'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, TrendingUp, Award, Target } from "lucide-react"
import { Player, Team } from "@/lib/utils/data"
import Image from "next/image"
import Link from "next/link"

interface FeaturedPlayerProps {
  player: Player
  team: Team
  className?: string
}

export function FeaturedPlayer({ player, team, className }: FeaturedPlayerProps) {
  const getPositionName = (pos: string) => {
    const positions = {
      'PG': 'Point Guard',
      'SG': 'Shooting Guard', 
      'SF': 'Small Forward',
      'PF': 'Power Forward',
      'C': 'Center'
    }
    return positions[pos as keyof typeof positions] || pos
  }

  const getStatIcon = (stat: string) => {
    switch (stat) {
      case 'ppg': return <Target className="h-4 w-4" />
      case 'rpg': return <TrendingUp className="h-4 w-4" />
      case 'apg': return <Star className="h-4 w-4" />
      default: return <Award className="h-4 w-4" />
    }
  }

  const keyStats = [
    { label: 'PPG', value: player.stats.ppg, key: 'ppg' },
    { label: 'RPG', value: player.stats.rpg, key: 'rpg' },
    { label: 'APG', value: player.stats.apg, key: 'apg' },
    { label: 'FG%', value: `${player.stats.fg}%`, key: 'fg' }
  ]

  return (
    <Card className={`group hover:shadow-xl transition-all duration-500 border-2 hover:border-primary/20 w-full min-w-0 ${className}`}>
      <CardHeader className="pb-6 text-center">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="default" className="animate-pulse bg-primary text-white">
            <Star className="h-3 w-3 mr-1" />
            Featured Player
          </Badge>
          <Badge variant="outline">#{player.number}</Badge>
        </div>
        
        <CardTitle className="text-2xl sm:text-3xl leading-tight group-hover:text-primary transition-colors mb-2 break-words">
          {player.name}
        </CardTitle>
        
        <CardDescription className="text-base sm:text-lg break-words">
          {getPositionName(player.position)} • {team.name}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="px-6 pb-6">
        <div className="relative mb-8 flex justify-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-muted border-4 border-primary/20 group-hover:border-primary/40 transition-all duration-300">
            <Image
              src={player.photo}
              alt={player.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="128px"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="absolute inset-0 items-center justify-center bg-muted text-muted-foreground" style={{ display: 'none' }}>
              <span className="text-4xl font-bold">
                {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Star className="h-4 w-4 text-white" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          {keyStats.map((stat) => (
            <div key={stat.key} className="text-center p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-center mb-2">
                {getStatIcon(stat.key)}
              </div>
              <div className="text-xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-3 mb-8 text-base">
          <div className="flex justify-between items-center py-2 border-b border-border/50">
            <span className="text-muted-foreground">Height:</span>
            <span className="font-medium">{player.height}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border/50">
            <span className="text-muted-foreground">Age:</span>
            <span className="font-medium">{player.age} years</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border/50">
            <span className="text-muted-foreground">From:</span>
            <span className="font-medium">{player.nationality}</span>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-base text-muted-foreground leading-relaxed text-center optimal-text break-words">
            {player.bio}
          </p>
        </div>

        <div className="space-y-6">
          <Link href={`/players/${player.id}`}>
            <Button variant="default" className="w-full group-hover:shadow-lg transition-shadow bg-primary text-white hover:bg-primary/90">
              View Full Profile
            </Button>
          </Link>
          <Link href={`/teams/${team.id}`}>
            <Button variant="outline" className="w-full">
              View Team Roster
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

interface PlayersSpotlightProps {
  players: Player[]
  teams: Team[]
  title?: string
  limit?: number
  className?: string
}

export function PlayersSpotlight({ players, teams, title = "Top Performers", limit = 3, className }: PlayersSpotlightProps) {
  const topPlayers = players
    .sort((a, b) => b.stats.ppg - a.stats.ppg)
    .slice(0, limit)

  const getTeam = (teamId: string) => teams.find(team => team.id === teamId)

  return (
    <div className={className}>
      {title && (
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-muted-foreground">Leading scorers in the WABL</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topPlayers.map((player) => {
          const team = getTeam(player.teamId)
          if (!team) return null
          
          return (
            <FeaturedPlayer
              key={player.id}
              player={player}
              team={team}
            />
          )
        })}
      </div>
    </div>
  )
}
