import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Player } from '@/lib/types'

interface PlayersState {
  players: Player[]
  loading: boolean
  error: string | null
  selectedPlayer: Player | null
  filter: {
    teamId?: string
    position?: string
    sortBy: 'ppg' | 'rpg' | 'apg' | 'name' | 'age'
    order: 'asc' | 'desc'
  }
  
  setPlayers: (players: Player[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSelectedPlayer: (player: Player | null) => void
  setFilter: (filter: Partial<PlayersState['filter']>) => void
  fetchPlayers: () => Promise<void>
  fetchPlayerById: (id: string) => Promise<void>
  fetchPlayersByTeam: (teamId: string) => Promise<void>
  sortPlayers: () => void
  resetState: () => void
}

const initialState = {
  players: [],
  loading: false,
  error: null,
  selectedPlayer: null,
  filter: {
    sortBy: 'ppg' as const,
    order: 'desc' as const,
  },
}

export const usePlayersStore = create<PlayersState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setPlayers: (players) => set({ players }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        setSelectedPlayer: (player) => set({ selectedPlayer: player }),
        
        setFilter: (newFilter) => 
          set((state) => {
            const updatedFilter = { ...state.filter, ...newFilter }
            return { filter: updatedFilter }
          }),

        fetchPlayers: async () => {
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
            
            if (filter.position) {
              params.append('position', filter.position)
            }

            const response = await fetch(`/api/players?${params}`)
            
            if (!response.ok) {
              throw new Error('Failed to fetch players')
            }
            
            const data = await response.json()
            set({ players: data.players, loading: false })
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Unknown error',
              loading: false 
            })
          }
        },

        fetchPlayerById: async (id: string) => {
          set({ loading: true, error: null })
          
          try {
            const response = await fetch(`/api/players/${id}`)
            
            if (!response.ok) {
              throw new Error('Failed to fetch player')
            }
            
            const data = await response.json()
            set({ selectedPlayer: data.player, loading: false })
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Unknown error',
              loading: false 
            })
          }
        },

        fetchPlayersByTeam: async (teamId: string) => {
          set({ loading: true, error: null })
          
          try {
            const response = await fetch(`/api/players?teamId=${teamId}`)
            
            if (!response.ok) {
              throw new Error('Failed to fetch team players')
            }
            
            const data = await response.json()
            set({ players: data.players, loading: false })
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Unknown error',
              loading: false 
            })
          }
        },

        sortPlayers: () => {
          const { players, filter } = get()
          const sortedPlayers = [...players].sort((a, b) => {
            let aValue, bValue

            switch (filter.sortBy) {
              case 'ppg':
                aValue = a.stats.ppg
                bValue = b.stats.ppg
                break
              case 'rpg':
                aValue = a.stats.rpg
                bValue = b.stats.rpg
                break
              case 'apg':
                aValue = a.stats.apg
                bValue = b.stats.apg
                break
              case 'name':
                aValue = a.name
                bValue = b.name
                break
              case 'age':
                aValue = a.age
                bValue = b.age
                break
              default:
                aValue = a.stats.ppg
                bValue = b.stats.ppg
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

          set({ players: sortedPlayers })
        },

        resetState: () => set(initialState),
      }),
      {
        name: 'players-store',
        partialize: (state) => ({
          players: state.players,
          filter: state.filter,
        }),
      }
    ),
    {
      name: 'players-store',
    }
  )
)
