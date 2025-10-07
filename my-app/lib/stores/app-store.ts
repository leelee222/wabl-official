import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Theme, SearchResult } from '@/lib/types'

interface AppState {
    sidebarOpen: boolean
    searchOpen: boolean
    loading: boolean
    
  theme: Theme
  
  searchQuery: string
  searchResults: SearchResult[]
  searchLoading: boolean
  
  currentPage: string
  breadcrumbs: { label: string; href: string }[]
  
  notifications: {
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    timestamp: number
  }[]
  
  setSidebarOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
  setLoading: (loading: boolean) => void
  setTheme: (theme: Theme) => void
  setSearchQuery: (query: string) => void
  setSearchResults: (results: SearchResult[]) => void
  setSearchLoading: (loading: boolean) => void
  setCurrentPage: (page: string) => void
  setBreadcrumbs: (breadcrumbs: { label: string; href: string }[]) => void
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  performSearch: (query: string) => Promise<void>
  resetState: () => void
}

const initialState = {
  sidebarOpen: false,
  searchOpen: false,
  loading: false,
  theme: 'system' as Theme,
  searchQuery: '',
  searchResults: [],
  searchLoading: false,
  currentPage: '',
  breadcrumbs: [],
  notifications: [],
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        setSearchOpen: (open) => set({ searchOpen: open }),
        setLoading: (loading) => set({ loading }),
        setTheme: (theme) => set({ theme }),
        setSearchQuery: (query) => set({ searchQuery: query }),
        setSearchResults: (results) => set({ searchResults: results }),
        setSearchLoading: (loading) => set({ searchLoading: loading }),
        setCurrentPage: (page) => set({ currentPage: page }),
        setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),

        addNotification: (notification) => {
          const id = `notification-${Date.now()}-${Math.random()}`
          const newNotification = {
            ...notification,
            id,
            timestamp: Date.now(),
          }
          
          set((state) => ({
            notifications: [...state.notifications, newNotification]
          }))

          setTimeout(() => {
            get().removeNotification(id)
          }, 5000)
        },

        removeNotification: (id) => {
          set((state) => ({
            notifications: state.notifications.filter(n => n.id !== id)
          }))
        },

        clearNotifications: () => set({ notifications: [] }),

        performSearch: async (query: string) => {
          if (!query.trim()) {
            set({ searchResults: [], searchQuery: '' })
            return
          }

          set({ searchLoading: true, searchQuery: query })
          
          try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
            
            if (!response.ok) {
              throw new Error('Search failed')
            }
            
            const data = await response.json()
            set({ 
              searchResults: data.results || [],
              searchLoading: false 
            })
          } catch (error) {
            console.error('Search error:', error)
            set({ searchLoading: false })
            get().addNotification({
              type: 'error',
              title: 'Search Error',
              message: 'Failed to perform search. Please try again.',
            })
          }
        },

        resetState: () => set({
          ...initialState,
          theme: get().theme,
        }),
      }),
      {
        name: 'app-store',
        partialize: (state) => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    {
      name: 'app-store',
    }
  )
)
