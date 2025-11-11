'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
    if (rank === 1) return <Badge className="bg-yellow-500 text-yellow-900 hover:bg-yellow-600"><Trophy className="h-3 w-3 mr-1 inline" />1st</Badge>
    if (rank === 2) return <Badge className="bg-gray-400 text-gray-900 hover:bg-gray-500"><Trophy className="h-3 w-3 mr-1 inline" />2nd</Badge>
    if (rank === 3) return <Badge className="bg-amber-600 text-amber-100 hover:bg-amber-700"><Trophy className="h-3 w-3 mr-1 inline" />3rd</Badge>
    return <Badge variant="secondary">#{rank}</Badge>
  }

  return (
    <Card className={`
      group relative overflow-hidden
      border-2 border-transparent
      hover:border-primary/50
      hover:-translate-y-2
      hover:shadow-2xl hover:shadow-primary/20
      transition-all duration-500 ease-out
      cursor-pointer
      ${className}
    `}>
      <CardHeader className="pb-4 relative">
        <div className="flex items-center justify-between mb-4">
          {getRankBadge()}
          <Badge variant="outline" className="font-bold">
            {team.record.wins}-{team.record.losses}
          </Badge>
        </div>
        
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4 group-hover:animate-bounce-basketball transition-all duration-300">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 group-hover:scale-150 transition-transform duration-500 blur-xl" />
            <div className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-primary/20 group-hover:ring-primary/50 transition-all duration-300">
              <Image
                src={team.logo}
                alt={`${team.name} logo`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="80px"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div 
                className="absolute inset-0 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ 
                  display: 'none',
                  backgroundColor: team.colors.primary
                }}
              >
                {team.name.split(' ').map(word => word[0]).join('')}
              </div>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
            {team.name}
          </h3>
          
          <div className="flex items-center justify-center text-sm text-muted-foreground gap-1">
            <MapPin className="h-4 w-4" />
            <span>{team.city}, {team.country}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-4 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:rotate-180 transition-transform duration-700">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-medium">Win Rate</div>
                <div className="text-2xl font-black text-foreground">
                  {winPercentage.toFixed(0)}%
                </div>
              </div>
            </div>
            <div className="text-4xl group-hover:animate-bounce-slow">
              🔥
            </div>
          </div>
        </div>

        {team.topScorer && (
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-amber-500/10 to-amber-600/5 p-4 group-hover:from-amber-500/20 group-hover:to-amber-600/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center group-hover:rotate-[360deg] transition-transform duration-700">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Top Scorer</div>
                  <div className="text-sm font-bold text-foreground">
                    {team.topScorer.name.split(' ').pop()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {team.topScorer.stats.ppg.toFixed(1)} PPG
                  </div>
                </div>
              </div>
              <div className="text-3xl group-hover:scale-125 transition-transform duration-300">
                ⭐
              </div>
            </div>
          </div>
        )}

        <Link href={`/teams/${team.id}`} className="block">
          <Button 
            className="w-full group/btn relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
            size="lg"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span className="group-hover/btn:animate-bounce-basketball inline-block">🏀</span>
              View Team Details
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
          </Button>
        </Link>
      </CardContent>
    </Card>
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
