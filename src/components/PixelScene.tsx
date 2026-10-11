import { useEffect, useRef } from 'react'
import { theme, type Palette } from '../config/theme'
import { useTheme } from './ThemeProvider'

/**
 * Procedurally drawn sandbox-game landscape (think Terraria): mountains,
 * forest, a floating sky island and tiled terrain with caves and ore — night
 * in dark mode, a sunny day in light mode. Drawn once at low resolution and upscaled with
 * `image-rendering: pixelated`, so it stays crisp at any size.
 */

function rng(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// 4x4 Bayer matrix for ordered dithering
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16)
const bayer = (x: number, y: number) => BAYER[(((y % 4) + 4) % 4) * 4 + (((x % 4) + 4) % 4)]

// Art pixels per terrain tile
const T = 4
const smooth = (t: number) => t * t * (3 - 2 * t)

interface Island {
  cx: number
  top: number
  hw: number
}

function draw(ctx: CanvasRenderingContext2D, W: number, H: number, P: Palette['scene'], island: Island | null) {
  // Same seed for both modes so the world matches when toggling
  const rand = rng(theme.seed)
  // Position-keyed randomness, so terrain doesn't depend on draw order
  const hash = (x: number, y: number, k: number) => {
    let n = (x * 374761393 + y * 668265263 + k * 1274126177 + theme.seed * 974711) | 0
    n = Math.imul(n ^ (n >>> 13), 1274126177)
    return ((n ^ (n >>> 16)) >>> 0) / 4294967296
  }
  const noise = (x: number, y: number, k: number) => {
    const xi = Math.floor(x)
    const yi = Math.floor(y)
    const fx = smooth(x - xi)
    const fy = smooth(y - yi)
    const a = hash(xi, yi, k)
    const b = hash(xi + 1, yi, k)
    const c = hash(xi, yi + 1, k)
    const d = hash(xi + 1, yi + 1, k)
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy
  }
  const px = (x: number, y: number, c: string, w = 1, h = 1) => {
    ctx.fillStyle = c
    ctx.fillRect(x, y, w, h)
  }
  const { sky } = P

  // Sky: dithered vertical gradient
  const horizon = Math.round(H * 0.78)
  for (let y = 0; y < H; y++) {
    const t = Math.min(y / horizon, 1) * (sky.length - 1)
    const band = Math.min(Math.floor(t), sky.length - 2)
    // Flat bands with thin dithered seams when P.dither < 1
    const f = Math.min(Math.max((t - band - (1 - P.dither)) / P.dither, 0), 1)
    for (let x = 0; x < W; x++) px(x, y, f > bayer(x, y) ? sky[band + 1] : sky[band])
  }

  // Stars (consume the same random numbers in both modes)
  for (let i = 0; i < (W * H) / 170; i++) {
    const x = Math.floor(rand() * W)
    const y = Math.floor(rand() * H * 0.6)
    const b = rand()
    if (!P.stars) continue
    px(x, y, b > 0.9 ? '#ffffff' : b > 0.6 ? '#c9c3ff' : '#6e64a8')
    if (b > 0.985) {
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) px(x + dx, y + dy, '#8f86d6')
    }
  }

  // Moon / sun with a dithered halo
  const wide = W / H > 1.2
  // Wide screens: in the open hero space right of the name, beside the island
  const mx = island ? island.cx - island.hw - 14 : Math.round(W * (wide ? 0.75 : 0.9))
  const my = Math.round(H * (wide ? 0.12 : 0.15))
  const mr = Math.max(4, Math.round(Math.min(W, H) * (wide ? 0.055 : 0.045)))
  const { orb } = P
  // Phones: the toggle carries the sun/moon motif, so skip it to keep the header clear
  if (wide) {
  for (let y = -mr * 3; y <= mr * 3; y++) {
    for (let x = -mr * 3; x <= mr * 3; x++) {
      const d = Math.hypot(x, y)
      const bite = Math.hypot(x - mr * 0.5, y - mr * 0.3)
      const inBody = d <= mr && (!orb.crescent || bite > mr * 0.85)
      if (inBody) {
        const shaded = orb.crescent ? bite < mr * 1.05 : x + y > mr * 0.5
        px(mx + x, my + y, shaded ? orb.shade : orb.body)
      } else if (d > mr && d <= mr * 3) {
        const a = 1 - (d - mr) / (mr * 2)
        if (a * 0.5 > bayer(mx + x, my + y)) px(mx + x, my + y, orb.halo)
      }
    }
  }
  if (!orb.crescent) {
    // Sun rays
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2
      for (let r = mr + 3; r < mr + 6; r++) px(mx + Math.round(Math.cos(ang) * r), my + Math.round(Math.sin(ang) * r), orb.shade)
    }
  }
  }

  // Puffy clouds
  const cloudRand = rng(theme.seed + 101)
  for (let i = 0; i < P.clouds.count; i++) {
    const cx = Math.round(cloudRand() * W)
    // Keep clouds below the hero text: under it on wide screens, lower on phones
    const cy = Math.round(H * (wide ? 0.32 + cloudRand() * 0.22 : 0.64 + cloudRand() * 0.14))
    const puffs = 3 + Math.floor(cloudRand() * 3)
    const base = 3 + Math.floor(cloudRand() * 3)
    for (let p = 0; p < puffs; p++) {
      const r = base + Math.floor(cloudRand() * 3)
      const ox = cx + p * Math.round(base * 1.4)
      const oy = cy - (p % 2 === 1 ? Math.round(r * 0.5) : 0)
      for (let y = -r; y <= r; y++) {
        for (let x = -r; x <= r; x++) {
          if (Math.hypot(x, y) > r || oy + y > cy + base) continue
          px((ox + x + W) % W, oy + y, y > r * 0.25 ? P.clouds.shade : P.clouds.light)
        }
      }
    }
  }

  // Background mountains: far → near, lit from the upper left
  const tri = (t: number) => Math.abs((((t % 2) + 2) % 2) - 1)
  P.mountains.forEach((M, i) => {
    const base = H * (0.6 + i * 0.06)
    const amp = H * (0.26 - i * 0.06)
    let prev = 0
    for (let x = 0; x < W; x++) {
      const n = tri(x * (0.021 + i * 0.012) + i * 0.7) * 0.55 + tri(x * (0.057 + i * 0.02) + 1.3) * 0.3 + noise(x / 3, i, 30) * 0.15
      const top = Math.round(base - amp * n)
      px(x, top, M.body, 1, H - top)
      if (n > 0.7) px(x, top, M.snow, 1, Math.max(1, Math.round((n - 0.7) * amp * 0.7 + hash(x, i, 31) * 2)))
      else if (x > 0 && top < prev) px(x, top, M.light, 1, 2)
      prev = top
    }
  })

  // Distant forest treeline
  for (let x = 0; x < W; x++) {
    const bump = Math.abs(Math.sin(x * 0.45 + noise(x / 6, 0, 32) * 6)) * 3
    const top = Math.round(H * 0.66 - Math.sin(x * 0.035 + 2) * H * 0.03 - bump)
    px(x, top, P.forest[1])
    px(x, top + 1, P.forest[0], 1, H - top - 1)
  }

  // Dithered light around torches and lit windows
  const glow = (cx: number, cy: number, R: number) => {
    ctx.globalAlpha = 0.3
    for (let y = -R; y <= R; y++) {
      for (let x = -R; x <= R; x++) {
        const d = Math.hypot(x, y)
        if (d < 1 || d > R) continue
        if ((1 - d / R) * P.glow.strength > bayer(cx + x, cy + y)) px(cx + x, cy + y, P.glow.color)
      }
    }
    ctx.globalAlpha = 1
  }

  // Leafy blob: union of circles ([dx, dy, r]) with three tones and a dark outline
  const blob = (cx: number, cy: number, circles: number[][]) => {
    const inside = (x: number, y: number) => circles.some(([ox, oy, r]) => Math.hypot(x - ox, y - oy) <= r)
    const R = Math.ceil(Math.max(...circles.map(([ox, oy, r]) => Math.max(Math.abs(ox), Math.abs(oy)) + r)))
    const [light, mid, dark, outline] = P.leaves
    for (let y = -R; y <= R; y++) {
      for (let x = -R; x <= R; x++) {
        if (!inside(x, y)) continue
        const edge = !inside(x + 1, y) || !inside(x - 1, y) || !inside(x, y + 1) || !inside(x, y - 1)
        const t = (x * 0.5 + y) / R + (hash(cx + x, cy + y, 27) - 0.5) * 0.5
        px(cx + x, cy + y, edge ? outline : t < -0.25 ? light : t > 0.3 ? dark : mid)
      }
    }
  }

  // Tree: 2px trunk rooted at (x, ground), `h` tall, topped with a canopy
  const tree = (x: number, ground: number, h: number, k: number) => {
    const [tl, tm, td] = P.trunk
    px(x, ground - h, tl, 1, h)
    px(x + 1, ground - h, td, 1, h)
    for (let y = ground - h + 3; y < ground - 2; y += 3 + Math.floor(hash(x, y, 26) * 3)) px(x, y, tm)
    px(x - 1, ground - 1, tm)
    px(x + 2, ground - 1, td)
    if (h > 16) {
      const right = hash(k, 2, 26) > 0.5
      const by = ground - Math.round(h * 0.45)
      px(right ? x + 2 : x - 2, by, tm, 2, 1)
      blob(right ? x + 5 : x - 4, by - 1, [[0, 0, 2.5]])
    }
    const r = 5 + Math.floor(hash(k, 3, 26) * 3)
    blob(x + 1, ground - h - r + 3, [
      [0, 0, r],
      [-r * 0.75, r * 0.35, r * 0.65],
      [r * 0.75, r * 0.3, r * 0.65],
      [0, -r * 0.55, r * 0.7],
    ])
  }

  // Wooden cabin, 13px wide, standing on `ground`
  const house = (x: number, ground: number) => {
    const [, wm, wd] = P.wood
    px(x, ground - 8, wm, 13, 8)
    px(x, ground - 6, wd, 13, 1)
    px(x, ground - 3, wd, 13, 1)
    px(x, ground - 8, wd, 1, 8)
    px(x + 12, ground - 8, wd, 1, 8)
    for (let i = 0; i < 5; i++) px(x - 1 + Math.round(i * 1.5), ground - 9 - i, P.roof[i === 0 ? 1 : 0], 15 - 3 * i, 1)
    px(x + 2, ground - 5, wd, 3, 5)
    px(x + 4, ground - 3, P.torch[0])
    px(x + 7, ground - 6, P.window, 3, 3)
    glow(x + 8, ground - 5, 7)
  }

  // Floating sky island in the open hero space, left of the theme toggle
  if (island) {
    const { cx, top, hw } = island
    for (const [ox, oy, r] of [[-hw + 2, 5, 4], [hw - 2, 5, 4], [-hw + 9, 8, 4], [hw - 8, 9, 4], [0, 10, 4]]) {
      for (let y = -r; y <= r; y++) {
        for (let x = -r; x <= r; x++) {
          if (Math.hypot(x, y) <= r) px(cx + ox + x, top + oy + y, y > r * 0.25 ? P.clouds.shade : P.clouds.light)
        }
      }
    }
    for (let x = -hw; x <= hw; x++) {
      const u = x / hw
      const depth = Math.max(2, Math.round(Math.pow(1 - u * u, 0.7) * 10 + noise((cx + x) / 3, 5, 33) * 3))
      const soil = 3 + Math.floor(hash(cx + x, 0, 34) * 2)
      for (let y = 0; y < depth; y++) {
        const tones = y < soil ? P.dirt : P.stone
        const speck = hash(cx + x, y, 35)
        const c = y === 0 ? P.grass[0] : y === 1 ? P.grass[1] : y === depth - 1 || speck > 0.85 ? tones[2] : speck < 0.1 ? tones[0] : tones[1]
        px(cx + x, top + y, c)
      }
      if (hash(cx + x, 1, 22) > 0.7) px(cx + x, top - 1, P.grass[1])
    }
    house(cx - hw + 5, top)
    tree(cx + hw - 12, top, 14, 99)
  }

  // Terrain: a grid of T×T tiles — grass over dirt over stone, with caves and ore
  const cols = Math.ceil(W / T) + 1
  const rows = Math.ceil(H / T) + 1
  const baseRow = Math.round(rows * (wide ? 0.78 : 0.84))
  const phase = [rand() * 6.28, rand() * 6.28, rand() * 6.28]
  const surf: number[] = []
  for (let c = 0; c < cols; c++) {
    // Wide screens: hills climb into the exposed side margins
    const edge = wide ? Math.max(0, 1 - Math.min(c, cols - 1 - c) / (cols * 0.11)) : 0
    const roll = Math.sin(c * 0.11 + phase[0]) * 2 + Math.sin(c * 0.29 + phase[1]) * 1.2 + Math.sin(c * 0.63 + phase[2]) * 0.6
    surf[c] = baseRow - Math.round(roll + smooth(edge) * rows * 0.3)
  }
  // Level a plot for the cabin
  const plot = Math.round(cols * 0.36)
  for (let c = plot; c < plot + 4 && c < cols; c++) surf[c] = surf[plot]

  const AIR = 0, GRASS = 1, DIRT = 2, STONE = 3, CAVE = 4, ORE = 5
  const material = (c: number, r: number) => {
    const d = r - surf[c]
    if (d < 0) return AIR
    if (d === 0) return GRASS
    if (d >= 4 && (noise(c / 6, r / 4, 11) > 0.68 || Math.abs(noise(c / 9, r / 6, 12) - 0.5) < 0.035)) return CAVE
    if (d < 4 + Math.floor(noise(c / 4, 0, 13) * 4)) return noise(c / 3, r / 3, 14) > 0.78 ? STONE : DIRT
    if (noise(c / 4, r / 3, 15) > 0.75) return DIRT
    if (noise(c / 2.5, r / 2.5, 16) > 0.8) return ORE + Math.floor(hash(Math.floor(c / 8), Math.floor(r / 8), 17) * P.ores.length)
    return STONE
  }
  const grid = new Uint8Array(cols * rows)
  for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) grid[r * cols + c] = material(c, r)
  // Off-canvas counts as solid so the screen edges don't get outlined
  const at = (c: number, r: number) => (c < 0 || c >= cols || r >= rows ? STONE : r < 0 ? AIR : grid[r * cols + c])
  const open = (c: number, r: number) => at(c, r) === AIR || at(c, r) === CAVE

  const torches: number[][] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const m = at(c, r)
      if (m === AIR) continue
      const x = c * T
      const y = r * T
      if (m === CAVE) {
        px(x, y, P.cave[0], T, T)
        for (let i = 0; i < 2; i++) px(x + Math.floor(hash(c, r, i) * T), y + Math.floor(hash(c, r, i + 5) * T), P.cave[1])
        if (!open(c, r + 1) && hash(c, r, 24) < 0.1) torches.push([x + 1, y])
        continue
      }
      const [light, mid, dark] = m === STONE || m >= ORE ? P.stone : P.dirt
      px(x, y, mid, T, T)
      for (let i = 0; i < 3; i++) px(x + Math.floor(hash(c, r, i) * T), y + Math.floor(hash(c, r, i + 5) * T), i === 0 ? light : dark)
      if (m >= ORE) {
        const ore = P.ores[m - ORE]
        for (let i = 0; i < 5; i++) px(x + Math.floor(hash(c, r, i + 10) * T), y + Math.floor(hash(c, r, i + 15) * T), ore[i % 3])
      }
      // Outline faces that meet open air; grass creeps down exposed dirt
      const grassy = m === GRASS || m === DIRT
      if (open(c, r - 1)) px(x, y, light, T, 1)
      if (open(c, r + 1)) px(x, y + T - 1, dark, T, 1)
      if (open(c - 1, r)) px(x, y, grassy && at(c - 1, r) === AIR ? P.grass[1] : dark, 1, T)
      if (open(c + 1, r)) px(x + T - 1, y, grassy && at(c + 1, r) === AIR ? P.grass[1] : dark, 1, T)
      if (m === GRASS) {
        px(x, y, P.grass[0], T, 1)
        px(x, y + 1, P.grass[1], T, 1)
        for (let i = 0; i < T; i++) {
          if (hash(x + i, y, 21) > 0.45) px(x + i, y + 2, P.grass[2])
          const blade = hash(x + i, y, 22)
          if (blade > 0.7) px(x + i, y - 1, P.grass[blade > 0.9 ? 0 : 1])
        }
        const bloom = hash(c, r, 23)
        if (bloom > 0.86) {
          px(x + 1, y - 1, P.grass[2])
          px(x + 1, y - 2, P.flowers[Math.floor(((bloom - 0.86) / 0.14) * P.flowers.length)])
        }
      }
    }
  }

  for (const [x, y] of torches) {
    px(x, y + 2, P.trunk[1], 1, 2)
    px(x, y + 1, P.torch[1])
    px(x, y, P.torch[0])
    glow(x, y, 10)
  }

  house(plot * T + 1, surf[plot] * T)
  let last = plot + 3
  for (let c = 1; c < cols - 1; c++) {
    if ((c >= plot - 1 && c <= plot + 4) || Math.abs(c - last) < 3 || hash(c, 0, 25) > 0.38) continue
    last = c
    tree(c * T + 1, surf[c] * T, 12 + Math.floor(hash(c, 1, 25) * 18), c)
  }
}

