/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONTENT — edit this file to make the portfolio yours.
 * ─────────────────────────────────────────────────────────────
 *  Everything the visitor reads lives here. Components never
 *  hard-code personal info, so you should not need to touch
 *  anything under /src/components or /src/sections.
 *
 *  Visual settings (colors, gradient, fonts) live in ./theme.ts
 */

export type SocialKind =
  | 'github'
  | 'linkedin'
  | 'scholar'
  | 'email'
  | 'x'
  | 'orcid'
  | 'website'

export interface SocialLink {
  kind: SocialKind
  label: string
  href: string
}

export interface NavLink {
  label: string
  /** Anchor (e.g. '#projects') or full URL */
  href: string
}

export const site = {
  /** Shown in the browser tab and used for SEO */
  meta: {
    title: 'Alex Rivera — Portfolio',
    description:
      'Computer Science student researching machine learning systems. Projects, publications, and CV.',
  },

  person: {
    firstName: 'Alex',
    lastName: 'Rivera',
    /** Letters rendered in liquid metal. Keep to 1–2 characters. */
    monogram: 'AR',
    /**
     * Optional: path to your own logo (transparent PNG/SVG in /public).
     * If set, it replaces the monogram letters in the liquid-metal emblem.
     */
    logoImage: '' as string,
    /**
     * Optional: path to a headshot in /public (e.g. '/me.jpg').
     * If set, the hero shows your photo framed by a liquid-metal ring
     * instead of the monogram emblem.
     */
    photo: '' as string,
    pronouns: 'they/them',
    role: 'Computer Science Student',
    institution: 'University of Somewhere',
    location: 'City, Country',
  },

  hero: {
    /** Small label above your name */
    eyebrow: 'B.S. Computer Science · Class of 2027',
    /** One or two sentences. Wrap a phrase in *asterisks* to italicize it in the accent color. */
    headline:
      'I build *learning systems* that are fast, reliable, and a little bit delightful.',
    /** Status pill — set `show: false` to hide. Keep it under ~45 characters. */
    status: {
      show: true,
      text: 'Open to Summer 2027 internships',
    },
    primaryCta: { label: 'View my work', href: '#projects' },
    secondaryCta: { label: 'Get in touch', href: '#contact' },
    /** Linked from the "Résumé" button in the nav. Drop your PDF in /public. */
    resumeHref: '/cv.pdf',
    /** Quick facts under the CTAs. 2–4 items work best. */
    highlights: [
      { value: '3', label: 'Publications' },
      { value: '12+', label: 'Projects shipped' },
      { value: '2', label: 'Research labs' },
    ],
  },

  nav: [
    { label: 'About', href: '#about' },
    { label: 'Research', href: '#research' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ] satisfies NavLink[],

  socials: [
    { kind: 'github', label: 'GitHub', href: 'https://github.com/your-handle' },
    { kind: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/your-handle' },
    { kind: 'scholar', label: 'Google Scholar', href: 'https://scholar.google.com/' },
    { kind: 'email', label: 'Email', href: 'mailto:you@university.edu' },
  ] satisfies SocialLink[],
}

export type Site = typeof site
