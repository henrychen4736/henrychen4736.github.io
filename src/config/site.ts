/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONTENT — edit this file to make the portfolio yours.
 * ─────────────────────────────────────────────────────────────
 *  Every card on the page reads from here. To hide a card, empty
 *  its array (e.g. `publications: []`) and it disappears.
 *  Colors live in ./theme.ts.
 */

export type SocialKind = 'github' | 'linkedin' | 'scholar' | 'email' | 'x' | 'orcid' | 'website'

export const site = {
  meta: {
    title: 'Henry Chen — Portfolio',
    description: 'CS student working on machine learning systems. Projects, research, and experience.',
  },

  person: {
    name: 'Henry Chen',
    title: 'CS Student / ML Researcher',
    location: 'City, Country',
    /** Optional status line next to your name. '' to hide. */
    status: 'Open to 2027 internships',
    resumeHref: '/cv.pdf',
  },

  /** Short lines, like a terminal bio. 4–7 work best. */
  about: [
    'statistics BA @ uc berkeley',
    'researching efficient ml systems',
    'prev - swe intern @ company',
    'ta for intro to algorithms',
    'loves compilers, climbing & coffee',
    'always building something',
  ],

  contact: {
    blurb: "I'm always open to research collaborations and internship opportunities. Say hi!",
    links: [
      { kind: 'email', label: 'henrychen4736@berkeley.edu', href: 'mailto:henrychen4736@berkeley.edu' },
      { kind: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/henry-chen-061230354/' },
      { kind: 'github', label: 'GitHub', href: 'https://github.com/henrychen4736' },
      { kind: 'scholar', label: 'Google Scholar', href: 'https://scholar.google.com/' },
    ] as { kind: SocialKind; label: string; href: string }[],
  },

  education: [
    {
      degree: 'B.S. in Computer Science',
      school: 'University of Somewhere',
      detail: 'Minor in Mathematics · GPA 3.9',
      location: 'City, ST',
      dates: 'Aug 2023 - May 2027',
    },
  ],

  /**
   * Contribution heatmap. This mockup draws placeholder data; set `username`
   * and later we can fetch real contributions.
   */
  activity: {
    username: 'your-handle',
    total: 512,
  },

  projects: [
    {
      name: 'TinyServe',
      description:
        'A lightweight inference server that batches requests across GPUs, cutting p99 latency by 38% on 7B-parameter models.',
      tags: ['Python', 'CUDA', 'FastAPI', 'Triton'],
      links: [
        { label: 'GitHub', href: 'https://github.com/your-handle/tinyserve' },
        { label: 'Demo', href: '#' },
      ],
    },
    {
      name: 'CampusMaps',
      description:
        'Indoor navigation app for campus buildings used by 4,000+ students. Built the routing engine and accessibility layer.',
      tags: ['TypeScript', 'React Native', 'PostGIS'],
      links: [{ label: 'GitHub', href: 'https://github.com/your-handle/campusmaps' }],
    },
    {
      name: 'Sparse Attention Lab',
      description:
        'Research codebase for benchmarking sparse attention kernels; reproduced 6 papers with a unified evaluation harness.',
      tags: ['PyTorch', 'JAX', 'Weights & Biases'],
      links: [{ label: 'GitHub', href: 'https://github.com/your-handle/sparse-attn' }],
    },
  ],

  experience: [
    {
      role: 'Software Engineering Intern',
      org: 'Company Name',
      location: 'City, ST',
      dates: 'Jun 2025 - Aug 2025',
      description:
        'Shipped a feature-store caching layer that reduced model training data loads by 3x. Wrote design docs and owned rollout to 12 teams.',
    },
    {
      role: 'Undergraduate Researcher',
      org: 'Systems & ML Lab, University of Somewhere',
      location: 'City, ST',
      dates: 'Jan 2024 - Present',
      description:
        'Advised by Prof. Firstname Lastname. Studying memory-efficient training for long-context transformers.',
    },
  ],

  /** Your name is auto-highlighted in the author list. */
  publications: [
    {
      title: 'Efficient Long-Context Training via Adaptive Sparse Attention',
      authors: 'J. Doe, Alex Rivera, F. Lastname',
      venue: 'NeurIPS 2025 Workshop',
      links: [
        { label: 'PDF', href: '#' },
        { label: 'Code', href: '#' },
      ],
    },
    {
      title: 'A Benchmark for Reproducible Attention Kernels',
      authors: 'Alex Rivera, J. Doe',
      venue: 'arXiv preprint, 2025',
      links: [{ label: 'arXiv', href: '#' }],
    },
  ],

  skills: [
    { group: 'Languages', icon: 'code', items: ['Python', 'C++', 'TypeScript', 'Java', 'SQL', 'Rust'] },
    { group: 'ML / AI', icon: 'brain', items: ['PyTorch', 'JAX', 'scikit-learn', 'HF Transformers'] },
    { group: 'Systems', icon: 'cpu', items: ['CUDA', 'Linux', 'Docker', 'Kubernetes'] },
    { group: 'Web', icon: 'globe', items: ['React', 'Next.js', 'FastAPI', 'PostgreSQL'] },
  ] as { group: string; icon: 'code' | 'brain' | 'cpu' | 'globe' | 'database' | 'cloud'; items: string[] }[],

  awards: [
    { title: "Dean's List (6 semesters)", org: 'University of Somewhere' },
    { title: '1st Place, HackState 2024', org: 'Out of 180 teams' },
    { title: 'Undergraduate Research Fellowship', org: 'College of Engineering' },
  ],
}

export type Site = typeof site
