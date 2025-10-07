import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Match } from '@/lib/types'

interface MatchesState {
  matches: Match[]
  loading: boolean
  error: string | null
  selectedMatch: Match | null
  filter: {
    teamId?: string
    status?: string
    sortBy: 'date' | 'homeTeam' | 'awayTeam' | 'venue'
    order: 'asc' | 'desc'
  }
  
  setMatches: (matches: Match[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSelectedMatch: (match: Match | null) => void
  setFilter: (filter: Partial<MatchesState['filter']>) => void
  fetchMatches: () => Promise<void>
  fetchMatchById: (id: string) => Promise<void>
  fetchMatchesByTeam: (teamId: string) => Promise<void>
  fetchUpcomingMatches: () => Promise<void>
  fetchCompletedMatches: () => Promise<void>
  sortMatches: () => void
  resetState: () => void
}

const initialState = {
  matches: [],
  loading: false,
  error: null,
  selectedMatch: null,
  filter: {
    sortBy: 'date' as const,
    order: 'desc' as const,
  },
}

export const useMatchesStore = create<MatchesState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setMatches: (matches) => set({ matches }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        setSelectedMatch: (match) => set({ selectedMatch: match }),
        
        setFilter: (newFilter) => 
          set((state) => {
            const updatedFilter = { ...state.filter, ...newFilter }
            return { filter: updatedFilter }
          }),

        fetchMatches: async () => {
          const { filter } = get()
          set({ loading: true, error: null })
          
          try {
            const params = new URLSearchParams({
              sortBy: filter.sortBy,
              order: filter.order,
            })
            
            if (filter.teamId) {
              params.append('teamId', filter.teamId)
            }
            
            if (filter.status) {
              params.append('status', filter.status)
            }

            const response = await fetch(`/api/matches?${params}`)
            
            if (!response.ok) {
              throw new Error('Failed to fetch matches')
            }
            
            const data = await response.json()
            set({ matches: data.matches, loading: false })
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Unknown error',
              loading: false 
            })
          }
        },

        fetchMatchById: async (id: string) => {
          set({ loading: true, error: null })
          
          try {
            const response = await fetch(`/api/matches/${id}`)
            
            if (!response.ok) {
              throw new Error('Failed to fetch match')
            }
            
            const data = await response.json()
            set({ selectedMatch: data.match, loading: false })
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Unknown error',
              loading: false 
            })
          }
        },

        fetchMatchesByTeam: async (teamId: string) => {
          set({ loading: true, error: null })
          
          try {
            const response = await fetch(`/api/matches?teamId=${teamId}`)
            
            if (!response.ok) {
              throw new Error('Failed to fetch team matches')
            }
            
            const data = await response.json()
            set({ matches: data.matches, loading: false })
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Unknown error',
              loading: false 
            })
          }
        },

        fetchUpcomingMatches: async () => {
          set({ loading: true, error: null })
          
          try {
            const response = await fetch('/api/matches?status=upcoming&sortBy=date&order=asc')
            
            if (!response.ok) {
              throw new Error('Failed to fetch upcoming matches')
            }
            
            const data = await response.json()
            set({ matches: data.matches, loading: false })
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Unknown error',
              loading: false 
            })
          }
        },

        fetchCompletedMatches: async () => {
          set({ loading: true, error: null })
          
          try {
            const response = await fetch('/api/matches?status=completed&sortBy=date&order=desc')
            
            if (!response.ok) {
              throw new Error('Failed to fetch completed matches')
            }
            
            const data = await response.json()
            set({ matches: data.matches, loading: false })
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Unknown error',
              loading: false 
            })
          }
        },

        sortMatches: () => {
          const { matches, filter } = get()
          const sortedMatches = [...matches].sort((a, b) => {
            let aValue, bValue

            switch (filter.sortBy) {
              case 'date':
                aValue = new Date(a.date).getTime()
                bValue = new Date(b.date).getTime()
                break
              case 'homeTeam':
                aValue = a.homeTeamId
                bValue = b.homeTeamId
                break
              case 'awayTeam':
                aValue = a.awayTeamId
                bValue = b.awayTeamId
                break
              case 'venue':
                aValue = a.venue
                bValue = b.venue
                break
              default:
                aValue = new Date(a.date).getTime()
                bValue = new Date(b.date).getTime()
            }

            if (typeof aValue === 'string') {
              return filter.order === 'asc' 
                ? aValue.localeCompare(bValue as string)
                : (bValue as string).localeCompare(aValue)
            }

            return filter.order === 'asc' 
              ? (aValue as number) - (bValue as number)
              : (bValue as number) - (aValue as number)
          })

          set({ matches: sortedMatches })
        },

        resetState: () => set(initialState),
      }),
      {
        name: 'matches-store',
        partialize: (state) => ({
          matches: state.matches,
          filter: state.filter,
        }),
      }
    ),
    {
      name: 'matches-store',
    }
  )
)
