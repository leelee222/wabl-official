import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Player } from '@/lib/types'

export const PLAYERS_QUERY_KEYS = {
  all: ['players'] as const,
  lists: () => [...PLAYERS_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, string | number | boolean>) => [...PLAYERS_QUERY_KEYS.lists(), filters] as const,
  details: () => [...PLAYERS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PLAYERS_QUERY_KEYS.details(), id] as const,
  byTeam: (teamId: string) => [...PLAYERS_QUERY_KEYS.all, 'team', teamId] as const,
}

async function fetchPlayers(filters: {
  teamId?: string
  position?: string
  sortBy?: string
  order?: string
  limit?: number
} = {}): Promise<{ players: Player[]; total: number; filters: Record<string, unknown>; timestamp: string }> {
  const params = new URLSearchParams()
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value))
    }
  })

  const response = await fetch(`/api/players?${params}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch players')
  }
  
  return response.json()
}

async function fetchPlayerById(id: string): Promise<{ player: Player; timestamp: string }> {
  const response = await fetch(`/api/players/${id}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch player')
  }
  
  return response.json()
}

async function createPlayer(playerData: Partial<Player>): Promise<{ player: Player; message: string }> {
  const response = await fetch('/api/players', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(playerData),
  })
  
  if (!response.ok) {
    throw new Error('Failed to create player')
  }
  
  return response.json()
}

async function updatePlayer(id: string, playerData: Partial<Player>): Promise<{ player: Player; message: string }> {
  const response = await fetch(`/api/players/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(playerData),
  })
  
  if (!response.ok) {
    throw new Error('Failed to update player')
  }
  
  return response.json()
}

async function deletePlayer(id: string): Promise<{ message: string }> {
  const response = await fetch(`/api/players/${id}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    throw new Error('Failed to delete player')
  }
  
  return response.json()
}

export function usePlayers(filters: Parameters<typeof fetchPlayers>[0] = {}) {
  return useQuery({
    queryKey: PLAYERS_QUERY_KEYS.list(filters),
    queryFn: () => fetchPlayers(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function usePlayer(id: string) {
  return useQuery({
    queryKey: PLAYERS_QUERY_KEYS.detail(id),
    queryFn: () => fetchPlayerById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function usePlayersByTeam(teamId: string) {
  return useQuery({
    queryKey: PLAYERS_QUERY_KEYS.byTeam(teamId),
    queryFn: () => fetchPlayers({ teamId }),
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useCreatePlayer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createPlayer,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PLAYERS_QUERY_KEYS.lists() })
      if (data.player.teamId) {
        queryClient.invalidateQueries({ queryKey: PLAYERS_QUERY_KEYS.byTeam(data.player.teamId) })
      }
    },
  })
}

export function useUpdatePlayer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Player> }) => updatePlayer(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: PLAYERS_QUERY_KEYS.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: PLAYERS_QUERY_KEYS.lists() })
      if (data.player.teamId) {
        queryClient.invalidateQueries({ queryKey: PLAYERS_QUERY_KEYS.byTeam(data.player.teamId) })
      }
    },
  })
}

export function useDeletePlayer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deletePlayer,
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: PLAYERS_QUERY_KEYS.detail(id) })
      queryClient.invalidateQueries({ queryKey: PLAYERS_QUERY_KEYS.lists() })
    },
  })
}

export function usePrefetchPlayer() {
  const queryClient = useQueryClient()
  
  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: PLAYERS_QUERY_KEYS.detail(id),
      queryFn: () => fetchPlayerById(id),
      staleTime: 5 * 60 * 1000,
    })
  }
}

export function usePrefetchPlayers() {
  const queryClient = useQueryClient()
  
  return (filters: Parameters<typeof fetchPlayers>[0] = {}) => {
    queryClient.prefetchQuery({
      queryKey: PLAYERS_QUERY_KEYS.list(filters),
      queryFn: () => fetchPlayers(filters),
      staleTime: 5 * 60 * 1000,
    })
  }
}
