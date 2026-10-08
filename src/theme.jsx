import { createContext, useCallback, useContext, useState } from 'react'

const ThemeContext = createContext({ theme: 'dark', toggle: () => {} })
const KEY = 'ss-theme-v2'

export function ThemeProvider({ children }) {
  // index.html sets data-theme before first paint; start from that to avoid a flash.
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark')

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      const root = document.documentElement
      root.classList.add('theme-anim')
      root.dataset.theme = next
      window.setTimeout(() => root.classList.remove('theme-anim'), 500)
      try {
        localStorage.setItem(KEY, next)
      } catch {
        // Storage can be unavailable (private mode); the toggle still works for this visit.
      }
      return next
    })
  }, [])

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext)

// Reads "r, g, b" triplets from CSS custom properties so canvases follow the theme.
// eslint-disable-next-line react-refresh/only-export-components
export function readRgb(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}
