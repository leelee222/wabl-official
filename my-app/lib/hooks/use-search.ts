import { useState, useEffect, useCallback } from 'react'
import { Team, Player, Match } from '@/lib/utils/data'

interface SearchResult {
  teams: Team[]
  players: (Player & { team?: Team })[]
  matches: (Match & { homeTeam?: Team; awayTeam?: Team })[]
  total: number
  query: string
}

export function useSearch(query: string, delay: number = 300) {
  const [results, setResults] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      if (!response.ok) {
        throw new Error('Search failed')
      }
      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      setResults(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      search(query)
    }, delay)

    return () => clearTimeout(timer)
  }, [query, delay, search])

  return { results, isLoading, error }
}
