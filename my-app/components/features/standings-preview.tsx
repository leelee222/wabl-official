'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, TrendingUp, TrendingDown } from "lucide-react"
import { Team, getWinStreak, getTeamAverages } from "@/lib/utils/data"
import Link from "next/link"

interface StandingsPreviewProps {
  teams: Team[]
  limit?: number
  showFullButton?: boolean
  className?: string
  showTitle?: boolean
}

export function StandingsPreview({ teams, limit = 4, showFullButton = true, className, showTitle = true }: StandingsPreviewProps) {
  const sortedTeams = teams
    .sort((a, b) => {
      if (b.stats.wins !== a.stats.wins) {
        return b.stats.wins - a.stats.wins
      }
      return a.stats.losses - b.stats.losses
    })
    .slice(0, limit)

  return (
    <div className={`${className}`}>
      {showTitle && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-primary" />
            League Standings
          </h3>
          {limit < teams.length && (
            <Badge variant="outline" className="text-xs">
              Top {limit}
            </Badge>
          )}
        </div>
      )}
      
      <Card>
        <CardContent className="p-5">
        <div className="space-y-3">
          {sortedTeams.map((team, index) => {
            const streak = getWinStreak(team.id)
            const averages = getTeamAverages(team)
            const winPct = ((team.stats.wins / (team.stats.wins + team.stats.losses)) * 100).toFixed(1)
            
            return (
              <div 
                key={team.id} 
                className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted flex-shrink-0">
                    <span className="text-sm font-bold text-foreground">
                      {index + 1}
                    </span>
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium truncate text-sm">{team.name}</span>
                      {index === 0 && (
                        <Trophy className="h-4 w-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {winPct}% • {averages.ppg} PPG
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-mono font-medium">
                      {team.stats.wins}-{team.stats.losses}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {team.stats.home_record.split('-')[0]}H
                    </div>
                  </div>
                  
                  <Badge 
                    variant={streak.type === 'W' ? 'success' : 'destructive'} 
                    className="text-xs min-w-[40px] justify-center"
                  >
                    {streak.type}{streak.count}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
        
        {showFullButton && (
          <div className="mt-6 pt-4 border-t">
            <Link href="/standings">
              <Button variant="outline" className="w-full">
                View Full Standings
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
    </div>
  )
}

interface QuickStatsProps {
  teams: Team[]
  className?: string
}

export function QuickStats({ teams, className }: QuickStatsProps) {
  const totalGames = teams.reduce((sum, team) => sum + team.stats.wins + team.stats.losses, 0) / 2
  const avgPointsPerGame = teams.reduce((sum, team) => sum + team.stats.points_for, 0) / teams.length
  const totalAttendance = 450000

  const stats = [
    { 
      label: "Total Games", 
      value: totalGames.toString(), 
      icon: TrendingUp, 
      color: "text-blue-600",
      subtitle: "This season"
    },
    { 
      label: "Avg Points", 
      value: Math.round(avgPointsPerGame).toString(), 
      icon: Trophy, 
      color: "text-green-600",
      subtitle: "Per team/game"
    },
    { 
      label: "Total Fans", 
      value: `${Math.round(totalAttendance / 1000)}K`, 
      icon: TrendingUp, 
      color: "text-purple-600",
      subtitle: "Season attendance"
    },
    { 
      label: "Countries", 
      value: "8", 
      icon: TrendingDown, 
      color: "text-orange-600",
      subtitle: "West Africa"
    },
  ]

  return (
    <div className={`grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <div key={stat.label} className="text-center animate-count-up" style={{ animationDelay: `${index * 0.1}s` }}>
          <div className={`mx-auto flex h-12 w-12 lg:h-14 lg:w-14 items-center justify-center rounded-lg bg-muted/50`}>
            <stat.icon className={`h-6 w-6 lg:h-7 lg:w-7 ${stat.color}`} />
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold tracking-tight text-foreground lg:text-3xl">{stat.value}</div>
            <div className="text-xs text-muted-foreground lg:text-sm font-medium">{stat.label}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.subtitle}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