export function PixelScene() {
  const ref = useRef<HTMLCanvasElement>(null)
  const { mode } = useTheme()
  const P = theme[mode].scene

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const render = (force = false) => {
      const s = theme.pixelSize
      const W = Math.ceil(window.innerWidth / s)
      const H = Math.ceil(window.innerHeight / s)
      if (!force && canvas.width === W && canvas.height === H) return
      canvas.width = W
      canvas.height = H
      // The island needs room between the name and the theme toggle
      const right = document.querySelector('.layout')?.getBoundingClientRect().right
      const roomy = right !== undefined && W / H > 1.2 && window.innerWidth >= 1200
      draw(ctx, W, H, P, roomy ? { cx: Math.round(right / s) - 34, top: Math.round(180 / s), hw: 22 } : null)
    }
    render(true)
    // Cross-fade when the theme changes
    canvas.animate([{ opacity: 0.2 }, { opacity: 1 }], { duration: 500, easing: 'ease-out' })
    let t = 0
    const onResize = () => {
      clearTimeout(t)
      t = window.setTimeout(() => render(), 150)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [P])

  return (
    <div className="scene" aria-hidden>
      <canvas ref={ref} className="scene__canvas" />
      <div className="scene__dim" style={{ opacity: P.dim, background: P.dimColor }} />
    </div>
  )
}
