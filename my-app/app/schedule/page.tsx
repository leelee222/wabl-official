"use client"

import Link from "next/link"
import { getMatches, getTeams } from "@/lib/utils/data"
import { MatchList } from "@/components/features/match-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Trophy, Filter, Download, ChevronLeft, ChevronRight, Play } from "lucide-react"
import { useState, useMemo } from "react"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, parseISO, isSameDay } from "date-fns"

export default function SchedulePage() {
  const matches = getMatches()
  const teams = getTeams()

  const [filter, setFilter] = useState<'all' | 'completed' | 'upcoming' | 'live'>('all')
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [currentWeek, setCurrentWeek] = useState(new Date())

  const filteredMatches = useMemo(() => {
    switch (filter) {
      case 'completed':
        return matches.filter(match => match.status === 'completed')
      case 'upcoming':
        return matches.filter(match => match.status === 'upcoming')
      case 'live':
        return matches.filter(match => match.status === 'live')
      default:
        return matches
    }
  }, [matches, filter])

  const liveMatches = matches.filter(match => match.status === 'live')
  const upcomingMatches = matches.filter(match => match.status === 'upcoming')
  const completedMatches = matches.filter(match => match.status === 'completed')

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const getMatchesForDay = (day: Date) => {
    return filteredMatches.filter(match => {
      const matchDate = parseISO(match.date)
      return isSameDay(matchDate, day)
    })
  }

  const exportToCalendar = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//WABL//Basketball Schedule//EN
${upcomingMatches.map(match => {
      const matchDate = parseISO(match.date)
      const homeTeam = teams.find(t => t.id === match.homeTeamId)
      const awayTeam = teams.find(t => t.id === match.awayTeamId)
      return `BEGIN:VEVENT
DTSTART:${format(matchDate, "yyyyMMdd'T'HHmmss")}
SUMMARY:${awayTeam?.name} vs ${homeTeam?.name}
DESCRIPTION:WABL Match at ${match.venue}
LOCATION:${match.venue}
END:VEVENT`
    }).join('\n')}
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'wabl-schedule.ics'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-accent py-16 lg:py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex items-center justify-center mb-6">
              <Calendar className="h-8 w-8 text-white mr-3" />
              <Badge variant="outline" className="text-white border-white">
                2024 Season
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl mb-6">
              WABL Match Schedule
            </h1>
            <p className="text-lg text-white/90 max-w-4xl mx-auto">
              Follow all the action from the West African Basketball League. Complete fixtures, live scores, and match results.
            </p>
          </div>
        </div>
      </section>

      {liveMatches.length > 0 && (
        <section className="py-8 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <h2 className="text-2xl font-bold">Live Games</h2>
                </div>
                <Badge variant="destructive">LIVE</Badge>
              </div>
              <Button asChild>
                <Link href="/stats">View Stats Dashboard</Link>
              </Button>
            </div>
            <div className="grid gap-4">
              {liveMatches.map((match) => {
                const homeTeam = teams.find(t => t.id === match.homeTeamId)
                const awayTeam = teams.find(t => t.id === match.awayTeamId)
                return (
                  <Card key={match.id} className="overflow-hidden border-red-200 bg-red-50/30 dark:bg-red-950/30">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-1">{awayTeam?.city}</div>
                            <div className="font-bold text-lg">{awayTeam?.name}</div>
                            <div className="text-3xl font-bold text-primary">{match.score?.away || 0}</div>
                          </div>
                          <div className="text-2xl font-bold text-muted-foreground">VS</div>
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-1">{homeTeam?.city}</div>
                            <div className="font-bold text-lg">{homeTeam?.name}</div>
                            <div className="text-3xl font-bold text-primary">{match.score?.home || 0}</div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-sm font-medium text-red-600">LIVE</span>
                          </div>
                          <div className="text-sm text-muted-foreground mb-3">{match.venue}</div>
                          <Button asChild>
                            <Link href={`/live/${match.id}`}>
                              <Play className="w-4 h-4 mr-2" />
                              Watch Live Simulation
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className="py-8 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                All ({matches.length})
              </Button>
              <Button
                variant={filter === 'live' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('live')}
                className="flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Live ({liveMatches.length})
              </Button>
              <Button
                variant={filter === 'upcoming' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('upcoming')}
              >
                Upcoming ({upcomingMatches.length})
              </Button>
              <Button
                variant={filter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('completed')}
              >
                Completed ({completedMatches.length})
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8"
                >
                  List
                </Button>
                <Button
                  variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('calendar')}
                  className="h-8"
                >
                  Calendar
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCalendar}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </section>

      {viewMode === 'calendar' && (
        <section className="py-8 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous Week
              </Button>
              <h3 className="text-lg font-semibold">
                {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                className="flex items-center gap-2"
              >
                Next Week
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {weekDays.map((day) => {
                const dayMatches = getMatchesForDay(day)
                const isToday = isSameDay(day, new Date())

                return (
                  <Card key={day.toISOString()} className={`${isToday ? 'ring-2 ring-primary' : ''}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-center">
                        <div className={`${isToday ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                          {format(day, 'EEE')}
                        </div>
                        <div className={`text-lg ${isToday ? 'text-primary font-bold' : ''}`}>
                          {format(day, 'd')}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {dayMatches.length > 0 ? (
                        <div className="space-y-2">
                          {dayMatches.map((match) => {
                            const homeTeam = teams.find(t => t.id === match.homeTeamId)
                            const awayTeam = teams.find(t => t.id === match.awayTeamId)
                            return (
                              <div key={match.id} className="p-2 bg-muted/50 rounded text-xs">
                                <div className="font-medium truncate">
                                  {awayTeam?.name} vs {homeTeam?.name}
                                </div>
                                <div className="text-muted-foreground">
                                  {format(parseISO(match.date), 'HH:mm')}
                                </div>
                                {match.status === 'live' && (
                                  <div className="flex items-center gap-1 text-red-600">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                    LIVE
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground text-center py-4">
                          No matches
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {viewMode === 'list' && (
        <>
          {liveMatches.length > 0 && (
            <section className="py-12 lg:py-16 bg-red-50 dark:bg-red-950/20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center mb-8">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Live Now
                  </h2>
                </div>
                <MatchList matches={liveMatches} teams={teams} title="" />
              </div>
            </section>
          )}

          {(filter === 'all' || filter === 'upcoming') && upcomingMatches.length > 0 && (
            <section className="py-12 lg:py-16 bg-background">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center mb-8">
                  <Calendar className="h-6 w-6 text-primary mr-3" />
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Upcoming Matches
                  </h2>
                  <Badge variant="outline" className="ml-3">
                    {upcomingMatches.length} games
                  </Badge>
                </div>
                <MatchList matches={upcomingMatches} teams={teams} title="" />
              </div>
            </section>
          )}

          {(filter === 'all' || filter === 'completed') && completedMatches.length > 0 && (
            <section className="py-12 lg:py-16 bg-muted/30">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center mb-8">
                  <Trophy className="h-6 w-6 text-primary mr-3" />
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Recent Results
                  </h2>
                  <Badge variant="outline" className="ml-3">
                    {completedMatches.length} completed
                  </Badge>
                </div>
                <MatchList matches={completedMatches.slice(0, 10)} teams={teams} title="" />
              </div>
            </section>
          )}

          {filter === 'live' && liveMatches.length === 0 && (
            <section className="py-12 lg:py-16 bg-background">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                <div className="w-3 h-3 bg-muted-foreground rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">No live matches at the moment.</p>
              </div>
            </section>
          )}

          {filteredMatches.length === 0 && filter !== 'live' && (
            <section className="py-12 lg:py-16 bg-background">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No matches found for the selected filter.</p>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
