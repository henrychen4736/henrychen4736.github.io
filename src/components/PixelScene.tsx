import { useEffect, useRef } from 'react'
import { theme } from '../config/theme'

/**
 * Procedurally drawn pixel-art night city. Drawn once at low resolution
 * and upscaled with `image-rendering: pixelated`, so it stays crisp at any
 * screen size. Change `theme.scene.seed` for a different skyline.
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

// 4x4 Bayer matrix for ordered dithering between sky bands
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16)
const bayer = (x: number, y: number) => BAYER[(((y % 4) + 4) % 4) * 4 + (((x % 4) + 4) % 4)]

function draw(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const { sky, windowGlow, seed } = theme.scene
  const rand = rng(seed)
  const px = (x: number, y: number, c: string, w = 1, h = 1) => {
    ctx.fillStyle = c
    ctx.fillRect(x, y, w, h)
  }

  // Sky: dithered vertical gradient
  const horizon = Math.round(H * 0.78)
  for (let y = 0; y < H; y++) {
    const t = Math.min(y / horizon, 1) * (sky.length - 1)
    const band = Math.min(Math.floor(t), sky.length - 2)
    const f = t - band
    for (let x = 0; x < W; x++) {
      px(x, y, f > bayer(x, y) ? sky[band + 1] : sky[band])
    }
  }

  // Stars
  for (let i = 0; i < (W * H) / 170; i++) {
    const x = Math.floor(rand() * W)
    const y = Math.floor(rand() * H * 0.6)
    const b = rand()
    px(x, y, b > 0.9 ? '#ffffff' : b > 0.6 ? '#c9c3ff' : '#6e64a8')
    if (b > 0.985) {
      px(x - 1, y, '#8f86d6')
      px(x + 1, y, '#8f86d6')
      px(x, y - 1, '#8f86d6')
      px(x, y + 1, '#8f86d6')
    }
  }

  // Crescent moon with a dithered halo
  // Sits in the open header space on wide screens, top-right on narrow ones
  const wide = W / H > 1.2
  const mx = Math.round(W * (wide ? 0.955 : 0.9))
  const my = Math.round(H * (wide ? 0.09 : 0.05))
  const mr = Math.max(5, Math.round(Math.min(W, H) * (wide ? 0.045 : 0.035)))
  for (let y = -mr * 3; y <= mr * 3; y++) {
    for (let x = -mr * 3; x <= mr * 3; x++) {
      const d = Math.hypot(x, y)
      const bite = Math.hypot(x - mr * 0.55, y - mr * 0.35)
      if (d <= mr && bite > mr * 0.85) {
        px(mx + x, my + y, bite < mr * 1.05 ? '#d8cc9c' : '#f6eed0')
      } else if (d > mr && d <= mr * 3) {
        const a = 1 - (d - mr) / (mr * 2)
        if (a * 0.5 > bayer(mx + x, my + y)) px(mx + x, my + y, sky[2])
      }
    }
  }

  // Wispy clouds
  for (let i = 0; i < 4; i++) {
    const cy = Math.round(H * (0.3 + rand() * 0.25))
    const cx = Math.round(rand() * W)
    const len = Math.round(W * (0.15 + rand() * 0.2))
    for (let j = 0; j < len; j++) {
      const thick = Math.round(Math.sin((j / len) * Math.PI) * 3)
      for (let k = 0; k < thick; k++) if (rand() > 0.25) px((cx + j) % W, cy + k, sky[3])
    }
  }

  // Skyline layers: far → near
  const layers = [
    { color: '#251c4a', base: 0.5, var: 0.2, wMin: 8, wMax: 20, lit: 0.12, glowDim: true },
    { color: '#161131', base: 0.62, var: 0.26, wMin: 10, wMax: 26, lit: 0.26, glowDim: false },
    { color: '#08061a', base: 0.84, var: 0.12, wMin: 14, wMax: 34, lit: 0.3, glowDim: false },
  ]
  for (const L of layers) {
    let x = -Math.floor(rand() * 10)
    while (x < W) {
      const bw = Math.round(L.wMin + rand() * (L.wMax - L.wMin))
      const top = Math.round(H * (L.base - rand() * L.var))
      px(x, top, L.color, bw, H - top)
      // Roof details
      const roll = rand()
      if (roll > 0.8) px(x + Math.floor(bw / 2), top - 6, L.color, 1, 6) // antenna
      else if (roll > 0.65) px(x + 2, top - 3, L.color, Math.max(3, bw - 4), 3) // stepped roof
      else if (roll > 0.55) {
        px(x + bw - 6, top - 5, L.color, 4, 3) // water tower
        px(x + bw - 6, top - 2, L.color, 1, 2)
        px(x + bw - 3, top - 2, L.color, 1, 2)
      }
      if (roll > 0.8 && rand() > 0.5) px(x + Math.floor(bw / 2), top - 7, '#ff4d6d')
      // Windows
      const step = L.glowDim ? 3 : 4
      for (let wy = top + 3; wy < H - 2; wy += step) {
        for (let wx = x + 2; wx < x + bw - 2; wx += 3) {
          if (rand() < L.lit) {
            const c = windowGlow[Math.floor(rand() * windowGlow.length)]
            ctx.globalAlpha = L.glowDim ? 0.45 : 0.9
            px(wx, wy, c, 1, L.glowDim ? 1 : 2)
            ctx.globalAlpha = 1
          }
        }
      }
      x += bw + (rand() > 0.7 ? 1 : 0)
    }
  }

  // Foreground rooftop ledge with string lights
  const ledge = H - Math.max(4, Math.round(H * 0.035))
  px(0, ledge, '#05040f', W, H - ledge)
  px(0, ledge, '#1a1533', W, 1)
  for (let x = 0; x < W; x++) {
    const sag = Math.round(Math.sin((x / W) * Math.PI * 3) * 4)
    const y = ledge - 10 + Math.abs(sag)
    if (x % 2 === 0) px(x, y, '#2a2347')
    if (x % 9 === 0) px(x, y + 1, windowGlow[(x / 9) % windowGlow.length])
  }
}

export function PixelScene() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const render = () => {
      const s = theme.scene.pixelSize
      const W = Math.ceil(window.innerWidth / s)
      const H = Math.ceil(window.innerHeight / s)
      if (canvas.width === W && canvas.height === H) return
      canvas.width = W
      canvas.height = H
      draw(ctx, W, H)
    }
    render()
    let t = 0
    const onResize = () => {
      clearTimeout(t)
      t = window.setTimeout(render, 150)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div className="scene" aria-hidden>
      <canvas ref={ref} className="scene__canvas" />
      <div className="scene__dim" style={{ opacity: theme.scene.dim }} />
    </div>
  )
}
