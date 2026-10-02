import { useEffect } from 'react'
import { site } from './config/site'
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
        <span>
          © {new Date().getFullYear()} {site.person.name}
        </span>
        <span className="foot__dot" />
        <span>Built with React &amp; liquid glass</span>
      </footer>
    </>
  )
}
