import { useEffect } from 'react'
import { useKV } from '@github/spark/hooks'

export type Theme = 'dark' | 'light'

export function useTheme() {
  const [theme, setTheme] = useKV<Theme>('theme-preference', 'light')

  useEffect(() => {
    if (!theme) return
    
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    
    // Add the theme class to html element for CSS variables
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.add('light')
    }
  }, [theme])

  // Initialize on mount
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.add(theme || 'light')
  }, [])

  const toggleTheme = () => {
    setTheme((currentTheme) => currentTheme === 'light' ? 'dark' : 'light')
  }

  return { theme: theme || 'light', setTheme, toggleTheme }
}