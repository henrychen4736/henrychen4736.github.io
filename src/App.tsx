import { useEffect } from 'react'
import { site } from './config/site'
import { theme } from './config/theme'
import { Background } from './components/Background'
import { Nav } from './components/Nav'
import { Hero } from './sections/Hero'

export default function App() {
  useEffect(() => {
    document.title = site.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', site.meta.description)
    const root = document.documentElement.style
    root.setProperty('--bg', theme.colors.bg)
    root.setProperty('--text', theme.colors.text)
    root.setProperty('--muted', theme.colors.muted)
    root.setProperty('--accent', theme.colors.accent)
  }, [])

  return (
    <>
      <Background />
      <Nav />
      <main>
        <Hero />
      </main>
    </>
  )
}
