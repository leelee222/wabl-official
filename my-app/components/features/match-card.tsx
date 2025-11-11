'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Play } from "lucide-react"
import { Match, Team } from "@/lib/utils/data"
import { formatDate, formatTime } from "@/lib/utils/data"
import Image from "next/image"
import Link from "next/link"

interface MatchCardProps {
  match: Match
  homeTeam: Team
  awayTeam: Team
  className?: string
}

export function MatchCard({ match, homeTeam, awayTeam, className }: MatchCardProps) {
  const isCompleted = match.status === 'completed'
  const isUpcoming = match.status === 'upcoming'
  const isLive = match.status === 'live'

  const getStatusBadge = () => {
    if (isCompleted) return <Badge variant="success">🏁 Final</Badge>
    if (isLive) return <Badge variant="destructive" className="animate-pulse">🔴 LIVE</Badge>
    return <Badge variant="outline">📅 Upcoming</Badge>
  }

  const getStatusColor = () => {
    if (isCompleted) return 'shadow-lg shadow-gray-500/20'
    if (isLive) return 'shadow-lg shadow-red-500/20'
    return 'shadow-lg shadow-blue-500/20'
  }

  return (
    <Card className={`border-0 hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1 ${getStatusColor()} ${className}`}>
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between mb-4">
          {getStatusBadge()}
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(match.date)}</span>
          </div>
        </div>
        
        <CardTitle className={`text-lg sm:text-xl leading-tight text-center mb-3`}>
          {homeTeam.name} 🏀 vs 🏀 {awayTeam.name}
        </CardTitle>
        
        <CardDescription className="flex items-center justify-center text-sm sm:text-base leading-relaxed mb-1">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate">{match.venue}</span>
        </CardDescription>
        
        {!isCompleted && (
          <div className="text-sm text-muted-foreground text-center">
            {formatTime(match.date)}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Image
                src={homeTeam.logo}
                alt={`${homeTeam.name} logo`}
                width={32}
                height={32}
                className="object-cover transition-transform"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="absolute inset-0 bg-muted rounded-full items-center justify-center" style={{ display: 'none' }}>
                <span className="text-xs font-bold" style={{ color: homeTeam.colors.primary }}>
                  {homeTeam.name.split(' ').map(word => word[0]).join('')}
                </span>
              </div>
            </div>
            <span className="font-medium truncate text-sm">{homeTeam.city}</span>
          </div>
          
          <div className="px-4 text-center">
            {isCompleted && match.score ? (
              <div className="flex items-center space-x-3 text-xl sm:text-2xl font-bold">
                <span className={`${match.score.home > match.score.away ? 'text-primary' : 'text-muted-foreground'}`}>
                  {match.score.home}
                </span>
                <span className="text-sm text-muted-foreground">-</span>
                <span className={`${match.score.away > match.score.home ? 'text-primary' : 'text-muted-foreground'}`}>
                  {match.score.away}
                </span>
              </div>
            ) : (
              <span className="text-lg font-semibold text-muted-foreground">🏀 VS</span>
            )}
          </div>
          
          <div className="flex items-center space-x-3 flex-1 min-w-0 justify-end">
            <span className="font-medium truncate text-sm text-right">{awayTeam.city}</span>
            <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Image
                src={awayTeam.logo}
                alt={`${awayTeam.name} logo`}
                width={32}
                height={32}
                className="object-cover transition-transform"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="absolute inset-0 bg-muted rounded-full items-center justify-center" style={{ display: 'none' }}>
                <span className="text-xs font-bold" style={{ color: awayTeam.colors.primary }}>
                  {awayTeam.name.split(' ').map(word => word[0]).join('')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {isCompleted && match.attendance && (
          <div className="flex items-center justify-center text-xs text-muted-foreground mb-4">
            <Users className="h-3 w-3 mr-1" />
            <span>👥 {match.attendance.toLocaleString()} attendance</span>
          </div>
        )}

        {isCompleted && (
          <Button variant="outline" className="w-full hover:scale-105 transition-transform duration-300" size="sm">
            📊 View Box Score
          </Button>
        )}
        {isUpcoming && (
          <Button variant="default" className="w-full hover:scale-105 transition-transform duration-300" size="sm">
            🎟️ Get Tickets
          </Button>
        )}
        {isLive && (
          <Button variant="destructive" className="w-full animate-pulse hover:scale-105 transition-transform duration-300" size="sm" asChild>
            <Link href={`/live/${match.id}`} className="flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />
              🔥 Watch Live
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

interface MatchListProps {
  matches: Match[]
  teams: Team[]
  title?: string
  limit?: number
  className?: string
}

export function MatchList({ matches, teams, title = "Recent Matches", limit, className }: MatchListProps) {
  const displayMatches = limit ? matches.slice(0, limit) : matches

  const getTeam = (teamId: string) => teams.find(team => team.id === teamId)

  return (
    <div className={className}>
      {title && (
        <h3 className="text-xl font-bold mb-6 text-center">{title}</h3>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {displayMatches.map((match) => {
          const homeTeam = getTeam(match.homeTeamId)
          const awayTeam = getTeam(match.awayTeamId)
          
          if (!homeTeam || !awayTeam) return null
          
          return (
            <MatchCard
              key={match.id}
              match={match}
              homeTeam={homeTeam}
              awayTeam={awayTeam}
            />
          )
        })}
      </div>
    </div>
  )
}
