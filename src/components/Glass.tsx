import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react'

/**
 * Liquid glass surface.
 *
 * Technique adapted from shuding/liquid-glass (SVG displacement via
 * `backdrop-filter: url(#filter)`): a displacement map is generated for the
 * element's exact size so the backdrop bends toward the rim like a thick lens.
 * Browsers without SVG backdrop filters (Safari, Firefox) fall back to a
 * frosted blur with the same highlights, so it still looks intentional.
 */

type GlassProps<T extends ElementType> = {
  as?: T
  children?: ReactNode
  className?: string
  style?: CSSProperties
  /** Corner radius in px. Use a large number for a pill. */
  radius?: number
  /** Width of the refracting rim in px */
  bezel?: number
  /** Displacement strength. Negative values magnify toward the rim. */
  refraction?: number
  blur?: number
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className' | 'style'>

const supportsSvgBackdrop = (() => {
  if (typeof navigator === 'undefined') return false
  // Only Chromium renders url() filters inside backdrop-filter.
  return /Chrome|Chromium|Edg\//.test(navigator.userAgent) && !/Firefox/.test(navigator.userAgent)
})()

function buildDisplacementMap(w: number, h: number, radius: number, bezel: number) {
  // Generated at half resolution; feImage stretches it back up.
  const s = 0.5
  const cw = Math.max(2, Math.round(w * s))
  const ch = Math.max(2, Math.round(h * s))
  const canvas = document.createElement('canvas')
  canvas.width = cw
  canvas.height = ch
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(cw, ch)
  const r = Math.min(radius, w / 2, h / 2)
  const hw = w / 2
  const hh = h / 2

  for (let py = 0; py < ch; py++) {
    for (let px = 0; px < cw; px++) {
      const x = px / s - hw
      const y = py / s - hh
      // Signed distance to a rounded rectangle (negative inside)
      const qx = Math.abs(x) - (hw - r)
      const qy = Math.abs(y) - (hh - r)
      const ox = Math.max(qx, 0)
      const oy = Math.max(qy, 0)
      const outside = Math.hypot(ox, oy)
      const d = outside + Math.min(Math.max(qx, qy), 0) - r
      const t = Math.min(Math.max(-d / bezel, 0), 1)
      const strength = Math.pow(1 - t, 2.2)
      // Outward normal of the rim
      let nx = 0
      let ny = 0
      if (outside > 0) {
        nx = (ox / outside) * Math.sign(x)
        ny = (oy / outside) * Math.sign(y)
      } else if (qx > qy) {
        nx = Math.sign(x)
      } else {
        ny = Math.sign(y)
      }
      const i = (py * cw + px) * 4
      img.data[i] = 128 + nx * strength * 127
      img.data[i + 1] = 128 + ny * strength * 127
      img.data[i + 2] = 128
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas.toDataURL()
}

export function Glass<T extends ElementType = 'div'>({
  as,
  children,
  className = '',
  style,
  radius = 999,
  bezel = 18,
  refraction = -60,
  blur = 6,
  ...rest
}: GlassProps<T>) {
  const Tag = (as ?? 'div') as ElementType
  const ref = useRef<HTMLElement>(null)
  const filterId = `lg-${useId().replace(/:/g, '')}`
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [map, setMap] = useState('')

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || !supportsSvgBackdrop) return
    const ro = new ResizeObserver(() => {
      const w = el.offsetWidth
      const h = el.offsetHeight
      setSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!size.w || !size.h) return
    setMap(buildDisplacementMap(size.w, size.h, radius, bezel))
  }, [size.w, size.h, radius, bezel])

  const r = Math.min(radius, size.h ? size.h / 2 : radius)
  const backdrop = map
    ? `url(#${filterId}) blur(${blur}px) saturate(170%) brightness(1.05)`
    : `blur(${blur * 2.5}px) saturate(170%) brightness(1.05)`

  return (
    <Tag
      ref={ref}
      className={`glass ${className}`}
      style={
        {
          ...style,
          '--glass-radius': `${r}px`,
          '--glass-backdrop': backdrop,
        } as CSSProperties
      }
      {...rest}
    >
      {map && (
        <svg className="glass__defs" aria-hidden width="0" height="0">
          <filter
            id={filterId}
            x="0"
            y="0"
            width={size.w}
            height={size.h}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              href={map}
              x="0"
              y="0"
              width={size.w}
              height={size.h}
              preserveAspectRatio="none"
              result="map"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={refraction}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
      )}
      <span className="glass__shine" aria-hidden />
      <span className="glass__content">{children}</span>
    </Tag>
  )
}
