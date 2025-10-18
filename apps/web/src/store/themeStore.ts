import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface ThemeStore {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  resolvedTheme: 'light' | 'dark'
  initializeTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      setTheme: (theme: Theme) => set({ theme }),
      toggleTheme: () => {
        const current = get().theme
        const newTheme = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light'
        set({ theme: newTheme })
      },
      resolvedTheme: 'light',
      initializeTheme: () => {
        const { theme } = get()
        let resolved: 'light' | 'dark' = 'light'

        if (theme === 'system') {
          if (typeof window !== 'undefined') {
            resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          }
        } else {
          resolved = theme
        }

        set({ resolvedTheme: resolved })

        // Apply theme to document
        if (typeof window !== 'undefined') {
          const root = window.document.documentElement
          root.classList.remove('light', 'dark')
          root.classList.add(resolved)

          // Set meta theme-color for mobile browsers
          const metaTheme = document.querySelector('meta[name="theme-color"]')
          if (metaTheme) {
            metaTheme.setAttribute('content', resolved === 'dark' ? '#1f2937' : '#ffffff')
          }
        }
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)