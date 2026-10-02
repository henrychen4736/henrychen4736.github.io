import { useEffect, useMemo, useRef } from 'react'
import { theme } from '../config/theme'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKS = 52

/**
 * GitHub-style contribution heatmap. Uses deterministic placeholder data
 * for the mockup (bursty weeks, quieter weekends).
 */
export function ContributionGraph({ total }: { total: number }) {
  const weeks = useMemo(() => {
    let s = 42
    const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647)
    return Array.from({ length: WEEKS }, (_, w) => {
      const busy = 0.35 + 0.65 * Math.abs(Math.sin(w / 4.3)) * (rand() > 0.15 ? 1 : 0.2)
      return Array.from({ length: 7 }, (_, d) => {
        const weekend = d === 0 || d === 6 ? 0.45 : 1
        const v = rand() * busy * weekend
        return v < 0.18 ? 0 : v < 0.35 ? 1 : v < 0.5 ? 2 : v < 0.65 ? 3 : 4
      })
    })
  }, [])

  // On narrow screens the graph scrolls; start at the most recent weeks.
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current) ref.current.scrollLeft = ref.current.scrollWidth
  }, [])

  return (
    <div className="heat" ref={ref}>
      <div className="heat__months">
        {MONTHS.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
      <div className="heat__grid">
        {weeks.map((days, w) => (
          <div key={w} className="heat__week">
            {days.map((level, d) => (
              <span key={d} className="heat__cell" style={{ background: theme.colors.heat[level] }} />
            ))}
          </div>
        ))}
      </div>
      <div className="heat__foot">
        <span>{total} contributions in the last year</span>
        <span className="heat__legend">
          Less
          {theme.colors.heat.map((c) => (
            <span key={c} className="heat__cell" style={{ background: c }} />
          ))}
          More
        </span>
      </div>
    </div>
  )
}
