import { useEffect } from 'react'


  const [theme, setTheme] = u

    const root = document.do
  const [theme, setTheme] = useKV<Theme>('theme', 'light')

  // Initialize on mount and when theme changes
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')

  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => currentTheme === 'light' ? 'dark' : 'light')
  }

  return { theme, setTheme, toggleTheme }
