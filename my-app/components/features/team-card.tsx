'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HoverScale } from "@/components/ui/animations"
import { Trophy, TrendingUp, Star, MapPin } from "lucide-react"
import { Team, Player } from "@/lib/utils/data"
import Image from "next/image"
import Link from "next/link"

interface TeamCardProps {
  team: Team & {
    record: { wins: number; losses: number }
    topScorer?: Player
    gamesPlayed: number
  }
  rank: number
  className?: string
}

export function TeamCard({ team, rank, className }: TeamCardProps) {
  const winPercentage = team.gamesPlayed > 0 ? (team.record.wins / team.gamesPlayed * 100) : 0
  
  const getRankBadge = () => {
    if (rank === 1) return <Badge className="bg-yellow-500 text-yellow-900 hover:bg-yellow-600"><Trophy className="h-3 w-3 mr-1" />1st</Badge>
    if (rank === 2) return <Badge className="bg-gray-400 text-gray-900 hover:bg-gray-500"><Trophy className="h-3 w-3 mr-1" />2nd</Badge>
    if (rank === 3) return <Badge className="bg-amber-600 text-amber-100 hover:bg-amber-700"><Trophy className="h-3 w-3 mr-1" />3rd</Badge>
    return <Badge className="bg-muted/50 text-muted-foreground shadow-md shadow-gray-400/20 dark:shadow-gray-600/20">#{rank}</Badge>
  }

  return (
    <HoverScale scale={1.02} tapScale={0.98}>
      <Card className={`border-0 group hover:shadow-xl shadow-lg shadow-gray-400/10 dark:shadow-gray-600/20 transition-all duration-300 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          {getRankBadge()}
          <Badge className="bg-muted/50 text-muted-foreground shadow-sm shadow-gray-400/20 dark:shadow-gray-600/20 text-xs">
            {team.record.wins}-{team.record.losses}
          </Badge>
        </div>
        
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden shadow-md shadow-primary/20 dark:shadow-primary/30 group-hover:shadow-lg group-hover:shadow-primary/30 dark:group-hover:shadow-primary/40 transition-all duration-300">
            <Image
              src={team.logo}
              alt={`${team.name} logo`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
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
          
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-1 break-words">
            {team.name}
          </h3>
          
          <div className="flex items-center justify-center text-sm text-muted-foreground mb-2">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{team.city}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="text-center p-3 rounded-lg bg-muted/30 group-hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-primary mr-1" />
              <span className="text-xs font-medium text-muted-foreground">WIN %</span>
            </div>
            <div className="text-xl font-bold text-foreground">
              {winPercentage.toFixed(1)}%
            </div>
          </div>

          {team.topScorer && (
            <div className="text-center p-3 rounded-lg bg-muted/30 group-hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-center mb-1">
                <Star className="h-4 w-4 text-primary mr-1" />
                <span className="text-xs font-medium text-muted-foreground">TOP SCORER</span>
              </div>
              <div className="text-sm font-semibold text-foreground break-words">
                {team.topScorer.name.split(' ').slice(-1)[0]}
              </div>
              <div className="text-xs text-muted-foreground">
                {team.topScorer.stats.ppg.toFixed(1)} PPG
              </div>
            </div>
          )}

          <div className="text-center p-3 rounded-lg bg-muted/30 group-hover:bg-muted/50 transition-colors">
            <div className="text-xs font-medium text-muted-foreground mb-1">HOME VENUE</div>
            <div className="text-sm font-semibold text-foreground break-words">
              {team.stadium}
            </div>
          </div>

          <Link href={`/teams/${team.id}`} className="block cursor-pointer">
            <Button 
              className="w-full bg-muted/50 hover:bg-primary text-muted-foreground hover:text-primary-foreground shadow-md shadow-gray-400/20 dark:shadow-gray-600/20 hover:shadow-lg hover:shadow-primary/30 dark:hover:shadow-primary/40 transition-all duration-300 border-0 cursor-pointer"
              size="sm"
            >
              View Team
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
    </HoverScale>
  )
}

interface TeamsGridProps {
  teams: (Team & {
    record: { wins: number; losses: number }
    topScorer?: Player
    gamesPlayed: number
  })[]
  className?: string
}

export function TeamsGrid({ teams, className }: TeamsGridProps) {
  const sortedTeams = teams.sort((a, b) => {
    const aWinPct = a.gamesPlayed > 0 ? a.record.wins / a.gamesPlayed : 0
    const bWinPct = b.gamesPlayed > 0 ? b.record.wins / b.gamesPlayed : 0
    return bWinPct - aWinPct
  })

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {sortedTeams.map((team, index) => (
        <TeamCard 
          key={team.id} 
          team={team} 
          rank={index + 1}
          className="h-full"
        />
      ))}
    </div>
  )
}
