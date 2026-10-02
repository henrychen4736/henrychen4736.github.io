import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { site } from '../config/site'
import { Glass } from './Glass'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const { firstName, lastName } = site.person

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${open ? 'nav--open' : ''}`}>
      <Glass as="nav" className="nav__bar" radius={999} bezel={14} refraction={-48}>
        <a href="#top" className="nav__brand" onClick={() => setOpen(false)}>
          <span className="nav__mark">{site.person.monogram}</span>
          <span className="nav__name">
            {firstName} {lastName}
          </span>
        </a>
        <ul className="nav__links">
          {site.nav.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
        <div className="nav__end">
          <a className="nav__cta" href={site.hero.resumeHref}>
            Résumé
          </a>
          <button
            className="nav__toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </Glass>

      <Glass className="nav__sheet" radius={28} bezel={20} aria-hidden={!open}>
        <ul>
          {site.nav.map((l) => (
            <li key={l.href}>
              <a href={l.href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </Glass>
    </header>
  )
}
