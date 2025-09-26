import { useEffect } from 'react'


  const [theme, setTheme] = useKV<Th

  // Initialize on mount
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }

  const toggleTheme = () => {
    setTheme((currentTheme) => currentTheme === 'light' ? 'dark' : 'light')
  }

  return { theme, setTheme, toggleTheme }
}