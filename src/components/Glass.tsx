import LiquidGlass from 'liquid-glass-react'
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useTheme } from './ThemeProvider'

/**
 * Layout-friendly wrapper around `liquid-glass-react`.
 *
 * The library positions its glass with `top/left: 50%` + `translate(-50%)`,
 * i.e. it centers itself over a positioned box. So we render an invisible
 * "ghost" copy of the content in normal flow to give the box its size, then
 * center the real glass over it with an explicit width/height.
 *
 * Everything the library offers comes through: refraction, chromatic edges,
 * elastic stretch toward the cursor, mouse-tracking rim light, and hover /
 * press highlights (enabled for anything with `href` or `onClick`).
 */

type Preset = 'card' | 'button' | 'chip'

const presets: Record<Preset, { elasticity: number; displacement: number; blur: number; aberration: number; saturation: number }> = {
  card: { elasticity: 0.04, displacement: 90, blur: 0.08, aberration: 1.5, saturation: 140 },
  button: { elasticity: 0.3, displacement: 30, blur: 0.08, aberration: 1.5, saturation: 150 },
  chip: { elasticity: 0.25, displacement: 22, blur: 0.08, aberration: 1, saturation: 150 },
}

interface GlassProps {
  children: ReactNode
  preset?: Preset
  /** Classes on the outer slot (layout: margins, grid placement, …) */
  className?: string
  /** Classes on the content box (padding, typography, flex, …) */
  contentClassName?: string
  radius?: number
  /** Stretch to the parent's width (cards). Otherwise hugs content. */
  fill?: boolean
  href?: string
  newTab?: boolean
  onClick?: () => void
  label?: string
}

const noop = () => {}

export function Glass({
  children,
  preset = 'button',
  className = '',
  contentClassName = '',
  radius = 999,
  fill = false,
  href,
  newTab,
  onClick,
  label,
}: GlassProps) {
  const ghost = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)
  // Bright backdrops show refraction artifacts more, so light mode bends less.
  const light = useTheme().mode === 'light'
  const p = presets[preset]
  // Bright backdrops show refraction artifacts more: cards bend less and frost more in light mode
  const soft = light ? (preset === 'card' ? 0.35 : 0.6) : 1
  const blur = light && preset === 'card' ? 0.4 : p.blur
  // High saturation amplifies the pastel facades behind light cards into smears
  const saturation = light ? 110 : p.saturation

  useLayoutEffect(() => {
    const el = ghost.current!
    const measure = () => {
      const w = el.offsetWidth
      const h = el.offsetHeight
      setSize((s) => (s && s.w === w && s.h === h ? s : { w, h }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // The library re-measures its highlight layers on window resize only.
  useLayoutEffect(() => {
    if (size) window.dispatchEvent(new Event('resize'))
  }, [size])

  const box = `lg-box ${contentClassName}`
  const boxStyle = size ? { width: size.w, height: size.h } : undefined
  const content = href ? (
    <a
      className={box}
      style={boxStyle}
      href={href}
      aria-label={label}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noreferrer' : undefined}
    >
      {children}
    </a>
  ) : onClick ? (
    <button className={box} style={boxStyle} aria-label={label} type="button">
      {children}
    </button>
  ) : (
    <div className={box} style={boxStyle}>
      {children}
    </div>
  )

  return (
    <div className={`lg-slot lg-slot--${preset} ${fill ? 'lg-slot--fill' : ''} ${className}`}>
      <div ref={ghost} className={`${box} lg-ghost`} aria-hidden inert>
        {children}
      </div>
      {size && (
        <LiquidGlass
          style={{ position: 'absolute', top: '50%', left: '50%' }}
          cornerRadius={radius}
          padding="0"
          elasticity={p.elasticity}
          displacementScale={p.displacement * soft}
          blurAmount={blur}
          aberrationIntensity={p.aberration * soft}
          saturation={saturation}
          onClick={onClick ?? (href ? noop : undefined)}
        >
          {content}
        </LiquidGlass>
      )}
    </div>
  )
}
