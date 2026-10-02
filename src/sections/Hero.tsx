import { ArrowDown, ArrowUpRight, MapPin, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Fragment } from 'react'
import { site } from '../config/site'
import { Glass } from '../components/Glass'
import { LiquidEmblem } from '../components/LiquidEmblem'
import { SocialIcon } from '../components/Icon'

/** Turns "*phrase*" into an accented italic span. */
function emphasize(text: string) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith('*') && part.endsWith('*') ? (
      <em key={i}>{part.slice(1, -1)}</em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

const rise = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { delay: 0.15 + i * 0.09, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function Hero() {
  const { person, hero, socials } = site

  return (
    <section id="top" className="hero">
      <div className="hero__grid">
        <div className="hero__copy">
          {hero.status.show && (
            <motion.div variants={rise} initial="hidden" animate="show" custom={0}>
              <Glass className="status" radius={999} bezel={10} refraction={-30}>
                <span className="status__dot" />
                <span className="status__text">{hero.status.text}</span>
              </Glass>
            </motion.div>
          )}

          <motion.p className="eyebrow" variants={rise} initial="hidden" animate="show" custom={1}>
            {hero.eyebrow}
          </motion.p>

          <motion.h1 className="hero__name" variants={rise} initial="hidden" animate="show" custom={2}>
            <span>{person.firstName}</span>{' '}
            <span className="hero__name-last">{person.lastName}</span>
          </motion.h1>

          <motion.p className="hero__headline" variants={rise} initial="hidden" animate="show" custom={3}>
            {emphasize(hero.headline)}
          </motion.p>

          <motion.p className="hero__meta" variants={rise} initial="hidden" animate="show" custom={4}>
            <span>{person.role}</span>
            <span className="dot" />
            <span>{person.institution}</span>
            <span className="dot" />
            <span className="hero__loc">
              <MapPin size={14} strokeWidth={1.75} /> {person.location}
            </span>
          </motion.p>

          <motion.div className="hero__actions" variants={rise} initial="hidden" animate="show" custom={5}>
            <a className="btn btn--solid" href={hero.primaryCta.href}>
              {hero.primaryCta.label}
              <ArrowUpRight size={18} strokeWidth={2} />
            </a>
            <Glass as="a" href={hero.secondaryCta.href} className="btn btn--glass" radius={999} bezel={14}>
              <MessageCircle size={17} strokeWidth={2} />
              {hero.secondaryCta.label}
            </Glass>
            <div className="socials">
              {socials.map((s) => (
                <Glass
                  key={s.kind}
                  as="a"
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="socials__item"
                  radius={999}
                  bezel={12}
                  refraction={-40}
                >
                  <SocialIcon kind={s.kind} />
                </Glass>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="hero__visual"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <LiquidEmblem />
        </motion.div>
      </div>

      <motion.div
        className="hero__footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <dl className="highlights">
          {hero.highlights.map((h) => (
            <div key={h.label} className="highlights__item">
              <dt>{h.value}</dt>
              <dd>{h.label}</dd>
            </div>
          ))}
        </dl>
        <a className="scroll-cue" href={site.nav[0]?.href ?? '#'}>
          <span>Scroll</span>
          <ArrowDown size={14} />
        </a>
      </motion.div>
    </section>
  )
}
