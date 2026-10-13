import type { ReactNode } from 'react'
import { formatStatus } from '../../lib/format'

export type Tone = 'success' | 'warning' | 'danger' | 'primary' | 'neutral'

const TONES: Record<Tone, string> = {
  success: 'border-success/40 bg-success/10 text-success',
  warning: 'border-warning/40 bg-warning/10 text-warning',
  danger: 'border-danger/40 bg-danger/10 text-danger',
  primary: 'border-primary/40 bg-primary/10 text-primary',
  neutral: 'border-border bg-surface-alt text-muted',
}

export default function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${TONES[tone]}`}
    >
      {children}
    </span>
  )
}

const STATUS_TONES: Record<string, Tone> = {
  // company
  approved: 'success', pending: 'warning', rejected: 'danger', suspended: 'danger',
  // drive
  published: 'success', draft: 'neutral', pending_approval: 'warning', closed: 'neutral', archived: 'neutral',
  // application
  applied: 'primary', under_review: 'warning', shortlisted: 'success',
  interview_scheduled: 'primary', selected: 'success', withdrawn: 'neutral',
}

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={STATUS_TONES[status] ?? 'neutral'}>{formatStatus(status)}</Badge>
}