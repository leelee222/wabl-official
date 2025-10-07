import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Team } from '@/lib/types'

interface TeamsState {
  teams: Team[]
  loading: boolean
  error: string | null
  selectedTeam: Team | null
  filter: {
    country?: string
    sortBy: 'wins' | 'losses' | 'name' | 'city'
    order: 'asc' | 'desc'
  }
  
  setTeams: (teams: Team[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSelectedTeam: (team: Team | null) => void
  setFilter: (filter: Partial<TeamsState['filter']>) => void
  fetchTeams: () => Promise<void>
  fetchTeamById: (id: string) => Promise<void>
  sortTeams: () => void
  resetState: () => void
}

const initialState = {
  teams: [],
  loading: false,
  error: null,
  selectedTeam: null,
  filter: {
    sortBy: 'wins' as const,
    order: 'desc' as const,
  },
}

export const useTeamsStore = create<TeamsState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setTeams: (teams) => set({ teams }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        setSelectedTeam: (team) => set({ selectedTeam: team }),
        
        setFilter: (newFilter) => 
          set((state) => {
            const updatedFilter = { ...state.filter, ...newFilter }
            return { filter: updatedFilter }
          }),

        fetchTeams: async () => {
          const { filter } = get()
          set({ loading: true, error: null })
          
          try {
            const params = new URLSearchParams({
              sortBy: filter.sortBy,
              order: filter.order,
            })
            
            if (filter.country) {
              params.append('country', filter.country)
            }

            const response = await fetch(`/api/teams?${params}`)
            
            if (!response.ok) {
              throw new Error('Failed to fetch teams')
            }
            
            const data = await response.json()
            set({ teams: data.teams, loading: false })
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Unknown error',
              loading: false 
            })
          }
        },

        fetchTeamById: async (id: string) => {
          set({ loading: true, error: null })
          
          try {
            const response = await fetch(`/api/teams/${id}`)
            
            if (!response.ok) {
              throw new Error('Failed to fetch team')
            }
            
            const data = await response.json()
            set({ selectedTeam: data.team, loading: false })
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Unknown error',
              loading: false 
            })
          }
        },

        sortTeams: () => {
          const { teams, filter } = get()
          const sortedTeams = [...teams].sort((a, b) => {
            let aValue, bValue

            switch (filter.sortBy) {
              case 'wins':
                aValue = a.stats.wins
                bValue = b.stats.wins
                break
              case 'losses':
                aValue = a.stats.losses
                bValue = b.stats.losses
                break
              case 'name':
                aValue = a.name
                bValue = b.name
                break
              case 'city':
                aValue = a.city
                bValue = b.city
                break
              default:
                aValue = a.stats.wins
                bValue = b.stats.wins
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

          set({ teams: sortedTeams })
        },

        resetState: () => set(initialState),
      }),
      {
        name: 'teams-store',
        partialize: (state) => ({
          teams: state.teams,
          filter: state.filter,
        }),
      }
    ),
    {
      name: 'teams-store',
    }
  )
)
