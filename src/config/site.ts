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
    description:
      'Henry Chen is a Berkeley statistics student who builds reinforcement learning agents and computer vision systems.',
  },

  person: {
    name: 'Henry Chen',
    title: 'Statistics @ UC Berkeley · ML & RL',
    location: 'Berkeley, CA',
    /** Optional status line next to your name. '' to hide. */
    status: 'Open to Summer 2027 internships',
    resumeHref: '/henry-chen-resume.pdf',
  },

  /** Short lines, like a terminal bio. 4–7 work best. */
  about: [
    'statistics BA @ uc berkeley',
    'beat the best human lap on 4 polytrack tracks with ms-level search',
    'built tennis iq, an AI tennis coach (1st, congressional app challenge)',
    "its stroke classifier hits 99% on stroke family for players it's never seen",
    'two summers building a lunar base sim with caltech / lunax',
    'run kode4kids: free coding classes for 100+ kids',
  ],

  contact: {
    blurb: "I'm always open to research collaborations and internship opportunities. Say hi!",
    links: [
      { kind: 'email', label: 'henrychen4736@berkeley.edu', href: 'mailto:henrychen4736@berkeley.edu' },
      { kind: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/henry-chen-061230354/' },
      { kind: 'github', label: 'GitHub', href: 'https://github.com/henrychen4736' },
    ] as { kind: SocialKind; label: string; href: string }[],
  },

  education: [
    {
      degree: 'B.A. Statistics',
      school: 'University of California, Berkeley',
      detail: 'Coursework: CS 61A, CS 70 · In progress: CS 61B, DATA C8, Math 54',
      location: 'Berkeley, CA',
      dates: 'Aug 2026 – May 2030 (expected)',
    },
  ],

  /**
   * Contribution heatmap. It draws placeholder data, so it stays hidden
   * (`show: false`) until real contributions are fetched for `username`.
   */
  activity: {
    show: false,
    username: 'henrychen4736',
    total: 512,
  },

  projects: [
    {
      name: 'Polytrack-ML',
      description:
        'Headless PolyTrack simulator that exactly reproduces all 27 official leaderboard replays, used for RL and search. Millisecond-level search beat the best human lap on 4 tracks by 27–55 ms, and an IQN agent trained from scratch got within 1% of the human best in 3 hours.',
      tags: ['PyTorch', 'IQN', 'PPO', 'Behavior Cloning', 'Node.js', 'CUDA'],
      links: [{ label: 'GitHub', href: 'https://github.com/henrychen4736/Polytrack-ML' }],
    },
    {
      name: 'Tennis IQ',
      description:
        'AI tennis coach that detects every stroke in a phone video, tracks the player in 3D and scores the swing on biomechanics such as contact point and hip–shoulder separation. Its pose-sequence CNN classifies 9 stroke types with 80% accuracy and stroke family with 99% accuracy on held-out players. Won 1st place in the Congressional App Challenge (NV-03).',
      tags: ['PyTorch', 'MediaPipe', 'ONNX', 'FastAPI', 'Flutter', 'Firebase'],
      links: [{ label: 'GitHub', href: 'https://github.com/henrychen4736/CAC24' }],
    },
  ] as { name: string; description: string; tags: string[]; links: { label: string; href: string }[] }[],

  experience: [
    {
      role: 'Software Development Intern',
      org: 'Caltech / LunaX',
      location: 'Pasadena, CA',
      dates: 'Summers 2024 & 2025',
      description:
        'Built the tiling, networking and terrain-based pathfinding systems for a Unity lunar base simulation, working under Dr. Jonathan Jiang of NASA JPL.',
    },
    {
      role: 'Web Development Intern',
      org: 'WPrime Sports',
      location: 'Virtual',
      dates: 'Nov 2025 – Feb 2026',
      description: 'Built web features in React.',
    },
    {
      role: 'President (formerly Treasurer & Scratch Director)',
      org: 'Kode4Kids',
      location: 'Diamond Bar, CA',
      dates: 'Dec 2023 – 2026',
      description:
        'Led a volunteer nonprofit through incorporation, wrote its curriculum and mentored about 15 instructors teaching free coding classes to 100+ students.',
    },
  ],

  /** Your name is auto-highlighted in the author list. */
  publications: [] as { title: string; authors: string; venue: string; links: { label: string; href: string }[] }[],

  skills: [
    { group: 'Languages', icon: 'code', items: ['Python', 'C++', 'Java', 'JavaScript', 'SQL', 'Dart', 'C#'] },
    {
      group: 'ML / AI',
      icon: 'brain',
      items: ['PyTorch', 'scikit-learn', 'pandas', 'OpenCV', 'MediaPipe', 'ONNX', 'PPO', 'IQN', 'behavior cloning'],
    },
    {
      group: 'Systems & Tools',
      icon: 'cpu',
      items: ['FastAPI', 'Flask', 'Node.js', 'Docker', 'Firebase', 'Google Cloud', 'Linux', 'Git', 'Unity'],
    },
    { group: 'Web & Mobile', icon: 'globe', items: ['React', 'Tailwind CSS', 'Flutter'] },
  ] as { group: string; icon: 'code' | 'brain' | 'cpu' | 'globe' | 'database' | 'cloud'; items: string[] }[],

  awards: [
    {
      title: '1st Place, Congressional App Challenge (NV-03)',
      org: 'U.S. House of Representatives, 2024 · presented at #HouseOfCode, U.S. Capitol',
    },
    {
      title: '5th Place in California, Website Development',
      org: 'FBLA State Leadership Conference (SLC), 2025',
    },
  ],
}

export type Site = typeof site
