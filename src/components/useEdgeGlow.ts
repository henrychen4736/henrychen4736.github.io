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
 *
 * On touch screens the light follows a finger while it is down; otherwise it
 * sits at a fixed point in the viewport so borders glint as they scroll by.
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
    // Touch has no hover: a finger leaves its last position behind, and that
    // stale point then lights whatever scrolls under it. So the light follows
    // a finger only while it is down, and otherwise rests at a fixed spot in
    // the viewport, catching each border as the page scrolls past it.
    const touch = window.matchMedia('(hover: none)')
    let held = false
    let release = 0
    const rest = () => {
      if (touch.matches) {
        px = window.innerWidth / 2
        py = window.innerHeight * 0.38
      } else {
        px = py = -1e5
      }
      schedule()
    }
    const track = (e: PointerEvent) => {
      px = e.clientX
      py = e.clientY
      schedule()
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' || held) track(e)
    }
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return
      clearTimeout(release)
      held = true
      track(e)
    }
    // Also fires as pointercancel when the browser takes over to scroll
    const onUp = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return
      held = false
      clearTimeout(release)
      release = window.setTimeout(rest, 250)
    }
    const onResize = () => {
      if (!held) rest()
    }

    rest()
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    window.addEventListener('pointercancel', onUp, { passive: true })
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onResize)
    touch.addEventListener('change', onResize)
    document.documentElement.addEventListener('pointerleave', rest)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(release)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', onResize)
      touch.removeEventListener('change', onResize)
      document.documentElement.removeEventListener('pointerleave', rest)
    }
  }, [])
}
