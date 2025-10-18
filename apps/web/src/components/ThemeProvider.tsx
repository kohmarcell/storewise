import React, { useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { initializeTheme, theme } = useThemeStore()

  useEffect(() => {
    initializeTheme()
  }, [])

  useEffect(() => {
    initializeTheme()
  }, [theme, initializeTheme])

  useEffect(() => {
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const { theme } = useThemeStore.getState()
      if (theme === 'system') {
        const newTheme = e.matches ? 'dark' : 'light'
        useThemeStore.setState({ resolvedTheme: newTheme })

        const root = document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(newTheme)

        const metaTheme = document.querySelector('meta[name="theme-color"]')
        if (metaTheme) {
          metaTheme.setAttribute('content', newTheme === 'dark' ? '#1f2937' : '#ffffff')
        }
      }
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', handleSystemThemeChange)

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [])

  useEffect(() => {
    const { theme, resolvedTheme } = useThemeStore.getState()

    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(resolvedTheme)

    const metaTheme = document.querySelector('meta[name="theme-color"]')
    if (metaTheme) {
      metaTheme.setAttribute('content', resolvedTheme === 'dark' ? '#1f2937' : '#ffffff')
    }

    // Update meta description if needed
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription && !metaDescription.hasAttribute('data-default')) {
      metaDescription.setAttribute('data-default', metaDescription.content)
      metaDescription.content = resolvedTheme === 'dark'
        ? 'StoreWise - Advanced POS and Inventory Management System (Dark Mode)'
        : 'StoreWise - Advanced POS and Inventory Management System'
    }
  }, [])

  return <>{children}</>
}