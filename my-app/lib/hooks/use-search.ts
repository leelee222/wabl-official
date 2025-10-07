import { useQuery, useQueryClient } from '@tanstack/react-query'
import { SearchResult } from '@/lib/types'
import { useDebounce } from './use-debounce'

export const SEARCH_QUERY_KEYS = {
  all: ['search'] as const,
  queries: () => [...SEARCH_QUERY_KEYS.all, 'query'] as const,
  query: (q: string) => [...SEARCH_QUERY_KEYS.queries(), q] as const,
}

async function performSearch(query: string): Promise<{
  results: SearchResult[]
  total: number
  timestamp: string
}> {
  if (!query.trim()) {
    return { results: [], total: 0, timestamp: new Date().toISOString() }
  }

  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
  
  if (!response.ok) {
    throw new Error('Search failed')
  }
  
  return response.json()
}

export function useSearch(query: string, delay: number = 300) {
  const debouncedQuery = useDebounce(query, delay)
  
  return useQuery({
    queryKey: SEARCH_QUERY_KEYS.query(debouncedQuery),
    queryFn: () => performSearch(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useInstantSearch(query: string) {
  return useQuery({
    queryKey: SEARCH_QUERY_KEYS.query(query),
    queryFn: () => performSearch(query),
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

export function usePrefetchSearch() {
  const queryClient = useQueryClient()
  
  return (query: string) => {
    if (query.length > 0) {
      queryClient.prefetchQuery({
        queryKey: SEARCH_QUERY_KEYS.query(query),
        queryFn: () => performSearch(query),
        staleTime: 5 * 60 * 1000,
      })
    }
  }
}

export function useClearSearchCache() {
  const queryClient = useQueryClient()
  
  return () => {
    queryClient.removeQueries({ queryKey: SEARCH_QUERY_KEYS.all })
  }
}
