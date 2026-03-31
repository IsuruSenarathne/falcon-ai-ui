import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
}

const THEME_CONFIG = {
  dark: {
    bg: '#0f0f11',
    surface: '#18181b',
    surface_alt: '#1e1e23',
    border: '#27272a',
    border_strong: '#2e2e35',
    text_primary: '#e5e7eb',
    text_secondary: '#e4e4e7',
    text_muted: '#52525b',
    text_lighter: '#71717a',
    accent: '#6366f1',
    accent_light: '#a5b4fc',
    shadow: 'rgba(0, 0, 0, 0.6)',
  },
  light: {
    bg: '#ffffff',
    surface: '#f5f5f5',
    surface_alt: '#eeeeee',
    border: '#e5e5e5',
    border_strong: '#d4d4d8',
    text_primary: '#1f2937',
    text_secondary: '#374151',
    text_muted: '#9ca3af',
    text_lighter: '#a3a3a3',
    accent: '#6366f1',
    accent_light: '#a5b4fc',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved || THEMES.DARK
  })

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK))
  }

  const colors = THEME_CONFIG[theme]

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
