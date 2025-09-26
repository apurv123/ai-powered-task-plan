import { useEffect } from 'react'


  const [theme, setTheme] = useKV<Th

    
    root.classList.remove('light', 'dark')

      root.classLis
      root.classList.a
  },
  // Initialize on mount
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => currentTheme === 'light' ? 'dark' : 'light')
  }

  return { theme, setTheme, toggleTheme }
}  return { theme: theme || 'light', setTheme, toggleTheme }
}