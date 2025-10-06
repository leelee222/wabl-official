"use client"

import { useState, useRef, useEffect } from 'react'
import { Search, X, Users, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSearch } from '@/lib/hooks/use-search'
import Link from 'next/link'
import Image from 'next/image'

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [showInlineResults, setShowInlineResults] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { results, isLoading } = useSearch(query)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isOpen && !showInlineResults) {
        e.preventDefault()
        setShowInlineResults(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
      if (e.key === 'Escape') {
        if (showInlineResults) {
          setShowInlineResults(false)
          setQuery('')
        } else if (isOpen) {
          handleClose()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, showInlineResults])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowInlineResults(false)
        setQuery('')
      }
    }

    if (showInlineResults) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showInlineResults])

  const handleClose = () => {
    setIsOpen(false)
    setQuery('')
  }

  const handleInlineSearch = (value: string) => {
    setQuery(value)
  }

  const hasResults = results && (results.teams.length > 0 || results.players.length > 0 || results.matches.length > 0)

  return (
    <div ref={containerRef} className="relative">
      <div className="hidden lg:block relative">
        {!showInlineResults ? (
          <Button 
            variant="outline" 
            onClick={() => setShowInlineResults(true)}
            className="w-64 justify-start text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted/50 border-muted"
          >
            <Search className="h-4 w-4 mr-2" />
            Search... 
            <Badge variant="outline" className="ml-auto text-xs">
              /
            </Badge>
          </Button>
        ) : (
          <div className="w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder="Search teams, players..."
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInlineSearch(e.target.value)}
                className="pl-10 pr-10 w-full"
                autoFocus
              />
              {query && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setQuery('')
                    setShowInlineResults(false)
                  }}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {showInlineResults && query && (
              <Card className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto z-50 shadow-lg">
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="p-4 text-center text-muted-foreground">
                      <div className="animate-pulse">Searching...</div>
                    </div>
                  ) : !hasResults ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No results found for "{query}"
                    </div>
                  ) : (
                    <div className="py-2">
                      {results && results.teams.length > 0 && (
                        <div className="px-4 py-2">
                          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-2">
                            <Trophy className="h-4 w-4" />
                            Teams ({results.teams.length})
                          </div>
                          {results.teams.slice(0, 3).map((team) => (
                            <Link
                              key={team.id}
                              href={`/teams/${team.id}`}
                              onClick={() => {
                                setShowInlineResults(false)
                                setQuery('')
                              }}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                <Image
                                  src={team.logo}
                                  alt={`${team.name} logo`}
                                  fill
                                  className="object-cover"
                                  sizes="32px"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              </div>
                              <div>
                                <div className="font-medium text-sm">{team.name}</div>
                                <div className="text-xs text-muted-foreground">{team.city}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      {results && results.players.length > 0 && (
                        <div className="px-4 py-2 border-t">
                          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-2">
                            <Users className="h-4 w-4" />
                            Players ({results.players.length})
                          </div>
                          {results.players.slice(0, 3).map((player) => (
                            <Link
                              key={player.id}
                              href={`/players/${player.id}`}
                              onClick={() => {
                                setShowInlineResults(false)
                                setQuery('')
                              }}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted">
                                <Image
                                  src={player.photo}
                                  alt={player.name}
                                  fill
                                  className="object-cover"
                                  sizes="32px"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              </div>
                              <div>
                                <div className="font-medium text-sm">{player.name}</div>
                                <div className="text-xs text-muted-foreground">#{player.number} • {player.position}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      {results && (results.teams.length > 3 || results.players.length > 3 || results.matches.length > 0) && (
                        <div className="px-4 py-2 border-t">
                          <Link
                            href={`/search?q=${encodeURIComponent(query)}`}
                            onClick={() => {
                              setShowInlineResults(false)
                              setQuery('')
                            }}
                            className="block text-center text-sm text-primary hover:text-primary/80 py-2"
                          >
                            View all results →
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsOpen(true)}
        className="lg:hidden text-muted-foreground hover:text-primary relative"
        title="Search (Press / to focus)"
      >
        <Search className="h-5 w-5" />
        <span className="sr-only">Search</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden">
          <div className="fixed top-0 left-0 right-0 p-4 border-b bg-background">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder="Search teams, players..."
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                className="pl-10 pr-10"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-16 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {query && (
              <div className="p-4">
                {isLoading ? (
                  <div className="text-center text-muted-foreground py-8">
                    <div className="animate-pulse">Searching...</div>
                  </div>
                ) : !hasResults ? (
                  <div className="text-center text-muted-foreground py-8">
                    No results found for "{query}"
                  </div>
                ) : (
                  <div className="space-y-6">
                    {results && results.teams.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3">
                          <Trophy className="h-4 w-4" />
                          Teams ({results.teams.length})
                        </div>
                        <div className="space-y-2">
                          {results.teams.map((team) => (
                            <Link
                              key={team.id}
                              href={`/teams/${team.id}`}
                              onClick={handleClose}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                <Image
                                  src={team.logo}
                                  alt={`${team.name} logo`}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              </div>
                              <div>
                                <div className="font-medium">{team.name}</div>
                                <div className="text-sm text-muted-foreground">{team.city}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {results && results.players.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3">
                          <Users className="h-4 w-4" />
                          Players ({results.players.length})
                        </div>
                        <div className="space-y-2">
                          {results.players.map((player) => (
                            <Link
                              key={player.id}
                              href={`/players/${player.id}`}
                              onClick={handleClose}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
                                <Image
                                  src={player.photo}
                                  alt={player.name}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              </div>
                              <div>
                                <div className="font-medium">{player.name}</div>
                                <div className="text-sm text-muted-foreground">#{player.number} • {player.position}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function MobileSearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { results, isLoading } = useSearch(query)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleClose = () => {
    setIsOpen(false)
    setQuery('')
  }

  const hasResults = results && (results.teams.length > 0 || results.players.length > 0 || results.matches.length > 0)

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsOpen(true)}
        className="w-full justify-start text-muted-foreground hover:text-primary"
      >
        <Search className="h-4 w-4 mr-2" />
        Search...
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
          <div className="fixed top-0 left-0 right-0 p-4 border-b bg-background">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder="Search teams, players..."
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                className="pl-10 pr-10"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-16 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {query && (
              <div className="p-4">
                {isLoading ? (
                  <div className="text-center text-muted-foreground py-8">
                    <div className="animate-pulse">Searching...</div>
                  </div>
                ) : !hasResults ? (
                  <div className="text-center text-muted-foreground py-8">
                    No results found for "{query}"
                  </div>
                ) : (
                  <div className="space-y-6">
                    {results && results.teams.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3">
                          <Trophy className="h-4 w-4" />
                          Teams ({results.teams.length})
                        </div>
                        <div className="space-y-2">
                          {results.teams.map((team) => (
                            <Link
                              key={team.id}
                              href={`/teams/${team.id}`}
                              onClick={handleClose}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                <Image
                                  src={team.logo}
                                  alt={`${team.name} logo`}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              </div>
                              <div>
                                <div className="font-medium">{team.name}</div>
                                <div className="text-sm text-muted-foreground">{team.city}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {results && results.players.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3">
                          <Users className="h-4 w-4" />
                          Players ({results.players.length})
                        </div>
                        <div className="space-y-2">
                          {results.players.map((player) => (
                            <Link
                              key={player.id}
                              href={`/players/${player.id}`}
                              onClick={handleClose}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
                                <Image
                                  src={player.photo}
                                  alt={player.name}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              </div>
                              <div>
                                <div className="font-medium">{player.name}</div>
                                <div className="text-sm text-muted-foreground">#{player.number} • {player.position}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
