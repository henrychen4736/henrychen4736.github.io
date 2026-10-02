import type { ComponentType, ReactNode, SVGProps } from 'react'
import { Glass } from './Glass'

interface CardProps {
  title: string
  /** A pixelarticons component */
  icon: ComponentType<SVGProps<SVGSVGElement>>
  /** Optional controls on the right of the title row */
  actions?: ReactNode
  className?: string
  children: ReactNode
}

/** Liquid-glass card with a pixel-font heading. */
export function Card({ title, icon: Icon, actions, className = '', children }: CardProps) {
  return (
    <Glass preset="card" fill radius={22} className={`card ${className}`} contentClassName="card__box">
      <header className="card__head">
        <span className="badge">
          <Icon width={24} height={24} />
        </span>
        <h2>{title}</h2>
        {actions && <div className="card__actions">{actions}</div>}
      </header>
      <div className="card__body">{children}</div>
    </Glass>
  )
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="tag edge-glow">{children}</span>
}
