import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AuthState } from '@/types'
import { authApi } from '@/lib/api'

interface AuthStore extends AuthState {
  login: (email: string, password: string, outletId?: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  updateUser: (user: Partial<User>) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (email: string, password: string, outletId?: string) => {
        try {
          set({ isLoading: true })
          const response = await authApi.login({ email, password, outletId })

          const { user, accessToken, refreshToken } = response.data

          // Store tokens in localStorage for axios interceptors
          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', refreshToken)

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: async () => {
        try {
          if (get().refreshToken) {
            await authApi.logout()
          }
        } catch (error) {
          // Ignore logout errors
        } finally {
          // Clear local storage
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')

          // Clear store
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      checkAuth: async () => {
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')
        const userStr = localStorage.getItem('user')

        if (!accessToken || !refreshToken) {
          set({ isLoading: false })
          return
        }

        try {
          set({ isLoading: true })
          const response = await authApi.me()
          const user = response.data.data

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          // Auth check failed, clear everything
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')

          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData }
          set({ user: updatedUser })
          localStorage.setItem('user', JSON.stringify(updatedUser))
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Restore tokens to localStorage for axios interceptors
          if (state.accessToken) {
            localStorage.setItem('accessToken', state.accessToken)
          }
          if (state.refreshToken) {
            localStorage.setItem('refreshToken', state.refreshToken)
          }
          if (state.user) {
            localStorage.setItem('user', JSON.stringify(state.user))
          }
        }
      },
    }
  )
)