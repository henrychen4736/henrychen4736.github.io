import { ExternalLink, FileText, MapPin } from 'lucide-react'
import {
  BookOpen,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Code,
  Cpu,
  Database,
  Folder,
  GitBranch,
  Globe,
  Lightbulb,
  Mail,
  Moon,
  Sparkles,
  Sun,
  Teach,
  Trophy,
  User,
} from 'pixelarticons/react'
import { Fragment, useState } from 'react'
import { site } from '../config/site'
import { theme } from '../config/theme'
import { Card, Tag } from '../components/Card'
import { ContributionGraph } from '../components/ContributionGraph'
import { Glass } from '../components/Glass'
import { SocialIcon } from '../components/Icon'
import { useTheme } from '../components/ThemeProvider'

function ThemeToggle() {
  const { mode, toggle } = useTheme()
  const next = mode === 'dark' ? 'light' : 'dark'
  return (
    <Glass onClick={toggle} label={`Switch to ${next} mode`} contentClassName="icon-btn theme-toggle">
      <span className="theme-toggle__icons" data-mode={mode}>
        <Sun width={24} height={24} />
        <Moon width={24} height={24} />
      </span>
    </Glass>
  )
}

export function Header() {
  const { name, title, location, status, resumeHref } = site.person
  return (
    <header className="intro">
      <div>
        <h1 className="intro__name" data-text={name}>
          {name}
        </h1>
        <p className="intro__title">{title}</p>
        <p className="intro__loc">
          <MapPin size={13} /> {location}
        </p>
        <div className="intro__actions">
          <Glass href={resumeHref} newTab contentClassName="btn btn--primary">
            <FileText size={15} /> Résumé
          </Glass>
          {status && (
            <Glass preset="chip" contentClassName="status">
              <span className="status__dot" />
              {status}
            </Glass>
          )}
        </div>
      </div>
      <ThemeToggle />
    </header>
  )
}

export function About() {
  return (
    <Card className="card--about" title="About Me" icon={User}>
      <ul className="lines">
        {site.about.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </Card>
  )
}

export function Contact() {
  const { blurb, links } = site.contact
  return (
    <Card className="card--contact" title="Contact" icon={Mail}>
      <p className="muted">{blurb}</p>
      <ul className="links">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              <span className="links__icon">
                <SocialIcon kind={l.kind} size={15} />
              </span>
              <span className="links__label">{l.label}</span>
              <ExternalLink size={12} className="links__arrow" />
            </a>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export function Education() {
  if (!site.education.length) return null
  return (
    <Card className="card--education" title="Education" icon={Teach}>
      {site.education.map((e) => (
        <div key={e.degree} className="entry">
          <h3>{e.degree}</h3>
          <p className="accent">{e.school}</p>
          {e.detail && <p className="muted small">{e.detail}</p>}
          <p className="muted small">
            {e.location} · {e.dates}
          </p>
        </div>
      ))}
    </Card>
  )
}

export function Activity() {
  return (
    <Card title="GitHub Activity" icon={GitBranch} className="card--activity">
      <ContributionGraph total={site.activity.total} />
    </Card>
  )
}

export function Projects() {
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const n = site.projects.length
  const go = (d: number) => {
    setDir(d)
    setI((cur) => (cur + d + n) % n)
  }
  if (!n) return null
  const p = site.projects[i]
  const nav = (
    <>
      <Glass preset="chip" label="Previous project" onClick={() => go(-1)} contentClassName="icon-btn icon-btn--sm">
        <ChevronLeft width={24} height={24} />
      </Glass>
      <Glass preset="chip" label="Next project" onClick={() => go(1)} contentClassName="icon-btn icon-btn--sm">
        <ChevronRight width={24} height={24} />
      </Glass>
    </>
  )
  return (
    <Card className="card--projects" title="Projects" icon={Folder} actions={n > 1 ? nav : undefined}>
      <div key={i} className={`entry project ${dir > 0 ? 'project--next' : 'project--prev'}`}>
        <div className="entry__row entry__row--keep">
          <h3 className="big">{p.name}</h3>
          <span className="muted small">
            {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
          </span>
        </div>
        <p className="muted">{p.description}</p>
        <div className="tags">
          {p.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
        <div className="row">
          {p.links.map((l) => (
            <Glass key={l.label} preset="chip" href={l.href} newTab contentClassName="pill">
              {l.label === 'GitHub' ? <SocialIcon kind="github" size={14} /> : <ExternalLink size={14} />}
              {l.label}
            </Glass>
          ))}
        </div>
      </div>
    </Card>
  )
}

export function Experience() {
  if (!site.experience.length) return null
  return (
    <Card className="card--experience" title="Experience" icon={Briefcase}>
      {site.experience.map((e) => (
        <div key={e.role + e.org} className="entry">
          <div className="entry__row">
            <h3>{e.role}</h3>
            <span className="muted small nowrap">{e.dates}</span>
          </div>
          <p className="accent">
            {e.org} | {e.location}
          </p>
          <p className="muted">{e.description}</p>
        </div>
      ))}
    </Card>
  )
}

function highlightName(authors: string) {
  const me = site.person.name
  return authors.split(me).map((part, i, arr) => (
    <Fragment key={i}>
      {part}
      {i < arr.length - 1 && <strong>{me}</strong>}
    </Fragment>
  ))
}

export function Publications() {
  if (!site.publications.length) return null
  return (
    <Card className="card--publications" title="Publications" icon={BookOpen}>
      {site.publications.map((p) => (
        <div key={p.title} className="entry">
          <h3>{p.title}</h3>
          <p className="muted small">{highlightName(p.authors)}</p>
          <div className="entry__row">
            <span className="venue">{p.venue}</span>
            <span className="row">
              {p.links.map((l) => (
                <a key={l.label} className="link edge-glow" href={l.href}>
                  {l.label}
                </a>
              ))}
            </span>
          </div>
        </div>
      ))}
    </Card>
  )
}

const skillIcons = { code: Code, brain: Lightbulb, cpu: Cpu, globe: Globe, database: Database, cloud: Cloud }

export function Skills() {
  const { skillColors } = theme[useTheme().mode]
  if (!site.skills.length) return null
  return (
    <Card className="card--skills" title="Skills" icon={Sparkles}>
      <div className="skills">
        {site.skills.map((g, idx) => {
          const Icon = skillIcons[g.icon]
          return (
            <div key={g.group}>
              <h3 className="skills__head" style={{ color: skillColors[idx % skillColors.length] }}>
                <Icon width={24} height={24} /> <span>{g.group}</span>
              </h3>
              <div className="tags">
                {g.items.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export function Awards() {
  if (!site.awards.length) return null
  return (
    <Card className="card--awards" title="Awards" icon={Trophy}>
      {site.awards.map((a) => (
        <div key={a.title} className="award">
          <Trophy width={24} height={24} className="award__icon" />
          <div>
            <h3>{a.title}</h3>
            <p className="muted small">{a.org}</p>
          </div>
        </div>
      ))}
    </Card>
  )
}
