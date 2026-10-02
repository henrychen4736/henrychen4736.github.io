import { useEffect } from 'react'
import { site } from './config/site'
import { theme } from './config/theme'
import { PixelScene } from './components/PixelScene'
import {
  About,
  Activity,
  Awards,
  Contact,
  Education,
  Experience,
  Header,
  Projects,
  Publications,
  Skills,
} from './sections/Cards'

export default function App() {
  useEffect(() => {
    document.title = site.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', site.meta.description)
    const root = document.documentElement.style
    root.setProperty('--text', theme.colors.text)
    root.setProperty('--muted', theme.colors.muted)
    root.setProperty('--accent', theme.colors.accent)
  }, [])

  // Card placement: rearrange freely — each column is just a list.
  return (
    <>
      <PixelScene />
      <main className="layout">
        <div className="col col--side">
          <About />
          <Contact />
          <Education />
          <Awards />
        </div>
        <div className="col col--main">
          <Header />
          <Activity />
          <div className="split">
            <div className="col">
              <Projects />
              <Experience />
            </div>
            <div className="col">
              <Publications />
              <Skills />
            </div>
          </div>
        </div>
      </main>
      <footer className="foot">
        © {new Date().getFullYear()} {site.person.name}
      </footer>
    </>
  )
}
