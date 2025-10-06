"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Users, Calendar, Trophy, ArrowLeft } from 'lucide-react'
import { useSearch } from '@/lib/hooks/use-search'
import Link from 'next/link'
import Image from 'next/image'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const { results, isLoading, error } = useSearch(query)

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery)
    }
  }, [initialQuery])

  const hasResults = results && (results.teams.length > 0 || results.players.length > 0 || results.matches.length > 0)

  return (
    <div className="flex flex-col min-h-screen">
      <section className="border-b bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Search WABL</h1>
              <p className="text-muted-foreground">Find teams, players, and matches</p>
            </div>
          </div>
          
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search teams, players, matches..."
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              className="pl-10 text-base h-12"
              autoFocus
            />
          </div>
        </div>
      </section>

      <section className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-pulse text-muted-foreground">Searching...</div>
            </div>
          )}

          {error && (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-destructive">Error: {error}</p>
              </CardContent>
            </Card>
          )}

          {!query && !isLoading && (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h2 className="text-xl font-semibold mb-4">Search the WABL Database</h2>
                <p className="text-muted-foreground mb-6">
                  Discover teams, players, and matches from across West Africa
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className="cursor-pointer" onClick={() => setQuery('Lagos')}>
                    Lagos Lions
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer" onClick={() => setQuery('Nigeria')}>
                    Nigeria
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer" onClick={() => setQuery('Basketball')}>
                    Basketball
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer" onClick={() => setQuery('2024')}>
                    2024 Season
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {query && !isLoading && !hasResults && (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-lg font-semibold mb-2">No results found</h2>
                <p className="text-muted-foreground">
                  No results found for &ldquo;{query}&rdquo;. Try a different search term.
                </p>
              </CardContent>
            </Card>
          )}

          {hasResults && (
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">
                  Search results for &ldquo;{query}&rdquo;
                </h2>
                <Badge variant="outline">
                  {results.total} total results
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-4">
                  {results.teams.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Users className="h-5 w-5 text-primary" />
                          Teams
                          <Badge variant="outline">{results.teams.length}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {results.teams.map((team) => (
                          <Link
                            key={team.id}
                            href={`/teams/${team.id}`}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                          >
                            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                              <Image
                                src={team.logo}
                                alt={`${team.name} logo`}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{team.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {team.city}, {team.country}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="space-y-4">
                  {results.players.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Trophy className="h-5 w-5 text-primary" />
                          Players
                          <Badge variant="outline">{results.players.length}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {results.players.map((player) => (
                          <div
                            key={player.id}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                          >
                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
                              <Image
                                src={player.photo}
                                alt={player.name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{player.name}</div>
                              <div className="text-sm text-muted-foreground">
                                #{player.number} • {player.position}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {player.team?.name}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-mono">
                                {player.stats.ppg.toFixed(1)}
                              </div>
                              <div className="text-xs text-muted-foreground">PPG</div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="space-y-4">
                  {results.matches.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Calendar className="h-5 w-5 text-primary" />
                          Matches
                          <Badge variant="outline">{results.matches.length}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {results.matches.map((match) => (
                          <div
                            key={match.id}
                            className="p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium text-sm">
                                {match.awayTeam?.name} vs {match.homeTeam?.name}
                              </div>
                              <Badge 
                                variant={match.status === 'live' ? 'destructive' : 'outline'}
                                className="text-xs"
                              >
                                {match.status}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(match.date).toLocaleDateString()} • {match.venue}
                            </div>
                            {match.score && (
                              <div className="text-sm font-mono mt-1">
                                {match.score.away} - {match.score.home}
                              </div>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
