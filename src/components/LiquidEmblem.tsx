import { LiquidMetal } from '@paper-design/shaders-react'
import { useEffect, useState } from 'react'
import { site } from '../config/site'
import { theme } from '../config/theme'

/**
 * Renders the monogram (or a custom logo) as liquid metal, using the shader
 * behind paper-design/liquid-logo (shipped in @paper-design/shaders-react).
 * If `site.person.photo` is set, renders the photo inside a liquid-metal ring.
 */
function useMonogramImage(text: string, font: string, weight: number, spacing: number) {
  const [src, setSrc] = useState('')

  useEffect(() => {
    let cancelled = false
    document.fonts
      .load(font, text)
      .catch(() => undefined)
      .then(() => {
        if (cancelled) return
        const size = 1000
        const fontPx = parseFloat(font.match(/(\d+)px/)?.[1] ?? '500')
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = size
        const ctx = canvas.getContext('2d')!
        ctx.font = font
        ctx.letterSpacing = `${spacing * fontPx}px`
        const m = ctx.measureText(text)
        // measureText includes trailing spacing after the last glyph
        const textW = m.width - spacing * fontPx
        const textH = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent
        // Fit glyphs inside ~76% of the square
        const scale = Math.min((size * 0.76) / textW, (size * 0.76) / textH)
        ctx.translate(size / 2, size / 2)
        ctx.scale(scale, scale)
        ctx.fillStyle = ctx.strokeStyle = '#000'
        ctx.textAlign = 'left'
        const x = -textW / 2
        const y = (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2
        ctx.fillText(text, x, y)
        if (weight > 0) {
          ctx.lineJoin = 'round'
          ctx.lineWidth = fontPx * weight
          ctx.strokeText(text, x, y)
        }
        setSrc(canvas.toDataURL('image/png'))
      })
    return () => {
      cancelled = true
    }
  }, [text, font, weight, spacing])

  return src
}

export function LiquidEmblem({ className = '' }: { className?: string }) {
  const { emblem } = theme
  const { photo, logoImage, monogram } = site.person
  const generated = useMonogramImage(
    photo || logoImage ? '' : monogram,
    emblem.font,
    emblem.weight,
    emblem.letterSpacing,
  )
  const image = logoImage || generated

  const metal = {
    colorBack: emblem.colorBack,
    colorTint: emblem.colorTint,
    speed: emblem.speed,
    repetition: emblem.repetition,
    distortion: emblem.distortion,
    softness: emblem.softness,
    shiftRed: emblem.dispersion,
    shiftBlue: emblem.dispersion,
    contour: emblem.contour,
    angle: 70,
  }

  if (photo) {
    return (
      <div className={`emblem emblem--photo ${className}`}>
        <div className="emblem__halo" />
        <LiquidMetal className="emblem__metal" shape="circle" scale={1} {...metal} />
        <img className="emblem__photo" src={photo} alt={`${site.person.firstName} ${site.person.lastName}`} />
      </div>
    )
  }

  return (
    <div className={`emblem ${className}`} aria-hidden>
      <div className="emblem__halo" />
      {image && <LiquidMetal className="emblem__metal" image={image} scale={1} fit="contain" {...metal} />}
    </div>
  )
}
