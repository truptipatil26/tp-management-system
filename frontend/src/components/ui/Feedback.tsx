import { AlertCircle, Inbox, Loader2, type LucideIcon } from 'lucide-react'
import Button from './Button'

export function Spinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-2 p-8 text-muted">
      <Loader2 className="animate-spin" size={18} />
      <span>{label}</span>
    </div>
  )
}

export function ErrorBlock({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-xl border border-danger/40 bg-danger/10 p-6 text-center">
      <AlertCircle className="text-danger" />
      <p className="text-danger">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  message,
}: {
  icon?: LucideIcon
  title: string
  message?: string
}) {
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-center">
      <Icon className="text-muted" size={32} />
      <p className="font-medium">{title}</p>
      {message && <p className="max-w-xs text-sm text-muted">{message}</p>}
    </div>
  )
}