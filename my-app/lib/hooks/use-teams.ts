import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Team } from '@/lib/types'

export const TEAMS_QUERY_KEYS = {
  all: ['teams'] as const,
  lists: () => [...TEAMS_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, string | number | boolean>) => [...TEAMS_QUERY_KEYS.lists(), filters] as const,
  details: () => [...TEAMS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...TEAMS_QUERY_KEYS.details(), id] as const,
}

async function fetchTeams(filters: {
  sortBy?: string
  order?: string
  country?: string
  limit?: number
} = {}): Promise<{ teams: Team[]; total: number; timestamp: string }> {
  const params = new URLSearchParams()
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value))
    }
  })

  const response = await fetch(`/api/teams?${params}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch teams')
  }
  
  return response.json()
}

async function fetchTeamById(id: string): Promise<{ team: Team; timestamp: string }> {
  const response = await fetch(`/api/teams/${id}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch team')
  }
  
  return response.json()
}

async function createTeam(teamData: Partial<Team>): Promise<{ team: Team; message: string }> {
  const response = await fetch('/api/teams', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(teamData),
  })
  
  if (!response.ok) {
    throw new Error('Failed to create team')
  }
  
  return response.json()
}

async function updateTeam(id: string, teamData: Partial<Team>): Promise<{ team: Team; message: string }> {
  const response = await fetch(`/api/teams/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(teamData),
  })
  
  if (!response.ok) {
    throw new Error('Failed to update team')
  }
  
  return response.json()
}

async function deleteTeam(id: string): Promise<{ message: string }> {
  const response = await fetch(`/api/teams/${id}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    throw new Error('Failed to delete team')
  }
  
  return response.json()
}

export function useTeams(filters: Parameters<typeof fetchTeams>[0] = {}) {
  return useQuery({
    queryKey: TEAMS_QUERY_KEYS.list(filters),
    queryFn: () => fetchTeams(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useTeam(id: string) {
  return useQuery({
    queryKey: TEAMS_QUERY_KEYS.detail(id),
    queryFn: () => fetchTeamById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useCreateTeam() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEYS.lists() })
    },
  })
}

export function useUpdateTeam() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Team> }) => updateTeam(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEYS.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEYS.lists() })
    },
  })
}

export function useDeleteTeam() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteTeam,
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: TEAMS_QUERY_KEYS.detail(id) })
      queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEYS.lists() })
    },
  })
}

export function usePrefetchTeam() {
  const queryClient = useQueryClient()
  
  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: TEAMS_QUERY_KEYS.detail(id),
      queryFn: () => fetchTeamById(id),
      staleTime: 5 * 60 * 1000,
    })
  }
}

export function usePrefetchTeams() {
  const queryClient = useQueryClient()
  
  return (filters: Parameters<typeof fetchTeams>[0] = {}) => {
    queryClient.prefetchQuery({
      queryKey: TEAMS_QUERY_KEYS.list(filters),
      queryFn: () => fetchTeams(filters),
      staleTime: 5 * 60 * 1000,
    })
  }
}
