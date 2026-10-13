import { RefreshCw } from 'lucide-react'
import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  onRefresh?: () => void
  className?: string
  children: ReactNode
}

export default function Card({ title, onRefresh, className = '', children }: CardProps) {
  return (
    <section className={`rounded-xl border border-border bg-surface shadow-sm ${className}`}>
      {title && (
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="font-medium">{title}</h2>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              aria-label={`Refresh ${title}`}
              title="Refresh"
              className="rounded-md border border-border p-1.5 text-primary hover:bg-surface-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  )
}