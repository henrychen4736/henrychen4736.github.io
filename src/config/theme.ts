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
    /** Background ranges, far → near */
    mountains: { body: string; light: string; snow: string }[]
    /** Distant treeline: [body, lit top] */
    forest: string[]
    /** Terrain tiles, each [light, base, dark] */
    grass: string[]
    dirt: string[]
    stone: string[]
    ores: string[][]
    /** Cave back wall: [base, speckle] */
    cave: string[]
    trunk: string[]
    /** [light, mid, dark, outline] */
    leaves: string[]
    flowers: string[]
    /** Cabin */
    wood: string[]
    roof: string[]
    window: string
    /** [flame tip, flame base] */
    torch: string[]
    /** Light cast by torches and windows; strength 0–1 */
    glow: { color: string; strength: number }
    /** How much the scene is washed toward the page color (0–1) */
    dim: number
    dimColor: string
  }
}

export const theme = {
  defaultMode: 'system' as Mode | 'system',

  /** Screen pixels per art pixel. Bigger = chunkier. */
  pixelSize: 5,
  /** Seed for the world — change for different terrain */
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
      mountains: [
        { body: '#2a2358', light: '#352c6a', snow: '#5c54a0' },
        { body: '#201a48', light: '#2a2258', snow: '#4a4288' },
      ],
      forest: ['#15203a', '#1d2c48'],
      grass: ['#3f8f4a', '#2a6a3c', '#1c4a30'],
      dirt: ['#5e4338', '#4a3229', '#33221d'],
      stone: ['#5a5a70', '#45455a', '#303042'],
      ores: [
        ['#c88058', '#9a5434', '#683620'], // copper
        ['#a0949a', '#7c7078', '#544c54'], // iron
        ['#ffe070', '#c8a028', '#806410'], // gold
      ],
      cave: ['#1c1420', '#140e18'],
      trunk: ['#5c4638', '#443228', '#2c2018'],
      leaves: ['#3c8a50', '#286a40', '#1a4a32', '#102c24'],
      flowers: ['#b04c68', '#b89a40', '#9a9ab0', '#7a64c0'],
      wood: ['#7c5c44', '#5c4030', '#3a2820'],
      roof: ['#6a3038', '#451f28'],
      window: '#ffcf6b',
      torch: ['#fff2a0', '#ff9a30'],
      glow: { color: '#ffb040', strength: 0.9 },
      dim: 0.3,
      dimColor: '#05040d',
    },
  } satisfies Palette,

  light: {
    /* Two hues only: sky blue, with sunlit amber as its complement */
    text: '#101c33',
    muted: '#34425e',
    faint: '#55627c',
    accent: '#1a56c4',
    gold: '#9a4f00',
    heat: ['#d3d9e6', '#a9c8f2', '#6ea2e8', '#3a78d4', '#1a56c4'],
    /* One per material in the daytime scene, all equally dark: sky, leaf, gold ore, roof tile */
    skillColors: ['#1a56c4', '#1f7a34', '#876000', '#b8243c'],
    scene: {
      sky: ['#7cbcf5', '#8cc5f7', '#a2d0f9', '#c3e1fb'],
      dither: 0.2,
      orb: { body: '#fff3b0', shade: '#ffc94a', halo: '#b4dbff', crescent: false },
      stars: false,
      clouds: { light: '#ffffff', shade: '#dcebff', count: 5 },
      mountains: [
        { body: '#a9c3e6', light: '#bcd2ee', snow: '#eef6ff' },
        { body: '#86a6cf', light: '#9bb8dc', snow: '#e3eefc' },
      ],
      forest: ['#5f9a6c', '#79b07e'],
      grass: ['#7ddc4e', '#4fb335', '#2f8a2b'],
      dirt: ['#b07a4f', '#976038', '#774726'],
      stone: ['#a3a3ab', '#85858f', '#666672'],
      ores: [
        ['#f0a070', '#d0703c', '#964a24'], // copper
        ['#d8c4b0', '#b09880', '#806c5c'], // iron
        ['#fff08a', '#e8c030', '#a88010'], // gold
      ],
      cave: ['#4a3626', '#3a2a1e'],
      trunk: ['#a47a52', '#7a5436', '#553822'],
      leaves: ['#8fe060', '#4fb83a', '#2c8a30', '#1c5c28'],
      flowers: ['#ff6b8a', '#ffd84a', '#ffffff', '#b08cff'],
      wood: ['#c89a60', '#a07040', '#70482a'],
      roof: ['#b04a3a', '#7c2e28'],
      window: '#9fd3ff',
      torch: ['#fff2a0', '#ff9a30'],
      glow: { color: '#ffb040', strength: 0.5 },
      dim: 0,
      dimColor: '#ffffff',
    },
  } satisfies Palette,
}
