import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Glass } from './Glass'

interface CardProps {
  title: string
  icon: LucideIcon
  /** Optional controls on the right of the title row */
  actions?: ReactNode
  className?: string
  children: ReactNode
}

/** Dark liquid-glass card with a pixel-font heading. */
export function Card({ title, icon: Icon, actions, className = '', children }: CardProps) {
  return (
    <Glass as="section" className={`card ${className}`} radius={22} bezel={22} refraction={-70} blur={3}>
      <header className="card__head">
        <span className="badge">
          <Icon size={18} strokeWidth={1.75} />
        </span>
        <h2>{title}</h2>
        {actions && <div className="card__actions">{actions}</div>}
      </header>
      <div className="card__body">{children}</div>
    </Glass>
  )
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="tag">{children}</span>
}
