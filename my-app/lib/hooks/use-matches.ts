import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Match } from '@/lib/types'

export const MATCHES_QUERY_KEYS = {
  all: ['matches'] as const,
  lists: () => [...MATCHES_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, string | number | boolean>) => [...MATCHES_QUERY_KEYS.lists(), filters] as const,
  details: () => [...MATCHES_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...MATCHES_QUERY_KEYS.details(), id] as const,
  byTeam: (teamId: string) => [...MATCHES_QUERY_KEYS.all, 'team', teamId] as const,
  upcoming: () => [...MATCHES_QUERY_KEYS.all, 'upcoming'] as const,
  completed: () => [...MATCHES_QUERY_KEYS.all, 'completed'] as const,
  live: () => [...MATCHES_QUERY_KEYS.all, 'live'] as const,
}

async function fetchMatches(filters: {
  teamId?: string
  status?: string
  sortBy?: string
  order?: string
  limit?: number
} = {}): Promise<{ matches: Match[]; total: number; filters: Record<string, unknown>; timestamp: string }> {
  const params = new URLSearchParams()
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value))
    }
  })

  const response = await fetch(`/api/matches?${params}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch matches')
  }
  
  return response.json()
}

async function fetchMatchById(id: string): Promise<{ match: Match; timestamp: string }> {
  const response = await fetch(`/api/matches/${id}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch match')
  }
  
  return response.json()
}

async function createMatch(matchData: Partial<Match>): Promise<{ match: Match; message: string }> {
  const response = await fetch('/api/matches', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(matchData),
  })
  
  if (!response.ok) {
    throw new Error('Failed to create match')
  }
  
  return response.json()
}

async function updateMatch(id: string, matchData: Partial<Match>): Promise<{ match: Match; message: string }> {
  const response = await fetch(`/api/matches/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(matchData),
  })
  
  if (!response.ok) {
    throw new Error('Failed to update match')
  }
  
  return response.json()
}

async function deleteMatch(id: string): Promise<{ message: string }> {
  const response = await fetch(`/api/matches/${id}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    throw new Error('Failed to delete match')
  }
  
  return response.json()
}

export function useMatches(filters: Parameters<typeof fetchMatches>[0] = {}) {
  return useQuery({
    queryKey: MATCHES_QUERY_KEYS.list(filters),
    queryFn: () => fetchMatches(filters),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useMatch(id: string) {
  return useQuery({
    queryKey: MATCHES_QUERY_KEYS.detail(id),
    queryFn: () => fetchMatchById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useMatchesByTeam(teamId: string) {
  return useQuery({
    queryKey: MATCHES_QUERY_KEYS.byTeam(teamId),
    queryFn: () => fetchMatches({ teamId }),
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useUpcomingMatches() {
  return useQuery({
    queryKey: MATCHES_QUERY_KEYS.upcoming(),
    queryFn: () => fetchMatches({ status: 'upcoming', sortBy: 'date', order: 'asc' }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useCompletedMatches() {
  return useQuery({
    queryKey: MATCHES_QUERY_KEYS.completed(),
    queryFn: () => fetchMatches({ status: 'completed', sortBy: 'date', order: 'desc' }),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export function useLiveMatches() {
  return useQuery({
    queryKey: MATCHES_QUERY_KEYS.live(),
    queryFn: () => fetchMatches({ status: 'live' }),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000,
  })
}

export function useCreateMatch() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createMatch,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: MATCHES_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: MATCHES_QUERY_KEYS.upcoming() })
      
      if (data.match.homeTeamId) {
        queryClient.invalidateQueries({ queryKey: MATCHES_QUERY_KEYS.byTeam(data.match.homeTeamId) })
      }
      if (data.match.awayTeamId) {
        queryClient.invalidateQueries({ queryKey: MATCHES_QUERY_KEYS.byTeam(data.match.awayTeamId) })
      }
    },
  })
}

export function useUpdateMatch() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Match> }) => updateMatch(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: MATCHES_QUERY_KEYS.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: MATCHES_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: MATCHES_QUERY_KEYS.upcoming() })
      queryClient.invalidateQueries({ queryKey: MATCHES_QUERY_KEYS.completed() })
      queryClient.invalidateQueries({ queryKey: MATCHES_QUERY_KEYS.live() })
      
      if (data.match.homeTeamId) {
        queryClient.invalidateQueries({ queryKey: MATCHES_QUERY_KEYS.byTeam(data.match.homeTeamId) })
      }
      if (data.match.awayTeamId) {
        queryClient.invalidateQueries({ queryKey: MATCHES_QUERY_KEYS.byTeam(data.match.awayTeamId) })
      }
    },
  })
}

export function useDeleteMatch() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteMatch,
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: MATCHES_QUERY_KEYS.detail(id) })
      queryClient.invalidateQueries({ queryKey: MATCHES_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: MATCHES_QUERY_KEYS.upcoming() })
      queryClient.invalidateQueries({ queryKey: MATCHES_QUERY_KEYS.completed() })
    },
  })
}

export function usePrefetchMatch() {
  const queryClient = useQueryClient()
  
  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: MATCHES_QUERY_KEYS.detail(id),
      queryFn: () => fetchMatchById(id),
      staleTime: 2 * 60 * 1000,
    })
  }
}

export function usePrefetchMatches() {
  const queryClient = useQueryClient()
  
  return (filters: Parameters<typeof fetchMatches>[0] = {}) => {
    queryClient.prefetchQuery({
      queryKey: MATCHES_QUERY_KEYS.list(filters),
      queryFn: () => fetchMatches(filters),
      staleTime: 2 * 60 * 1000,
    })
  }
}
