import { useEffect, useRef } from 'react'
import { theme, type Palette } from '../config/theme'
import { useTheme } from './ThemeProvider'

/**
 * Procedurally drawn pixel-art city — a night scene in dark mode, a sunny
 * day in light mode. Drawn once at low resolution and upscaled with
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

function draw(ctx: CanvasRenderingContext2D, W: number, H: number, P: Palette['scene']) {
  // Same seed for both modes so the skyline matches when toggling
  const rand = rng(theme.seed)
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
  // Wide screens: in the open hero space right of the name. Phones: top right.
  const mx = Math.round(W * (wide ? 0.75 : 0.9))
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

  // Skyline layers: far → near
  const layers = [
    { base: 0.5, var: 0.2, wMin: 8, wMax: 20, lit: 0.12, far: true },
    { base: 0.62, var: 0.26, wMin: 10, wMax: 26, lit: 0.26, far: false },
    { base: 0.84, var: 0.12, wMin: 14, wMax: 34, lit: 0.3, far: false },
  ]
  // Facade colors come from their own RNG so the layout is identical in both themes
  const colorRand = rng(theme.seed + 202)
  layers.forEach((L, li) => {
    const choices = P.buildings[li]
    let x = -Math.floor(rand() * 10)
    while (x < W) {
      const color = choices[Math.floor(colorRand() * choices.length)]
      const bw = Math.round(L.wMin + rand() * (L.wMax - L.wMin))
      let top = Math.round(H * (L.base - rand() * L.var))
      // Landmark towers in the exposed side margins on wide screens
      if (wide && li === 2 && (x < W * 0.07 || x > W * 0.92)) top = Math.round(H * 0.42)
      px(x, top, color, bw, H - top)
      if (P.rim && li > 0) px(x, top, P.rim, bw, 1)
      const roll = rand()
      if (roll > 0.8) px(x + Math.floor(bw / 2), top - 6, color, 1, 6) // antenna
      else if (roll > 0.65) px(x + 2, top - 3, color, Math.max(3, bw - 4), 3) // stepped roof
      else if (roll > 0.55) {
        px(x + bw - 6, top - 5, color, 4, 3) // water tower
        px(x + bw - 6, top - 2, color, 1, 2)
        px(x + bw - 3, top - 2, color, 1, 2)
      }
      if (roll > 0.8 && rand() > 0.5) px(x + Math.floor(bw / 2), top - 7, '#ff4d6d')
      const step = L.far ? 3 : 4
      for (let wy = top + 3; wy < H - 2; wy += step) {
        for (let wx = x + 2; wx < x + bw - 2; wx += 3) {
          if (rand() < L.lit * P.litDensity) {
            const c = P.windows[Math.floor(rand() * P.windows.length)]
            ctx.globalAlpha = L.far ? P.windowAlpha * 0.5 : P.windowAlpha
            px(wx, wy, c, 1, L.far ? 1 : 2)
            ctx.globalAlpha = 1
          }
        }
      }
      x += bw + (rand() > 0.7 ? 1 : 0)
    }
  })

  // Foreground rooftop ledge with string lights
  const ledge = H - Math.max(4, Math.round(H * 0.035))
  px(0, ledge, P.ground, W, H - ledge)
  px(0, ledge, P.ledge, W, 1)
  for (let x = 0; x < W; x++) {
    const sag = Math.round(Math.sin((x / W) * Math.PI * 3) * 4)
    const y = ledge - 10 + Math.abs(sag)
    if (x % 2 === 0) px(x, y, P.ledge)
    if (x % 9 === 0) px(x, y + 1, P.windows[(x / 9) % P.windows.length])
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
      draw(ctx, W, H, P)
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
