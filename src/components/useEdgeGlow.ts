import { useEffect } from 'react'

/**
 * Pointer-proximity border light for every `.edge-glow` element.
 *
 * Sets three CSS variables per element, consumed by `.edge-glow::before`:
 *   --gx / --gy  pointer position relative to the element (center of the glow)
 *   --edge       0–1, how close the pointer is to the element's border
 *
 * The glow is a radial gradient masked to a 1px ring, so only the stretch of
 * border nearest the cursor lights up. Toward the middle of an element the
 * pointer is far from every edge and `--edge` falls to 0.
 */
export function useEdgeGlow() {
  useEffect(() => {
    let px = -1e5
    let py = -1e5
    let frame = 0

    const update = () => {
      frame = 0
      for (const el of document.querySelectorAll<HTMLElement>('.edge-glow')) {
        if (el.closest('.lg-ghost')) continue
        const r = el.getBoundingClientRect()
        // Reach scales with size: on a small button the center counts as "far"
        const reach = Math.min(40, Math.min(r.width, r.height) * 0.4)
        const outside = Math.hypot(Math.max(r.left - px, 0, px - r.right), Math.max(r.top - py, 0, py - r.bottom))
        const inside = Math.min(px - r.left, r.right - px, py - r.top, r.bottom - py)
        const dist = outside > 0 ? outside : inside
        const edge = Math.max(0, 1 - dist / reach)
        if (edge === 0 && el.style.getPropertyValue('--edge') === '0') continue
        el.style.setProperty('--edge', edge === 0 ? '0' : edge.toFixed(3))
        if (edge > 0) {
          el.style.setProperty('--gx', `${px - r.left}px`)
          el.style.setProperty('--gy', `${py - r.top}px`)
        }
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const onMove = (e: PointerEvent) => {
      px = e.clientX
      py = e.clientY
      schedule()
    }
    const onLeave = () => {
      px = py = -1e5
      schedule()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', schedule, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', schedule)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])
}
