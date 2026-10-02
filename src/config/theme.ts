/**
 * ─────────────────────────────────────────────────────────────
 *  THEME — colors for the cards and the pixel-art background.
 * ─────────────────────────────────────────────────────────────
 */

export const theme = {
  colors: {
    text: '#eceaf6',
    muted: '#b4aed4',
    /** Links, org names, tag text */
    accent: '#c4a7ff',
    /** Contribution heatmap (lightest → strongest) */
    heat: ['#1b1f2e', '#0e4429', '#006d32', '#26a641', '#39d353'],
  },

  /** Pixel-art night scene drawn behind the cards */
  scene: {
    /** Screen pixels per art pixel. Bigger = chunkier. */
    pixelSize: 5,
    /** How much the scene is darkened behind the cards (0–1) */
    dim: 0.3,
    sky: ['#0b0a1f', '#1a1440', '#3a2466', '#6b3a7a'],
    windowGlow: ['#ffcf6b', '#ffb347', '#ff8f5a', '#9fd3ff'],
    /** Seed for the city layout — change for a different skyline */
    seed: 7,
  },
}
