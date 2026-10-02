/**
 * ─────────────────────────────────────────────────────────────
 *  THEME — colors for both modes and the pixel-art background.
 * ─────────────────────────────────────────────────────────────
 *  `defaultMode: 'system'` follows the visitor's OS setting until
 *  they press the sun/moon toggle (their choice is remembered).
 */

export type Mode = 'dark' | 'light'

export interface Palette {
  text: string
  muted: string
  faint: string
  /** Links, org names, tag text */
  accent: string
  /** Venue labels, award icons */
  gold: string
  /** Contribution heatmap (empty → strongest) */
  heat: string[]
  /** Skill-group heading colors, cycled */
  skillColors: string[]
  /** Pixel scene */
  scene: {
    sky: string[]
    /** 0–1: how much of each sky band is dithered (1 = full gradient, small = thin seams) */
    dither: number
    /** Moon at night, sun by day */
    orb: { body: string; shade: string; halo: string; crescent: boolean }
    stars: boolean
    clouds: { light: string; shade: string; count: number }
    /** Far → near layers; each layer picks per-building colors from its list */
    buildings: string[][]
    /** Ground band at the bottom */
    ground: string
    /** Lit rooftop edge (moonlight / sunlight). '' for none */
    rim: string
    windows: string[]
    windowAlpha: number
    /** Multiplier on how many windows are drawn */
    litDensity: number
    ledge: string
    /** How much the scene is washed toward the page color (0–1) */
    dim: number
    dimColor: string
  }
}

export const theme = {
  defaultMode: 'system' as Mode | 'system',

  /** Screen pixels per art pixel. Bigger = chunkier. */
  pixelSize: 5,
  /** Seed for the city layout — change for a different skyline */
  seed: 7,

  dark: {
    text: '#eceaf6',
    muted: '#c3bedf',
    faint: '#aaa4ca',
    accent: '#c4a7ff',
    gold: '#ffc46b',
    heat: ['#1b1f2e', '#0e4429', '#006d32', '#26a641', '#39d353'],
    skillColors: ['#c4a7ff', '#7cc4ff', '#5ee6a0', '#ffc46b'],
    scene: {
      sky: ['#0b0a1f', '#1a1440', '#3a2466', '#6b3a7a'],
      dither: 1,
      orb: { body: '#f4ebc8', shade: '#d9cc9a', halo: '#4a3a80', crescent: true },
      stars: true,
      clouds: { light: '#6b3a7a', shade: '#4a2a6a', count: 4 },
      buildings: [['#2e2560'], ['#1b1545'], ['#0b0820']],
      ground: '#05040f',
      rim: '#5a4a9c',
      windows: ['#ffcf6b', '#ffcf6b', '#ffd98a', '#ffb347', '#9fd3ff'],
      windowAlpha: 0.9,
      litDensity: 0.65,
      ledge: '#05040f',
      dim: 0.3,
      dimColor: '#05040d',
    },
  } satisfies Palette,

  light: {
    text: '#17132e',
    muted: '#3f3962',
    faint: '#5e587f',
    accent: '#4a3ad0',
    gold: '#9a4f00',
    heat: ['#d3d9e6', '#a9dcb6', '#6cc387', '#3a9f5c', '#1f7542'],
    skillColors: ['#5b3fd6', '#0b6bcb', '#1f8a4c', '#a65300'],
    scene: {
      sky: ['#7cbcf5', '#8cc5f7', '#a2d0f9', '#c3e1fb'],
      dither: 0.2,
      orb: { body: '#fff3b0', shade: '#ffc94a', halo: '#b4dbff', crescent: false },
      stars: false,
      clouds: { light: '#ffffff', shade: '#dcebff', count: 5 },
      buildings: [
        ['#b7c8e4', '#c3d0e6', '#aebfdc'], // hazy distance
        ['#d9bba3', '#d3c8b0', '#a9c0cc', '#cdaeae', '#b2c2a8'], // soft mid-rise facades
        ['#7d6672', '#56698a', '#836b55', '#4b6f6a', '#625a7e'], // muted foreground
      ],
      ground: '#d6d0c4',
      rim: '#f4f8ff',
      /* Daytime windows: dark glass with the odd reflection */
      windows: ['#2e3d5c', '#2e3d5c', '#3a4c6f', '#e6f4ff'],
      windowAlpha: 0.8,
      litDensity: 1,
      ledge: '#bdb5a8',
      dim: 0,
      dimColor: '#ffffff',
    },
  } satisfies Palette,
}
