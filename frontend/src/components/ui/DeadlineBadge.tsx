import { daysLeft } from '../../lib/format'
import Badge from './Badge'

export default function DeadlineBadge({ deadline }: { deadline: string }) {
  const n = daysLeft(deadline)
  if (n < 0) return <Badge tone="neutral">Closed</Badge>
  const tone = n <= 3 ? 'danger' : n <= 7 ? 'warning' : 'success'
  return <Badge tone={tone}>{n === 0 ? 'Due today' : `${n} Day${n === 1 ? '' : 's'} Left`}</Badge>
}