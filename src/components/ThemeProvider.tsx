import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { theme, type Mode } from '../config/theme'

const STORAGE_KEY = 'portfolio-theme'

interface ThemeCtx {
  mode: Mode
  toggle: () => void
}

const Ctx = createContext<ThemeCtx>({ mode: 'dark', toggle: () => {} })

function initialMode(): Mode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'dark' || saved === 'light') return saved
  } catch {
    /* storage unavailable */
  }
  if (theme.defaultMode !== 'system') return theme.defaultMode
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(initialMode)

  useEffect(() => {
    const p = theme[mode]
    const root = document.documentElement
    root.dataset.theme = mode
    root.style.colorScheme = mode
    for (const [k, v] of Object.entries({ text: p.text, muted: p.muted, faint: p.faint, accent: p.accent, gold: p.gold })) {
      root.style.setProperty(`--${k}`, v)
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', p.scene.sky[0])
  }, [mode])

  const toggle = useCallback(() => {
    setMode((m) => {
      const next = m === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* storage unavailable */
      }
      return next
    })
  }, [])

  return <Ctx.Provider value={{ mode, toggle }}>{children}</Ctx.Provider>
}

export const useTheme = () => useContext(Ctx)
